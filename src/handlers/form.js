import { getConfirmation } from "./confirm.js";
import { getError } from "./error.js";
import router from "../router.js"

export const getForm = (req, res) => {
	res.render("form");
};

