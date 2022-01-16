const axios = require('axios');


async function getRecipeSpoon() { //uses the spoonacular API
    try {
        let myIngredients = 'apples,bananas'
        const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=021157b8b381412c97a6dcaa07dad4c4&ingredients=${myIngredients}`);
        console.log(response.data);
    } catch (error) {

        console.log(error);
    }
}

async function getRecipe(myVal) { //uses the edamam API
    try {
        //let myVal = 'Potatoes';
        const response = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${myVal}&app_id=43a86d88&app_key=e3ae4dc6ab50f2ca0268cb96eed5d9d7`);
        // console.log(response.data.hits);
        console.log("Check out these recipes before your ingredients expire");

        for (rec of response.data.hits) {
            console.log(`Name: ${rec.recipe.label}; URL: ${rec.recipe.uri}`);
            console.log(rec.recipe.ingredients);
        }
    } catch (error) {
        console.log(error);
    }
}


//getRecipe();ne