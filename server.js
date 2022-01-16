const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredients");
const Darkmode = require('darkmode-js');

new Darkmode().showWidget();

function logRequest(req, res, next) {
    console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
    next();
}

mongoose.connect("mongodb://localhost:29017/expirare", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const host = "localhost";
const port = 9000;
const clientApp = path.join(__dirname, "public");



// express app
let app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // to parse application/json
app.use(
    express.urlencoded({
        extended: true,
    })
); // to parse application/x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(logRequest); // logging for debug

app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
    console.log(
        `${new Date()}  App Started. Listening on ${host}:${port}, serving ${clientApp}`
    );
});

app.get("/", async(req, res) => {
    let list = await Recipe.find({});
    let ingredientList = await Ingredient.find({
        lifeSpan: {
            $lt: (86400000 * (4 + 30)) + Date.now(),
            $gt: (86400000 * (0 + 30)) + Date.now()
        }
    })
    let num = (list.length > 8) ? 8 : list.length;
    let expired = ingredientList.length;
    res.render("home", { list, num, expired });
});

app.get("/home", async(req, res) => {
    let list = await Recipe.find({});
    let ingredientList = await Ingredient.find({
        lifeSpan: {
            $lt: (86400000 * (4 + 30)) + Date.now(),
            $gt: (86400000 * (0 + 30)) + Date.now()
        }
    })
    let num = (list.length > 8) ? 8 : list.length;
    let expired = ingredientList.length;
    res.render("home", { list, num, expired });
});


app.get("/food", async(req, res) => {
    let list = await Ingredient.find({});
    list = list.sort((a, b) => a.lifeSpan - b.lifeSpan)
    console.log(list)
    res.render("ingredients/allIngredients", { list })
});

app.post("/food", async(req, res) => {
    let time = req.body.lifespan.split("-");
    let timeSec = Date.UTC(...time)
    await new Ingredient({
        name: req.body.name,
        lifeSpan: timeSec
    }).save()
    res.redirect('/food')
})

app.delete("/food/:id", async(req, res) => {
    let { id } = req.params
    await Ingredient.findByIdAndDelete(id)
    res.redirect("/food")
})


app.get("/recipes", async(req, res) => {
    let list = await Recipe.find({});
    res.render("recipes/allRecipes", { list });
});

app.get("/recipes/new", (req, res) => {
    res.render("recipes/createRecipes");
});

app.post("/recipes", async(req, res) => {
    await new Recipe(req.body).save();
    res.redirect("/home");
});

app.get('/recipes/:id', async(req, res) => {
    let { id } = req.params;
    let recipe = await Recipe.findById(id);
    res.render("recipes/showRecipe", { recipe })
})



app.delete('/recipes/:id', async(req, res) => {
    let { id } = req.params;
    // await Recipe.deleteMany({})
    await Recipe.findByIdAndDelete(id);
    res.redirect('/recipes')
})