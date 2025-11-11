export const getFormError = async (req, res) => {
	const type = req.query.type || "unknown";

	const errors = new Map([
		/* Forms errors */
		["duplicate", "The title already exists. Please choose another."],
		["empty", "Some required fields are missing."],

		/* Review errors */
		["noAuthor", "You need to introduce your name."],
		["noText", "Your text is empty."],
		["outOfRange", "Your integer values are out of range."],

		/* 4xx Errors */
		["400", "Bad Request."],
		["401", "Unauthorized access"],
		["403", "No permission for that >:("],
		["404", "Classic: Not found :)"],
		["405", "Method not allowed"],
		["408", "Request timeout"],
		["409", "Conflict"],

		/* 5xx Errors */
		["500", "Internal Server Error"],
		["501", "Not implemented"],
		["502", "Bad gateway"],
	]);

	const errorMessage = errors.get(type) || "An unknown error occurred.";
	res.render("error", { errorMessage });
};