import { GENRES, PEGI, PLATFORMS } from "../load_data.js";
import { addGame, getGame } from "../service.js";


export const insertGame = async (req, res) => {
	let game = {
		title: req.body.title,
		description: req.body.description,
		genres: req.body.genres,
		platforms: req.body.platforms,
		release_date: req.body.release_date,
		developer: req.body.developer,
		pegi_rating: req.body.pegi_rating
	};

	for (let key in game) {
		if (typeof game[key] === "string") {
			game[key] = game[key].trim();
		}

		if (!game[key] || (Array.isArray(game[key]) && game[key].length === 0)) {
			return res.redirect(`/error?type=${msg}&back=/form`);
		}
	}

	if (!req.file) {
		return res.redirect(`/error?type=${msg}&back=/form`);
	}

	const releaseDateObj = new Date(req.body.release_date);
	if (isNaN(releaseDateObj)) {
		return res.redirect(`/error?type=${msg}&back=/form`);
	}

	game.release_date = releaseDateObj;
	game.reviews = [];
	game.cover_image = req.file.filename;

	try {
		const gameObject = await addGame(game);
		const msg= "The game has been succesfully created";
		return res.redirect(`/confirm?msg=${msg}&id=${gameObject._id}`);
	} catch (error) {
		return res.redirect(`/error?type=${msg}&back=/form`);
	}
};

export const editGame = async (req, res) =>{
	const id = req.body.id;
	console.log(id);
	res.redirect("/");
	//I need a method in the 
};

const formatOptions = (allOptions, selectedOptions = []) => {
	return allOptions.map(option => ({
		name: option,
		checked: selectedOptions.includes(option)
	}));
};


export const getNewGameForm = (req, res) => {
	    const emptyGame = {
		title: "",
		description: "",
		genres:[],
		platforms:[],
		release_date: "",
		developer: "",
		pegi_rating: "",
		cover_image: ""
	};

	res.render("new-game-form", {
		game:emptyGame,
		action : "/game",
		GENRES: formatOptions(GENRES, emptyGame.genres),
		PLATFORMS: formatOptions(PLATFORMS, emptyGame.platforms),
		PEGI
	});
};

export const getEditGameForm = async (req, res) => {
	const id = req.body.id ?? 0;
	let game = await getGame(id);

	game = {
		...game,
		id: id,
	};
	console.log(game);

	res.render("edit-game-form", {
		game,
		GENRES: formatOptions(GENRES, game.genres),
		PLATFORMS: formatOptions(PLATFORMS, game.platforms),
		PEGI
	});
};

