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
	if (!game){
		return res.redirect(`/?errorMsg=${"404 error to get games"}&back=/detail/${id}`);
	}
	const msg = req.query.msg || null;
	const errorMsg = req.query.errorMsg || null;
	res.render("detail", { ...game, msg, errorMsg });
};

export const deleteDetailGame = async (req, res) => {
	try {
		service.deleteGame(req.body.id);
		return res.redirect("/?msg=Game%20deleted%20successfully");
	}
	catch {
		return res.redirect(`/?errorMsg=${"Can't delete the game"}&back=/detail/${id}`);
	}
};
/*--REVIEWS--*/
export const addReviewHandler = async (req, res) => {
	try {
		const id = req.params.id;
		const { author, comment, rating } = req.body;
		const review = {
			_id: toObjectId(),
			author,
			comment,
			rating: Number(rating),
			createdAt: new Date(),
		};


		await service.addReview(id, review);

		res.status(200).json({
			...review,
			gameId: id
		});
	} catch (err) {
		res.status(500).json({err});
	}
};

export const getEditReviewForm = async (req, res) => {
	const { id, reviewId } = req.params;
	const game = await service.getGame(id);
	const review = game.reviews.find(r => r._id.toString() === reviewId); //find the review id in the array of reviews

	if (!review){ 
		return res.redirect(`/?errorMsg=${"404:Review Not Found"}&back=/detail/${id}`);
	}
	res.render("edit-review", { id, review });
};

export const editReview = async (req, res) => {
	const { id, reviewId } = req.params;
	const { author, comment, rating } = req.body;

	try {

		await service.updateReview(id, reviewId, { author, comment, rating });

		const review = {
			_id: reviewId,
			author,
			comment,
			rating: Number(rating),
			createdAt: new Date(),
		};

		res.status(200).json({
			...review,
			gameId: id
		});


	} catch (err) {
		console.error(err);
		res.redirect(`/?errorMsg=${"Internal Error: 500 Error Posting Reviews"}&back=/detail/${id}`);
	}
};

export const deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	try {

		await service.deleteReview(id, reviewId);
		res.redirect(`/detail/${id}?msg=Review%20deleted%20successfully`);


	} catch (err) {
		console.error(err);
		res.redirect(
			`/?errorMsg=${"Internal Error: 500 Error Deleting Reviews"}&back=/detail/${id}`
		);
	}
};
