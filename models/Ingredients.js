const mongoose = require('mongoose');
const { Schema } = mongoose;

const IngredientSchema = new Schema({
    name: String,
    lifeSpan: Number
})

module.exports = mongoose.model('Ingredient', IngredientSchema)