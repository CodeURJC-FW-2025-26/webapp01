import router from "./router.js";

export const getForm = (req, res) => {
	res.render("form");
};


router.post('/submit-game-form',(req, res) => {
	//To check that there are not empty/invalid fields
	for (let key in req.body){

		if (typeof req.body[key] === "string")
			req.body[key] = req.body.trim();

		if (!req.body[key])
		{
			return res.render("error",{type:"Some of the form fields were invalid"});
		}
	}

	return res.render("confirm",{data:req});

});