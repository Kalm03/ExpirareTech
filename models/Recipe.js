const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecipeSchema = new Schema({
  title: String,
  ingredients: [
    {
      type: String,
    },
  ],
  procedure: String,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
