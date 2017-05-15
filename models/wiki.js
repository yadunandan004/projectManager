// grab the things we need
const mongoose=require('./../db/dbSetup');
var Schema = mongoose.Schema;

// create a schema
var wikiSchema = new Schema({
    createdBy: {
        type: String,
        required: false,
    },
    path: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Wikis = mongoose.model('wiki', wikiSchema);

// make this available to our Node applications
module.exports = Wikis;