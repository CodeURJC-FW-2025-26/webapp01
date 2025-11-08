import {
	describe,
	it,
	expect,
	beforeAll,
	afterAll,
	beforeEach,
	vi,
} from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Monkito } from "../src/lib/monkito.js";
import { ObjectId } from "mongodb";

let mongod;
let db;
let User;

describe("Monkito ORM", () => {
	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		db = await Monkito.connect(uri, "testdb");
	});

	afterAll(async () => {
		await Monkito.close();
		await mongod.stop();
	});

	beforeEach(async () => {
		await db.dropDatabase();
		User = Monkito.model("User", {
			schema: {
				name: { type: "string", required: true },
				age: { type: "number" },
				createdAt: { type: "date" },
				updatedAt: { type: "date" },
				deleted: { type: "boolean" },
				deletedAt: { type: "date" },
			},
			timestamps: true,
			softDelete: true,
			validate: (doc) => {
				if (!doc.name)
					return { valid: false, errors: ["name required"] };
				return { valid: true };
			},
		});

		Monkito.withTransaction = async (fn) => {
			return fn();
		};
	});

	it("should connect and return a db instance", async () => {
		expect(db).toBeDefined();
		expect(Monkito.db()).toBe(db);
	});

	it("should create a document", async () => {
		const user = await User.create({ name: "Alice", age: 30 });
		expect(user._id).toBeInstanceOf(ObjectId);
		expect(user.name).toBe("Alice");
	});

	it("should fail validation if name missing", async () => {
		await expect(User.create({})).rejects.toThrow(/Validation failed/);
	});

	it("should find a document", async () => {
		await User.create({ name: "Bob" });
		const found = await User.findOne({ name: "Bob" });
		expect(found.name).toBe("Bob");
	});

	it("should update a document", async () => {
		const user = await User.create({ name: "Charlie" });
		const updated = await User.updateOne(
			{ _id: user._id },
			{ $set: { name: "Charles" } }
		);
		expect(updated.name).toBe("Charles");
	});

	it("should support findById and findByIdAndUpdate", async () => {
		const user = await User.create({ name: "Dana" });
		const found = await User.findById(user._id);
		expect(found.name).toBe("Dana");

		const updated = await User.findByIdAndUpdate(user._id, {
			$set: { name: "Dany" },
		});
		expect(updated.name).toBe("Dany");
	});

	it("should soft delete documents", async () => {
		const user = await User.create({ name: "Eve" }, { softDelete: true });
		await User.deleteMany({ _id: user._id });
		const found = await User.findOne({ _id: user._id });
		expect(found).toBeNull();
	});

	it("should paginate correctly", async () => {
		for (let i = 0; i < 25; i++) {
			await User.create({ name: "User" + i });
		}
		const page1 = await User.paginate({}, { page: 1, pageSize: 10 });
		expect(page1.docs.length).toBe(10);
		expect(page1.total).toBe(25);
		expect(page1.totalPages).toBe(3);
	});

	it("should aggregate", async () => {
		await User.insertMany([
			{ name: "A", age: 20 },
			{ name: "B", age: 30 },
		]);
		const result = await User.aggregate([
			{ $group: { _id: null, avgAge: { $avg: "$age" } } },
		]);
		expect(result[0].avgAge).toBe(25);
	});

	it("should count documents", async () => {
		await User.insertMany([{ name: "X" }, { name: "Y" }]);
		const count = await User.count();
		expect(count).toBe(2);
	});

	it("should run hooks", async () => {
		const preCreate = vi.fn();
		const postCreate = vi.fn();
		User.pre("create", preCreate);
		User.post("create", postCreate);
		await User.create({ name: "Hooked" });
		expect(preCreate).toHaveBeenCalled();
		expect(postCreate).toHaveBeenCalled();
	});

	it("should support populate", async () => {
		const Post = Monkito.model("Post", {});
		const user = await User.create({ name: "Frank" });
		const post = await Post.create({ title: "Hello", author: user._id });

		const populated = await Post.populate(post, "author", { model: User });
		expect(populated.author.name).toBe("Frank");
	});

	it("should support transactions", async () => {
		await Monkito.withTransaction(async (session) => {
			const col = db.collection("txn");
			await col.insertOne({ a: 1 }, { session });
			const count = await col.countDocuments({}, { session });
			expect(count).toBe(1);
		});
	});
});
