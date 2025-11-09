import * as service from "../service.js";
import { PAGE_SIZE } from "../router.js";


export const getPaginatedGames = async (req, res) => {
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
};