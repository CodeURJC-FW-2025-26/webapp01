
export const getConfirmation = async (req, res) => {
	const backUrl=req.query.back||"/";
	const UrlOfDestination=req.query.destination||"/"; 
	res.render("confirmation", { UrlOfDestination, backUrl });
};