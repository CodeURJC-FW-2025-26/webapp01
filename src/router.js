import express from "express";
import multer from "multer";

import * as service from "./service.js";
import * as gameHandler from "./handlers/games.js";
import * as gameDetailHandler from "./handlers/detail.js";
import * as formHandler from "./handlers/form.js";
import * as errorHandler from "./handlers/error.js";
import * as confirmHandler from "./handlers/confirm.js";
import { getError } from "./handlers/error.js";
import { getConfirmation } from "./handlers/confirm.js";
import { addGame } from "./service.js";


const router = express.Router();
export const PAGE_SIZE = 6;

// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });


router.get("/", gameHandler.getPaginatedGames);

router.get("/detail/:id", gameDetailHandler.getGameDetail);

router.get("/form", formHandler.getForm);

router.get("/error", errorHandler.getError);

router.post("/confirm", confirmHandler.getConfirmation);

router.post('/submit-game-form', (req, res) => {
	//To check that there are not empty/invalid fields
	for (let key in req.body) {

		if (typeof req.body[key] === "string")
			req.body[key] = req.body[key].trim();

		if (!req.body[key]) {
			return getError({ type: "An empty or invalid field was sent", back: "form" }, res)
		}
	}
	const formData = req.body
	return getConfirmation({ type: "game", data: formData }, res)

});


router.post('/submit-game-confirmation', (req, res) => {
	console.log(req.body);
	//Idk if this comprobation is strictly required but it not so harmful
	for (let key in req.body) {

		if (typeof req.body[key] === "string")
			req.body[key] = req.body[key].trim();

		if (!req.body[key]) {
			return getError({ type: "An empty or invalid field was sent", back: "form" }, res)
		}
	}
	const releaseDateObj = new Date(req.body.release_date);
	if (isNaN(releaseDateObj)) {
		return getError({ type: "Invalid release date", back: "form" }, res);
	}
	req.body.release_date = releaseDateObj;
	req.body.reviews = [];

	addGame(req.body);
	//After adding a game we return to home
	return gameHandler.getPaginatedGames(req,res);


});

router.post('/cancel-game-confirmation', (req, res) => {
	return res.render("form")
})

export default router;