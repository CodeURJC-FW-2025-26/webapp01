import * as service from "../service.js";
import { deleteGame } from "../service.js";

export const getGameDetail = async (req, res) => {
	const id = req.params.id ?? 0;
	let game = await service.getGame(id);
	game = {
		...game,
		average_rating:
            game.reviews.reduce((acc, e) => e.rating + acc, 0) /
            game.reviews.length,
		id: id,
	};

	if (!game) res.status(404); // FIXME: show error page or smth
	res.render("detail", game);
};

export const deleteDetailGame= async(req,res) =>{
	try{
		service.deleteGame(req.body.id);
		const msg= "The game has been succesfully deleted"
		return res.redirect(`/confirm?msg=${msg}`);
	}
	catch(error){
		return res.redirect(`/error?type=CantDelete&back=/detail/${id}`);
	}

};

export const editGame = async(req,res)=>{

}