var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var hospitalSchema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es necesario"] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "Users" }
  }
);
module.exports = mongoose.model("Hospitals", hospitalSchema);
