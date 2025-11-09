import express from "express";
import multer from "multer";

import * as service from "./service.js";

const router = express.Router();
export default router;
export const PAGE_SIZE = 6;

// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });

router.get("/", async (req, res) => {
	const parsed = parseInt(req.query.page);
	const page = Number.isNaN(parsed) ? 1 : Math.max(parseInt(req.query.page), 1);

  	const { docs: games = [], totalPages = 1 } = await service.getGamesPaginated(page, PAGE_SIZE); 

  	const prevPage = Math.max(page - 1, 1);
  	const nextPage = Math.min(page + 1, totalPages);

  	const isFirstPage = page === 1;
  	const isLastPage = page === totalPages;

	res.render("index", {
		games, 
		page,
		prevPage,
		nextPage,
		isFirstPage,
		isLastPage,
	});
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
