import express from "express";
import multer from "multer";

import * as gameHandler from "./handlers/games.js";
import * as gameDetailHandler from "./handlers/detail.js";
import * as formHandler from "./handlers/form.js";
import * as errorHandler from "./handlers/error.js";
import * as confirmHandler from "./handlers/confirm.js";



const router = express.Router();
export const PAGE_SIZE = 6;

 
const upload = multer({ dest: "uploads/" });


router.get("/", gameHandler.handler);

router.get("/newGames", gameHandler.scrollHandler);

router.get("/detail/:id", gameDetailHandler.getGameDetail);

router.get("/new-game-form", formHandler.getNewGameForm);

router.get("/error", errorHandler.getError);

router.get("/confirm", confirmHandler.getConfirmation);

router.post("/edit-game-form",formHandler.getEditGameForm);

router.post("/game", upload.single("cover_image"), formHandler.insertGame);

router.post("/delete-game",gameDetailHandler.deleteDetailGame);

router.post("/edit-game",upload.single("cover_image"),formHandler.editFormGame);

router.post("/detail/:id/reviews", gameDetailHandler.addReviewHandler);

router.get("/detail/:id/reviews/:reviewId/edit", gameDetailHandler.getEditReviewForm);

router.post("/detail/:id/reviews/:reviewId/edit", gameDetailHandler.editReview);

router.post("/detail/:id/reviews/:reviewId/delete", gameDetailHandler.deleteReview);

export default router;