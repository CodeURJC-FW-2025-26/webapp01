import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import { Monkito } from "./lib/monkito";

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

export async function deleteGames() {
	return await Game.deleteMany({});
}

export async function getGames(page, gamesPerPage) {
	return await Game.paginate({}, {page:page, pageSize:gamesPerPage});
}

export async function getGame(id) {
	return await Game.findById(id);
}

//this is going to be used to know if the "next page" button is available
export async function howManyGames(){
	return await Game.count();
}