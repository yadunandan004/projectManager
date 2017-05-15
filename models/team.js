// grab the things we need
const mongoose=require('./../db/dbSetup');
var Schema = mongoose.Schema;
// create a schema
var teamSchema = new Schema({
    teamName: {
        type: String,
        required: true,
		unique:true
    },
    createdBy: {
        type: String,
        required: false,
    },
    roles: {
        type: [String],
        required: false
    }
	tasks: {
		type: [String],   //task ids
        required: false
	}
	tickets: {
		type: [String],   //ticket ids
        required: false
	}
	wikis: {
		type: [String],   //
        required: false
	}
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Teams = mongoose.model('team', teamSchema);

// make this available to our Node applications
module.exports = Teams;