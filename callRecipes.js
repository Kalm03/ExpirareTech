const axios = require('axios');
const { redirect } = require('express/lib/response');

async function getRecipe(myVal) { //uses the edamam API

    let ing_dict = {
        name: "",
        amount: 0,
        unit: ""
    }
    let ret_dict = {
        name: "",
        url: "",
        ingre: []
    }
    let return_lst = [];
    try {
        //let myVal = 'Potatoes,tomato, fries';
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${myVal}&app_id=43a86d88&app_key=e3ae4dc6ab50f2ca0268cb96eed5d9d7`);
        // console.log(response.data.hits);
        console.log("Check out these recipes before your ingredients expire");

        for (rec of response.data.hits) {

            // console.log(rec.recipe.ingredients.food);
            for (stuff of rec.recipe.ingredients) {
                ing_dict.name = stuff.food;
                ing_dict.amount = stuff.quantity;
                ing_dict.unit = stuff.measure;
                let why = {...ing_dict };
                ret_dict.ingre.push(why);
                console.log(why);

            }
            ret_dict.name = rec.recipe.label;
            ret_dict.url = rec.recipe.uri;
            let thisshit = Object.assign([], ret_dict.ingre);
            let sucks = {...ret_dict, ingre: thisshit };
            ret_dict.ingre = [];
            return_lst.push(sucks);
        }
        console.log(return_lst);
        return return_lst
    } catch (error) {
        console.log(error);
    }
}
// const axios = require('axios');


// async function getRecipeSpoon() { //uses the spoonacular API
//     try {
//         let myIngredients = 'apples,bananas'
//         const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=021157b8b381412c97a6dcaa07dad4c4&ingredients=${myIngredients}`);
//         console.log(response.data);
//     } catch (error) {

//         console.log(error);
//     }
// }

// async function getRecipe(myVal) { //uses the edamam API
//     try {
//         //let myVal = 'Potatoes';
//         const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${myVal}&app_id=43a86d88&app_key=e3ae4dc6ab50f2ca0268cb96eed5d9d7`);
//         // console.log(response.data.hits);
//         console.log("Check out these recipes before your ingredients expire");

//         for (rec of response.data.hits) {
//             console.log(`Name: ${rec.recipe.label}; URL: ${rec.recipe.uri}`);
//             console.log(rec.recipe.ingredients);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }


// //getRecipe();ne