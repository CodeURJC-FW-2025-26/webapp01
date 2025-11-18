import * as service from "../service.js";
import { toObjectId } from "../lib/monkito.js";

export const formatDateDDMMYYYY = (dateString) => {
	if (!dateString) return "";
	const date = new Date(dateString);
	if (isNaN(date)) return "";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

export const getGameDetail = async (req, res) => {
	const id = req.params.id ?? 0;
	let game = await service.getGame(id);
	game = {
		...game,
		release_date: formatDateDDMMYYYY(game.release_date),
		id: id,
	};
	if (!game) return res.redirect(`/error?type=${"404 error to get games"}&back=/detail/${id}`); 
	res.render("detail", game);
};

export const deleteDetailGame= async(req,res) =>{
	try{
		service.deleteGame(req.body.id);
		const msg= "The game has been succesfully deleted";
		return res.redirect(`/confirm?msg=${msg}`);
	}
	catch {
		return res.redirect(`/error?type=${"Can't delete the game"}&back=/detail/${id}`);
	}
};
/*--REVIEWS--*/
export const addReviewHandler = async (req,res) => {
	try {
		const gameId = req.params.id;
		const { author, comment, rating } = req.body;
		const review = {
			_id: toObjectId(),
			author,
			comment,
			rating: Number(rating),
			createdAt: new Date(),
		};

		await service.addReview(gameId, review);
		res.redirect(`/confirm?msg=${"Review added successfully"}&id=${gameId}`);
	} catch (err) {
		console.error(err);
		res.redirect(`/error?type=${"500: Internal Error, Error Updating Reviews"}&back=/detail/${id}`);
	}
};

export const getEditReviewForm = async (req, res) => {
	const { gameId, reviewId } = req.params;
	const game = await service.getGame(gameId);
	const review = game.reviews.find(r =>r._id.toString() === reviewId); //find the review id in the array of reviews

	if (!review) return res.redirect(`/error?type=${"404:Review Not Found"}&back=/detail/${id}`); 
	res.render("edit-review", { gameId, review });
};

export const editReview = async (req, res) => {
	const { gameId, reviewId } = req.params;
	const { author, comment, rating } = req.body;

	try {
		await service.updateReview(gameId, reviewId, { author, comment, rating });
		res.redirect(`/confirm?msg=${"Review edited successfully"}&id=${gameId}`);

	} catch (err) {
		console.error(err);
		res.redirect(`/error?type=${"Internal Error: 500 Error Posting Reviews"}&back=/detail/${id}`);
	}
};

export const deleteReview = async (req, res) => {
	const { gameId, reviewId } = req.params;
	try {
		await service.deleteReview(gameId, reviewId);
		res.redirect(`/confirm?msg=${"Review deleted successfully"}&id=${gameId}`);

	} catch (err) {
		console.error(err);
		res.redirect(
			`/error?type=${"Internal Error: 500 Error Deleting Reviews"}&back=/detail/${gameId}`
		);
	}
};
