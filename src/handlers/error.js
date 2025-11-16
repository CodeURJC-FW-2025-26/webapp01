
export const getError = async (req, res) => {
	const errorMessage = req.body.type || "An unknown error occurred.";
	const backUrl = req.body.back||"/";
	res.render("error", { errorMessage, backUrl });
};