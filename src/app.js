import express from "express";
import mustacheExpress from "mustache-express";
import bodyParser from "body-parser";
import router from "./router.js";
import "./load_data.js";
import { Monkito } from "./lib/monkito.js";
import { loadInitialData } from "./load_data.js";

const app = express();

await Monkito.connect("mongodb://localhost:27017", "store");
await loadInitialData();

app.use(express.static("./public"));

app.set("view engine", "html");
app.engine("html", mustacheExpress(), ".html");
app.set("views", "./views");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(3000, () => console.log("Web ready in http://localhost:3000/"));