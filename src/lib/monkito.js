import { MongoClient, ObjectId } from "mongodb";

class Monkito {
	static _client = null;
	static _db = null;
	static models = new Map();

	static async connect(uri, dbName, clientOptions = {}) {
		if (Monkito._client) return Monkito._db;

		// TODO(Sa4dUs): grab this settings from a proper config file
		const client = new MongoClient(uri, {
			useUnifiedTopology: true,
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
		if (Monkito.models.has(name)) return Monkito.model.get(name);
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
		} catch {
			await session.endSession();
			throw err;
		}
	}
}

// eslint-disable-next-line no-unused-vars
function isObject(x) {
	return x && typeof x === "object" && !Array.isArray(x);
}

// eslint-disable-next-line no-unused-vars
function toObjectId(id) {
	if (!id) return null;
	if (id instanceof ObjectId) return id;
	try {
		return new ObjectId(id);
	} catch {
		return id;
	}
}

// eslint-disable-next-line no-unused-vars
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

class Model {}

export { Monkito, QueryBuilder, Model };
