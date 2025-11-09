import { Monkito } from "./lib/monkito.js";
//the schema comes from data.JSON 
const Game = Monkito.model("Game", {
	collection: "games",
	schema: {
		title: { type: "string", required: true },         
		description: { type: "string" },                 
		genres: { type: "array" },                           
		platforms: { type: "array" },                     
		release_year: { type: "number" },                   
		developer: { type: "string" },                      
		cover_image: { type: "string" },                     
		pegi_rating: { type: "string" },                    
		reviews: { type: "array" },                         
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

//this is going to be used to know if the "next page" button is available
export async function howManyGames(){
	return await Game.count();
}