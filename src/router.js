import express from "express";
import multer from "multer";

import * as service from "./service.js";

const router = express.Router();
export default router;
//luego se queja de esto macho -_-
// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });


//for main page
router.get("/", async (req, res) => {
	let page=parseInt(req.query.page)||1;
	let gamesPerPage=parseInt(req.query.limit)||9;
	let games = await service.getGames(page,gamesPerPage);
	let totalGames = await service.howManyGames();
	let totalPages = Math.ceil(totalGames / gamesPerPage); 
	let pages=[];
	for (let i=1; i<=totalPages;i++){
		pages.push({number: i, isActualPage: (i===page)}) //true if i === page
	}

	const isFirstPage = (page===1);
	const isLastPage = (page===totalPages);
	let prevPage;
	let nextPage;

	if (isFirstPage) {
		prevPage=1;
	}else{
		prevPage=page-1;
	}
	if (isLastPage){
		nextPage=totalPages;
	}else{
		nextPage=page+1
	}

	res.render("index", { games, pages, page, isFirstPage, isLastPage, nextPage, prevPage });
});


//for detail page
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
