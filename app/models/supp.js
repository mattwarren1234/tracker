var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Benefits = new Schema({
    description: String
});

var Supp = new Schema({
    name: String,
    description: String,
    dosage: String,
    benefits: [Benefits]
});


//
//var BenefitScore = new Schema({
//    id: Schema.ObjectId,
//    rating: Number
//});
//var Journal = new Schema({
//    date: Date,
//    supps: [{
//            id: Schema.ObjectId,
//            benefits: [{
//                    id: Schema.ObjectId,
//                    rating: Number
//                }]
//        }]
//});

module.exports = mongoose.model('Supp', Supp); 
