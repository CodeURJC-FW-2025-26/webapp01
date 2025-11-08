import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const router = express.Router();
export default router;

const client = new MongoClient("mongodb://localhost:27017");

const db = client.db("store");
const games = db.collection("games");

export const UPLOADS_FOLDER = "./uploads";

export async function addGame(post) {
	return await games.insertOne(post);
}

export async function deleteGame(id) {
	return await games.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteGames() {
	return await games.deleteMany();
}

//mongo starts in 0 and the app in 1 (the -1)
export async function getGames(page=1, gamesPerPage=9) {
	return await games.find().skip((page-1)*gamesPerPage).limit(gamesPerPage).toArray();
}

export async function getGame(id) {
	return await games.findOne({ _id: new ObjectId(id) });
}

//this is going to be used to know if the "next page" button is available
export async function howManyGames(){
	return await games.countDocuments();
}