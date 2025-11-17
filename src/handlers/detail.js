import * as service from "../service.js";
import { ObjectId } from "mongodb";

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

	if (!game) return res.redirect(`/error?type=Error404&back=/detail/${id}`); 
	res.render("detail", game);
};

export const deleteDetailGame= async(req,res) =>{
	try{
		service.deleteGame(req.body.id);
		const msg= "The game has been succesfully deleted";
		return res.redirect(`/confirm?msg=${msg}`);
	}
	catch {
		return res.redirect(`/error?type=CantDelete&back=/detail/${id}`);
	}
};
/*--REVIEWS--*/
export const addReviewHandler = async (req,res) => {
	try {
		const gameId = req.params.id;
		const { author, comment, rating } = req.body;
		const review = {
			_id: new ObjectId(),
			author,
			comment,
			rating: Number(rating),
			createdAt: new Date(),
		};

		await service.addReview(gameId, review);
		res.redirect(`/detail/${gameId}`);
	} catch (err) {
		res.redirect(`/error?type=500:ErrorUpdatingReviews&back=/detail/${id}`);
	}
};

export const getEditReviewForm = async (req, res) => {
	const { gameId, reviewId } = req.params;
	const game = await service.getGame(gameId);
	const review = game.reviews.find(r => String(r._id) === reviewId); //find the review id in the array of reviews

	if (!review) return res.status(404).send("Review not found");

	res.render("edit-review", { gameId, review });
};

export const postEditReview = async (req, res) => {
	const { gameId, reviewId } = req.params;
	const { author, comment, rating } = req.body;

	try {
		await service.updateReview(gameId, reviewId, { author, comment, rating });
		res.redirect(`/detail/${gameId}`);
	} catch (err) {
		res.redirect(`/error?type=500:ErrorPostingReviews&back=/detail/${id}`);
	}
};

export const deleteReview = async (req, res) => {
	const { gameId, reviewId } = req.params;
	try {
		await service.deleteReview(gameId, reviewId);
		res.redirect(`/detail/${gameId}?msg=Review deleted successfully`);//use confirm
	} catch (err) {
		console.error(err);
		res.redirect(`/error?type=500:ErrorDeletingReviews&back=/detail/${id}`);
	}
};
