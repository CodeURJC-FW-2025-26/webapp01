import express from "express";
import multer from "multer";

import * as service from "./service.js";
import * as gameHandler from "./handlers/games.js";
import * as gameDetailHandler from "./handlers/detail.js";
import * as formHandler from "./handlers/form.js";
import * as errorHandler from "./handlers/error.js";
import * as confirmHandler from "./handlers/confirm.js";

const router = express.Router();
export const PAGE_SIZE = 6;

// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });


router.get("/", gameHandler.getPaginatedGames);

router.get("/detail/:id", gameDetailHandler.getGameDetail);

router.get("/form", formHandler.getForm);

router.get("/error", errorHandler.getError);

router.get("/confirm", confirmHandler.getConfirmation);

export default router;