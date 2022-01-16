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
  isCustom: Boolean
});

module.exports = mongoose.model("Recipe", RecipeSchema);
