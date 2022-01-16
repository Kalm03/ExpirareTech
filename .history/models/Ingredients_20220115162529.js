const mongoose = require('mongoose');
const { Schema } = mongoose;

const IngredientSchema = new Schema({
    name: String,
    LifeSpan: String
})

module.exports = mongoose.model('Ingredients', IngredientSchema)