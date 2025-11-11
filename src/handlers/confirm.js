
export const getConfirmation = async (req, res) => {
	const backUrl=req.query.back||"/";
	const urlOfDestination=req.query.destination||"/"; 
	res.render("confirm", { urlOfDestination, backUrl  });
};