import fs from "node:fs/promises";
import * as service from "./service.js";

const UPLOADS_FOLDER = "./uploads";
const DATA_FOLDER = "./data";

export const GENRES = JSON.parse(
	await fs.readFile(`${DATA_FOLDER}/genres.json`, "utf8")
).genres;

export const PLATFORMS = JSON.parse(
	await fs.readFile(`${DATA_FOLDER}/platforms.json`, "utf8")
).platforms;

export const PEGI = JSON.parse(
	await fs.readFile(`${DATA_FOLDER}/pegi_rating.json`, "utf8")
).pegi_rating;

export async function loadInitialData() {
	const dataFile = "/data.json";



	const dataString = await fs.readFile(DATA_FOLDER + "/" + dataFile, "utf8");

	const games = JSON.parse(dataString).map((g) => {
		return {
			...g,
			release_date: new Date(g.release_date),
		};
	});

	await service.deleteGames();
	for (let game of games) {
		await service.addGame(game);
	}


	await fs.rm(UPLOADS_FOLDER, { recursive: true, force: true });
	await fs.mkdir(UPLOADS_FOLDER);
	await fs.cp(DATA_FOLDER + "/images", UPLOADS_FOLDER, { recursive: true });

	console.log("Demo data loaded");
}
