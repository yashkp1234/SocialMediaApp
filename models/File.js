const { model, Schema } = require("mongoose");

const fileSchema = new Schema({
  username: String,
  data: String
});

module.exports = model("File", fileSchema);
