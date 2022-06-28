const mongoose = require("mongoose");

const instTeamSchema = mongoose.Schema({
  refId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String},
  about: { type: String},
  linkedIn: { type: String },
  website: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instTeams", instTeamSchema);
