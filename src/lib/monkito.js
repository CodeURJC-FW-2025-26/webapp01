import { MongoClient, ObjectId } from "mongodb";

class Monkito {
	static _client = null;
	static _db = null;
	static models = new Map();

	static async connect(uri, dbName, clientOptions = {}) {
		if (Monkito._client) return Monkito._db;

		const client = new MongoClient(uri, {
			...clientOptions,
		});

		await client.connect();
		Monkito._client = client;
		Monkito._db = client.db(dbName);
		return Monkito._db;
	}

	static db() {
		if (!Monkito._db)
			throw new Error(
				"Monkito not connected. Call Monkito.connect(uri, dbName)"
			);
		return Monkito._db;
	}

	static client() {
		if (!Monkito._client)
			throw new Error(
				"Monkito not connected. Call Monkito.connect(uri, dbName)"
			);
		return Monkito._client;
	}

	static model(name, options = {}) {
		if (Monkito.models.has(name)) return Monkito.models.get(name);
		const model = new Model(name, options);
		Monkito.models.set(name, model);
		return model;
	}

	static async close() {
		if (Monkito._client) await Monkito._client.close();
		Monkito._client = null;
		Monkito._db = null;
		Monkito.models.clear();
	}

	static async withTransaction(f, options = {}) {
		const client = Monkito.client();
		const session = client.startSession();

		try {
			let result;
			await session.withTransaction(async () => {
				result = await f(session);
			}, options);
			await session.endSession();
			return result;
		} catch (err) {
			await session.endSession();
			throw err;
		}
	}
}

function isObject(x) {
	return x && typeof x === "object" && !Array.isArray(x);
}

function toObjectId(id) {
	if (!id) return null;
	if (id instanceof ObjectId) return id;
	try {
		return new ObjectId(id);
	} catch {
		return id;
	}
}

class QueryBuilder {
	constructor(collection) {
		this._collection = collection;
		this._filter = {};
		this._opts = {};
		this._pipeline = null;
		this._populate = [];
	}

	where(filter) {
		Object.assign(this._filter, filter);
		return this;
	}

	sort(sort) {
		this._opts.sort = sort;
		return this;
	}

	limit(n) {
		this._opts.limit = n;
		return this;
	}

	skip(n) {
		this._opts.skip = n;
		return this;
	}

	project(p) {
		this._opts.projection = p;
		return this;
	}

	hint(h) {
		this._opts.hint = h;
		return this;
	}

	aggregate(pipeline) {
		this._pipeline = pipeline;
		return this;
	}

	populate(field, options = {}) {
		this._populate.push({ field, options });
		return this;
	}

	async toArray() {
		if (this._pipeline) {
			return this._collection
				.aggregate(this._pipeline, this._opts)
				.toArray();
		}
		const docs = await this._collection
			.find(this._filter, this._opts)
			.toArray();
		return docs;
	}

	async first() {
		if (this._pipeline) {
			const arr = await this._collection
				.aggregate(this._pipeline, this._opts)
				.limit(1)
				.toArray();
			return arr[0] || null;
		}
	}

	async count() {
		return this._collection.countDocuments(this._filter, this._opts);
	}
}

class Model {
	constructor(name, options = {}) {
		this.name = name;
		this.collectionName = options.collection || name.toLowerCase() + "s";
		this.schema = options.schema || null;
		this.timestamps = options.timestamps ?? true;
		this.softDelete = options.softDelete ?? false;
		this.versionKey = options.versionKey ?? "__v";
		this.validateFn = options.validate || null;
		this.hooks = {
			pre: { create: [], update: [], delete: [], find: [] },
			post: { create: [], update: [], delete: [], find: [] },
		};
	}

	collection() {
		return Monkito.db().collection(this.collectionName);
	}

	pre(hook, fn) {
		if (this.hooks.pre[hook]) this.hooks.pre[hook].push(fn);
		return this;
	}

	post(hook, fn) {
		if (this.hooks.post[hook]) this.hooks.post[hook].push(fn);
		return this;
	}

	async _runHooks(type, hook, payload) {
		const list = this.hooks[type][hook] || [];
		for (const fn of list) {
			await fn(payload);
		}
	}

	_prepareDocument(doc, { isNew = true } = {}) {
		const d = { ...doc };
		if (this.timestamps) {
			const now = new Date();
			if (isNew) d.createdAt = d.createdAt || now;
			d.updatedAt = now;
		}

		return d;
	}

	async _validate(doc) {
		if (!this.schema && !this.validateFn) return { valid: true };

		const errors = [];

		if (this.schema) {
			for (const [key, def] of Object.entries(this.schema)) {
				const val = doc[key];

				if (def.required && (val === undefined || val === null)) {
					errors.push(`${key} is required`);
					continue;
				}

				if (val !== undefined && val !== null && def.type) {
					const type = def.type.toLowerCase();
					if (
						(type === "number" && typeof val !== "number") ||
						(type === "string" && typeof val !== "string") ||
						(type === "boolean" && typeof val !== "boolean") ||
						(type === "date" && !(val instanceof Date))
					) {
						errors.push(`${key} must be a ${type}`);
					}
				}
			}
		}

		if (this.validateFn) {
			try {
				const r = await this.validateFn(doc);
				if (r && r.valid === false && r.errors)
					errors.push(...r.errors);
			} catch (err) {
				errors.push(err.message || String(err));
			}
		}

		if (errors.length) return { valid: false, errors };
		return { valid: true };
	}

	async create(doc, opts = {}) {
		await this._runHooks("pre", "create", doc);
		const d = this._prepareDocument(doc, { isNew: true });
		const v = await this._validate(d);
		if (!v.valid)
			throw new Error("Validation failed: " + JSON.stringify(v.errors));

		if (this.versionKey) d[this.versionKey] = 0;
		const res = await this.collection().insertOne(d, opts);
		const out = { _id: res.insertedId, ...d };
		await this._runHooks("post", "create", out);
		return out;
	}

	async insertMany(docs, opts = {}) {
		const prepared = docs.map((d) =>
			this._prepareDocument(d, { isNew: true })
		);

		for (const p of prepared) {
			const v = await this._validate(p);
			if (!v.valid)
				throw new Error(
					"Validation failed: " + JSON.stringify(v.errors)
				);
			if (this.versionKey) p[this.versionKey] = 0;
			const res = await this.collection().insertMany(prepared, opts);
			return {
				insertedCount: res.insertedCount,
				insertedIds: res.insertedIds,
			};
		}
	}

	find(filter = {}, opts = {}) {
		const qb = new QueryBuilder(this.collection());
		if (this.softDelete) filter = { ...filter, deleted: { $ne: true } };
		qb.where(filter);
		if (opts.projection) qb.project(opts.projection);
		if (opts.sort) qb.sort(opts.sort);
		if (opts.skip) qb.skip(opts.skip);
		if (opts.limit) qb.limit(opts.limit);
		return qb;
	}

	async findOne(filter = {}, opts = {}) {
		if (this.softDelete) filter = { ...filter, deleted: { $ne: true } };
		await this._runHooks("pre", "find", filter);
		const doc = await this.collection().findOne(filter, opts);
		await this._runHooks("post", "find", doc);
		return doc;
	}

	async findById(id, opts = {}) {
		const _id = toObjectId(id);
		return this.findOne({ _id }, opts);
	}

	async updateOne(filter, update, opts = {}) {
		await this._runHooks("pre", "update", { filter, update });

		const apply = { $set: {}, $inc: {} };
		const now = new Date();
		if (this.timestamps) apply.$set.updatedAt = now;

		if (update.$set) Object.assign(apply.$set, update.$set);
		if (update.$inc) Object.assign(apply.$inc, update.$inc);
		if (update.$unset) apply.$unset = update.$unset;
		if (update.$push) apply.$push = update.$push;

		if (
			isObject(update) &&
			!update.$set &&
			!update.$inc &&
			!update.$unset &&
			!update.$push
		) {
			Object.assign(apply.$set, update);
		}

		const finalUpdate = {};
		for (const k of Object.keys(apply)) {
			if (Object.keys(apply[k]).length) finalUpdate[k] = apply[k];
		}
		const res = await this.collection().findOneAndUpdate(
			filter,
			finalUpdate,
			{
				returnDocument: "after",
				...opts,
			}
		);
		await this._runHooks("post", "update", {
			filter,
			update,
			result: res,
		});
		return res;
	}

	async updateMany(filter, update, opts = {}) {
		await this._runHooks("pre", "update", { filter, update });
		const now = new Date();
		if (this.timestamps) {
			update =
				isObject(update) && !update.$set
					? { $set: { ...update, updatedAt: now } }
					: {
						...update,
						$set: { ...(update.$set || {}), updatedAt: now },
					  };
		}
		const res = await this.collection().updateMany(filter, update, opts);
		await this._runHooks("post", "update", { filter, update, result: res });
		return res;
	}

	async findByIdAndUpdate(id, update, opts = {}) {
		const _id = toObjectId(id);
		return this.updateOne({ _id }, update, opts);
	}

	async deleteMany(filter, opts = {}) {
		if (this.softDelete) {
			const res = await this.collection().updateMany(
				filter,
				{ $set: { deleted: true, deletedAt: new Date() } },
				opts
			);
			return res;
		}
		return this.collection().deleteMany(filter, opts);
	}

	async findByIdAndDelete(id, opts = {}) {
		const _id = toObjectId(id);
		return this.deleteOne({ _id }, opts);
	}

	async aggregate(pipeline = [], opts = {}) {
		return this.collection().aggregate(pipeline, opts).toArray();
	}

	async count(filter = {}) {
		if (this.softDelete) filter = { ...filter, deleted: { $ne: true } };
		return this.collection().countDocuments(filter);
	}

	async paginate(
		filter = {},
		{ page = 1, pageSize = 20, sort = null, projection = null } = {}
	) {
		if (this.softDelete) filter = { ...filter, deleted: { $ne: true } };

		page = Math.max(1, parseInt(page));
		pageSize = Math.max(1, parseInt(pageSize));

		const skip = (page - 1) * pageSize;
		const cursor = this.collection().find(filter);

		if (sort) cursor.sort(sort);
		if (projection) cursor.project(projection);

		const docs = await cursor.skip(skip).limit(pageSize).toArray();
		const total = await this.collection().countDocuments(filter);

		return {
			docs,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	async createIndexes(indexes = []) {
		return this.collection().createIndexes(indexes);
	}

	async populate(docs, field, options = {}) {
		if (!docs) return docs;

		const many = Array.isArray(docs);
		const arr = many ? docs : [docs];
		const ids = new Set();

		for (const d of arr) {
			const val = d[field];
			if (Array.isArray(val)) val.forEach((v) => ids.add(String(v)));
			else if (val) ids.add(String(val));
		}

		if (!ids.size) return docs;
		const idsArr = Array.from(ids).map((x) => toObjectId(x));

		const foreign = options.model;
		if (!foreign) throw new Error("populate requires options.model");

		const found = await foreign
			.collection()
			.find({ _id: { $in: idsArr } })
			.toArray();

		const map = new Map(found.map((f) => [String(f._id), f]));

		for (const d of arr) {
			const val = d[field];
			if (Array.isArray(val))
				d[field] = val.map((v) => map.get(String(v)) || null);
			else if (val) d[field] = map.get(String(val)) || null;
		}

		return many ? arr : arr[0];
	}

	query() {
		return this.find();
	}
}

export { Monkito, Model };
