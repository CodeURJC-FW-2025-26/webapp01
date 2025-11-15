
import { Monkito } from "./lib/monkito.js";

export const getConfirmation = async (req, res) => {
	const backUrl=req.query.back||"/";
	const urlOfDestination=req.query.destination||"/"; 
	res.render("confirm", { urlOfDestination, backUrl  });
};


router.post('/submit-game-confirmation',(req, res) => {

});

router.post('/cancel-game-confirmation',(req,res)=>{
	return res.render("form",req)
})
