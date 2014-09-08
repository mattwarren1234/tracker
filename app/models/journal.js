var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JournalEntry = new Schema({
   date: Date,
   benefitId : Schema.ObjectId,
   score: Number,
   userId : Number
});

module.exports = mongoose.model('JournalEntry', JournalEntry);