
import { addGame } from "../service.js";
import router from "../router.js"



export const getConfirmation = async (req, res) => {

	//This is not best way but the scalability isn't important here
	const isGame = (req.body) && (req.body.type === "game");

	res.render("confirm", { isGame });
};

