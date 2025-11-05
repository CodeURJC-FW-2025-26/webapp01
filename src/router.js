import express from "express";
import multer from "multer";

import * as board from "./service.js";

const router = express.Router();
export default router;

const upload = multer({ dest: board.UPLOADS_FOLDER });

router.get("/", async (req, res) => {
	res.render("index");
});

router.get("/detail", async (req, res) => {
	res.render("detail");
});

router.get("/form", async (req, res) => {
	res.render("form");
});
