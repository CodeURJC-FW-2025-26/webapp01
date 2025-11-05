import express from "express";
import multer from "multer";

import * as service from "./service.js";

const router = express.Router();
export default router;

// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });

router.get("/", async (req, res) => {
	let games = await service.getGames();
	res.render("index", { games });
});

router.get("/detail/:id", async (req, res) => {
	const id = req.params.id ?? 0;
	let game = await service.getGame(id);
	game = {
		...game,
		average_rating:
			game.reviews.reduce((acc, e) => e.rating + acc, 0) /
			game.reviews.length,
	};

	if (!game) res.status(404); // FIXME: show error page or smth
	res.render("detail", game);
});

router.get("/form", async (req, res) => {
	res.render("form");
});
