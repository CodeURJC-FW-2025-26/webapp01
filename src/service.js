import { Monkito } from "./lib/monkito.js";
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
  	}
});

export async function addGame(post) {
	return await Game.create(post);
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

export async function getGame(id) {
	return await Game.findById(id);
}