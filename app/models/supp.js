var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SuppSchema = new Schema({
    name: String,
    description: String,
    dosage: String,
    benefits: [String]
});

module.exports = mongoose.model('Supp', SuppSchema);
