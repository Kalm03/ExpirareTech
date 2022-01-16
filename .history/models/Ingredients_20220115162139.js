const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const IngredientSchema = new Schema({
    name: String,
    LifeSpan: String
})

module.exports = mongoose.model('Recipe', RecipeSchema)