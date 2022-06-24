const mongoose = require("mongoose");

const instTeamSchema = mongoose.Schema({
  refId: { type: String },
  name: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  image: { type: String, required: true },
  about: { type: String, required: true },
  department: { type: String },
  externalLinks: { type: String },
}, { timestamps : true });

module.exports = mongoose.model("instTeams", instTeamSchema);
