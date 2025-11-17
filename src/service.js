import { Monkito, toObjectId } from "./lib/monkito.js";
//the schema comes from data.JSON
const Game = Monkito.model("Game", {
	collection: "games",
	schema: {
		title: { type: "string", required: true },      
		description: { type: "string", required: true },              
		genres: { type: "array", required: true },                     
		platforms: { type: "array", required: true },
		//Handled in Monkito
		release_date: { type: "date", required: true },
		developer: { type: "string", required: true },                  
		cover_image: { type: "string", required: true },              
		pegi_rating: { type: "string", required: true },              
		reviews: { type: "array", required: true },                    
  	}
});

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

export async function addReview(gameId, review) {
	return await Game.updateOne(
		{ _id: toObjectId(gameId) },
		{ $push: { reviews: review } }, //update
		{ returnDocument: "after" }
	);
}

export async function deleteReview(gameId, reviewId) {
	const game = await getGame(gameId)
	console.log(game)
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
