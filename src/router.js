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
const upload = multer({ dest: "uploads/" });


router.get("/", gameHandler.getPaginatedGames);

router.get("/detail/:id", gameDetailHandler.getGameDetail);

router.get("/form", formHandler.getForm);

router.get("/error", errorHandler.getError);

router.post("/confirm", confirmHandler.getConfirmation);

router.post("/submit-game-form", upload.single("cover_image"), async (req, res) => {
	//To check that there are not empty/invalid fields
	for (let key in req.body) {
		if (typeof req.body[key] === "string")
			req.body[key] = req.body[key].trim();

		if (!req.body[key]) {
			return getError({ type: "An empty or invalid field was sent", back: "form" }, res);
		}
	}
	if (!req.file) {
		return getError({ type: "No cover image uploaded", back: "form" }, res);
	}

	const releaseDateObj = new Date(req.body.release_date);
	if (isNaN(releaseDateObj)) {
		return getError({ type: "Invalid release date", back: "form" }, res);
	}

	req.body.release_date = releaseDateObj;
	req.body.reviews = [];
	req.body.cover_image = req.file.filename;


	try {
		const gameObject = await addGame(req.body);
		getConfirmation({ id: gameObject._id }, res);
	}
	catch (error) {
		getError({ type: error, back: "form" });
	}

});

export default router;