
export const getError = async (req, res) => {
	const errorMessage = req.type || "An unknown error occurred.";
	const backUrl = req.back||"/";
	res.render("error", { errorMessage, backUrl });
};