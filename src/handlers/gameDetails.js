import * as service from "../service.js";

export const getGameDetail = async (req, res) => {
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
};