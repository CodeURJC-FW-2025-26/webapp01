
export const getError = async (req, res) => {
	const errorMessage = req.query.type || "An unknown error occurred.";
	const backUrl = req.query.back||"/"; //FIXME
	res.render("error", { errorMessage, backUrl });
};