const path = require("path");
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredients");
const { getApiRecipe } = require('./callRecipes.js')
var ingredientHolder = '';

function logRequest(req, res, next) {
    console.log(`${new Date()}  ${req.ip} : ${req.method} ${req.path}`);
    next();
}

mongoose.connect("mongodb://localhost:27017/expirare", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const host = "localhost";
const port = 8000;
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

let oneInList = (list1, list2) => {
    for(let item of list1){
        for(let item2 of list2) {
            if(item === item2['name']) {
                return true
            }
        }
    }
    return false
}

let allInList = (list1, list2) => {

    for(let item of list1){
        let bool = false
        for(let item2 of list2) {
            if(item === item2['name']){
                bool = true
            }
        }
        if(!bool) return false
    }
    return true
}

let format = (list) => {
    let ingredients = []
    for(let item of list) {
        ingredients.push(item.name)
    }
    return ingredients.join(",")
}

app.get("/", async(req, res) => {
    let listf = await Recipe.find({});
    let fullIngredientList = await Ingredient.find({})
    let ingredientList = await Ingredient.find({
        lifeSpan: {
            $lt: (86400000 * (4 + 30)) + Date.now(),
            $gt: (86400000 * (0 + 30)) + Date.now()
        }
    })
    let ingredientString = format(ingredientList);
    
    let list = await listf.filter(x => {
        if(oneInList(x.ingredients, ingredientList) && allInList(x.ingredients, fullIngredientList)) {
            return x
        }
    })
    let apiRecipes = await getApiRecipe(ingredientString)
    let num = (list.length > 8) ? 8 : list.length;
    let num2 = (apiRecipes.length > 8) ? 8 : apiRecipes.length
    let expired = ingredientList.length;
    res.render("home", { list, num, expired, apiRecipes, num2 });
});

app.get("/home", async(req, res) => {
    let listf = await Recipe.find({});
    let fullIngredientList = await Ingredient.find({})
    let ingredientList = await Ingredient.find({
        lifeSpan: {
            $lt: (86400000 * (4 + 30)) + Date.now(),
            $gt: (86400000 * (0 + 30)) + Date.now()
        }
    })
    let ingredientString = format(ingredientList);
    
    let list = await listf.filter(x => {
        if(oneInList(x.ingredients, ingredientList) && allInList(x.ingredients, fullIngredientList)) {
            return x
        }
    })
    
    let apiRecipes = await getApiRecipe(ingredientString)
    let num = (list.length > 8) ? 8 : list.length;
    let num2 = (apiRecipes.length > 8) ? 8 : apiRecipes.length
    let expired = ingredientList.length;
    res.render("home", { list, num, expired, apiRecipes, num2 });
    
});


app.get("/food", async(req, res) => {
    let list = await Ingredient.find({});
    list = list.sort((a, b) => a.lifeSpan - b.lifeSpan)
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
    console.log(list)
    res.render("recipes/allRecipes", { list });
});

app.get("/recipes/new", (req, res) => {
    res.render("recipes/createRecipes");
});

app.post("/recipes", async(req, res) => {
    let listIngredient = req.body.ingredients.split(",").map(x => x.trim())
    await new Recipe({
        title: req.body.title,
        ingredients: listIngredient,
        procedure: req.body.procedure,
        isCustom: true
    }).save();
    res.redirect("/home");
});

app.get('/recipes/:id', async(req, res) => {
    let { id } = req.params;
    let recipe = await Recipe.findById(id);
    res.render("recipes/showRecipe", { recipe })
})



app.delete('/recipes/:id', async(req, res) => {
    let { id } = req.params;
    await Recipe.findByIdAndDelete(id);
    res.redirect('/recipes')
})