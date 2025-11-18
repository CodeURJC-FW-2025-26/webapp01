import { Monkito, toObjectId } from "./lib/monkito.js";
//the schema comes from data.JSON
const Game = Monkito.model("Game", {
	collection: "games",
	schema: {
		title: { type: "string", required: true },      
		description: { type: "string", required: true },              
		genres: { type: "array", required: true },                     
		platforms: { type: "array", required: true },
		release_date: { type: "date", required: true },
		developer: { type: "string", required: true },                  
		cover_image: { type: "string", required: true },              
		pegi_rating: { type: "string", required: true },              
		reviews: { type: "array", required: true },      
		average_rating: { type: "number" }
  	},
	validate: async (doc) => {
		const errors = [];

		for (const [key, value] of Object.entries(doc)) {
			if (typeof value === "string") {
				doc[key] = value.trim();
			}
		}

		for (const key of ["title", "description", "developer"]) {
			if (!doc[key]) errors.push(`${key} cannot be empty`);
		}

		for (const key of ["genres", "platforms"]) {
			if (
				(Array.isArray(doc[key]) && doc[key].length === 0) ||
				(!Array.isArray(doc[key]) && !doc[key])
			) {
				errors.push(`${key} must be a non-empty array`);
			}
		}

		if (
			!(doc.release_date instanceof Date) ||
			isNaN(doc.release_date.getTime())
		) {
			errors.push("release_date must be a valid date");
		}

		if (!doc.cover_image) {
			errors.push("cover_image file is required");
		}

		let duplicated = await Game.findOne({ title: doc.title });
		
		if (duplicated && !duplicated._id.equals(doc._id)) {
			errors.push("title must be unique");
		}

		if (doc.title[0] !== doc.title[0].toUpperCase()) {
			errors.push("title must start with uppercase");
		}

		if (1 > doc.description.length || 400 < doc.description.length) {
			errors.push("description must be between 1 and 400 chars");
		}

		if (errors.length) return { valid: false, errors };
		return { valid: true };
	},
});

Game.pre("create", createHook);
Game.pre("update", updateHook);

export async function addGame(game) {
	return await Game.create(game);
}

export async function deleteGame(id) {
	return await Game.findByIdAndDelete(id);
}

export async function deleteGames(filter={}) {
	return await Game.deleteMany(filter);
}

export async function getGames(filter = {}, options = {}) {
	return Game.find(filter, options).toArray();
}

export async function getGamesPaginated(page = 1, pageSize = 6, filter = {}, options = {}) {
	return Game.paginate(filter, { page, pageSize, ...options });
}

export async function editGame(id, data, file = null) {
	const _id = toObjectId(id);
	const updateData = {
		title: data.title,
		description: data.description,
		genres: Array.isArray(data.genres) ? data.genres : [data.genres],
		platforms: Array.isArray(data.platforms) ? data.platforms : [data.platforms],
		release_date: new Date(data.release_date),
		developer: data.developer,
		pegi_rating: data.pegi_rating
	};

	if (file) {
		updateData.cover_image = `/${file.filename}`;
	}

	return await Game.updateOne(
		{ _id },
		{ $set: updateData },
		{ returnDocument: "after" }
	);
}

export async function addReview(gameId, review) {
	return await Game.updateOne(
		{ _id: toObjectId(gameId) },
		{ $push: { reviews: review } }, //update
		{ returnDocument: "after" }
	);
}

export async function deleteReview(gameId, reviewId) {
	return await Game.updateOne(
		{ _id: toObjectId(gameId) }, //filter
		{ $pull: { reviews: { _id: toObjectId(reviewId) } } }, //update
		{ returnDocument: "after" } 
	);
}

export async function updateReview(gameId, reviewId, updatedData) {
	return await Game.updateOne(
		{ _id: toObjectId(gameId), "reviews._id": toObjectId(reviewId) },
		{
			$set: {
				"reviews.$.author": updatedData.author,
				"reviews.$.comment": updatedData.comment,
				"reviews.$.rating": Number(updatedData.rating),
				"reviews.$.updatedAt": new Date()
			}
		}
	);
}

export async function updateOneGame(filter, update, opts={}){
	return await Game.updateOne(filter, update, opts);
}

export async function getGame(id) {
	return await Game.findById(id);
}

export async function createHook(doc) {
	doc.average_rating = averageRating(doc.reviews);
}

export async function updateHook({ update, filter }) {
	if (
		!update.$set?.reviews &&
		!Object.keys(update.$set || {}).some((k) =>
			k.startsWith("reviews.$")
		) &&
		!update.$push?.reviews &&
		!update.$pull?.reviews
	)
		return;

	const game = await Game.findOne({ _id: filter._id });
	let reviews = game?.reviews || [];

	if (update.$push?.reviews) reviews.push(update.$push.reviews);
	if (update.$pull?.reviews) {
		const pull = update.$pull.reviews;
		reviews = reviews.filter(
			(r) => !Object.keys(pull).every((k) => r[k].equals(pull[k]))
		);
	}

	for (const key of Object.keys(update.$set || {})) {
		if (key.startsWith("reviews.$")) {
			const field = key.replace("reviews.$.", "");
			const reviewId = filter["reviews._id"];
			reviews = reviews.map((r) =>
				r._id.equals(reviewId) ? { ...r, [field]: update.$set[key] } : r
			);
		}
	}

	update.$set = {
		...(update.$set || {}),
		average_rating: averageRating(reviews),
	};
}

export function averageRating(reviews) {
	if (reviews.length === 0) return 0;
	return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
}