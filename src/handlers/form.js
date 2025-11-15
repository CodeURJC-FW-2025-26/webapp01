import { GENRES, PEGI, PLATFORMS } from "../load_data.js";

export const getForm = (req, res) => {
	res.render("form",{
		GENRES,
		PLATFORMS,
		PEGI
	});
};

