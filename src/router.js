import express from "express";
import multer from "multer";

import * as service from "./service.js";
import * as gameHandler from "./handlers/games.js";
import * as gameDetailHandler from "./handlers/detail.js";
import * as formHandler from "./handlers/form.js";

const router = express.Router();
export const PAGE_SIZE = 6;

// eslint-disable-next-line no-unused-vars
const upload = multer({ dest: service.UPLOADS_FOLDER });


router.get("/", gameHandler.getPaginatedGames);

router.get("/detail/:id", gameDetailHandler.getGameDetail);

router.get("/form", formHandler.getForm);

//TODO, make handler
router.get("/form-error", (req, res) => {
    const type = req.query.type || "unknown";
    let errorMessage;

    switch(type) {
        case "duplicate":
            errorMessage = "The title already exists. Please choose another.";
            break;
        case "empty":
            errorMessage = "Some required fields are missing.";
            break;
        default:
            errorMessage = "An unknown error occurred.";
    }

    res.render("form-error", { errorMessage });
});


export default router;