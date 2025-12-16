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
	if (!game) {
		return res.status(404).json({
			message: "404 error: game not found",
			gameId: id
   		});

	}
	const msg = req.query.msg || null;
	const errorMsg = req.query.errorMsg || null;
	res.render("detail", { ...game, reviewCount: game?.reviews?.length || 0, msg, errorMsg });
};

export const deleteDetailGame = async (req, res) => {
	try {
		await service.deleteGame(req.body.id);
		return res.json({ message: "Game deleted successfully", type: true });
	} catch {
		return res.json({ message: "Can't delete the game", type: false });
	}
};
/*--REVIEWS--*/
export const addReviewHandler = async (req, res) => {
	try {
		const id = req.params.id;
		const { author, comment, rating } = req.body;

		const errors = [];
		if (!author) errors.push("review author is required");
		if (!comment) errors.push("review comment is required");
		if (!rating) errors.push("review rating is required");
		if (rating && (rating < 0 || rating > 100))
			errors.push("review rating must be between 0 and 100");
		if (errors.length) res.status(400).json({ err: errors });

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
		res.status(400).json({ err });
	}
};

export const editReview = async (req, res) => {
	const { id, reviewId } = req.params;
	const { author, comment, rating } = req.body;

	const errors = [];
	if (!author) errors.push("review author is required");
	if (!comment) errors.push("review comment is required");
	if (!rating) errors.push("review rating is required");
	if (rating && (rating < 0 || rating > 100)) errors.push("review rating must be between 0 and 100");
	if (errors.length) res.status(400).json({ err: errors });

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
		res.status(400).json({err});
	}
};

export const deleteReview = async (req, res) => {
	const { id, reviewId } = req.body; 
	try {

		await service.deleteReview(id, reviewId);
		res.status(200).json({});


	} catch (err) {
		res.status(500).json({err});
	}
};
