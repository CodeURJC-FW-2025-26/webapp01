import express from "express";
import { Monkito } from "./lib/monkito.js";

const router = express.Router();
export default router;
export const UPLOADS_FOLDER = "./uploads";
await Monkito.connect("mongodb://localhost:27017", "store"); //"store" just to mantain the same name 
const Game = Monkito.model("Game", { collection: "games" });

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