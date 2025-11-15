
import { addGame } from "../service.js";
import router from "../router.js"



export const getConfirmation = async (req, res) => {
	
	//This is not best way but the scalability isn't important here
	console.log(req.type)
	const isGame = (req.type) && (req.type === "game");
	console.log(isGame)
	const formData = req.data
	console.log(formData)
	res.render("confirm", { isGame,data:formData });

};

