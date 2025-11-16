
export const getConfirmation = async (req, res) => {
	
	res.render("confirm", {id:req.id});
};

