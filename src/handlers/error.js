
export const getError = async (req, res) => {

	const errorMessage = errors.get(type) || "An unknown error occurred.";
 
	res.render("error", { errorMessage });
}