import { GENRES, PEGI, PLATFORMS } from "../load_data.js";
import { addGame, editGame, getGame } from "../service.js";


export const insertGame = async (req, res) => {
	let game = {
		title: req.body?.title ?? null,
		description: req.body?.description ?? null,
		genres: req.body?.genres ?? [],
		platforms: req.body?.platforms ?? [],
		release_date: req.body?.release_date
			? new Date(req.body.release_date)
			: null,
		developer: req.body?.developer ?? null,
		cover_image: req.file ? `/${req.file.filename}` : null,
		pegi_rating: req.body?.pegi_rating ?? null,
		reviews: [],
	};

	try {
		const gameObject = await addGame(game);
		res.status(200).json({id: gameObject._id});
	} catch(error) {
		if (error.errors) {
			console.log({ errors: error.errors});
			return res.status(400).json({ errors: error.errors});
		}
		return res.status(500).json({});
	}
};

export const editFormGame = async (req, res) => {
	try {
		const id = req.body.id;
		await editGame(id, req.body, req.file);

		res.status(200).json({
			id,
		});

	} catch(error) {
		res.status(400).json({
			errors: error.errors
		});
	}
};

const formatOptions = (allOptions, selectedOptions = []) => {
	return allOptions.map(option => ({
		name: option,
		checked: selectedOptions.includes(option)
	}));
};

const formatSelectOptions = (allOptions, selectedValue = "") => {
	return allOptions.map(option => ({
		value: option,
		selected: option === selectedValue
	}));
};


export const getNewGameForm = (req, res) => {
	const emptyGame = {
		title: "",
		description: "",
		genres: [],
		platforms: [],
		release_date: "",
		developer: "",
		pegi_rating: "",
		cover_image: ""
	};

	res.render("new-game-form", {
		game: emptyGame,
		action: "/game",
		GENRES: formatOptions(GENRES, emptyGame.genres),
		PLATFORMS: formatOptions(PLATFORMS, emptyGame.platforms),
		PEGI: formatSelectOptions(PEGI, emptyGame.pegi_rating)
	});
};

export const getEditGameForm = async (req, res) => {
	const id = req.body.id ?? 0;
	let game = await getGame(id);

	game = {
		...game,
		id: id,
		release_date: game.release_date.toISOString().split("T")[0],
	};

	res.render("edit-game-form", {
		game,
		GENRES: formatOptions(GENRES, game.genres),
		PLATFORMS: formatOptions(PLATFORMS, game.platforms),
		PEGI: formatSelectOptions(PEGI, game.pegi_rating)
	});
};

