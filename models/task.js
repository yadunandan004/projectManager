// grab the things we need
const mongoose=require('./../db/dbSetup');
var Schema = mongoose.Schema;

// create a schema
var taskSchema = new Schema({
    taskname: {
        type: String,
        required: true
    },
    user: {
        type: [String],
        required: true,
    },
    status: {
        type: [String],
        required: false
    },
    completed: {
        type: Boolean,
        required: false
    },
    startedOn: {
        type: Date,
        required: true
    },
    finishBy: {
        type: Date,
        required: false
    },
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Tasks = mongoose.model('task', taskSchema);

// make this available to our Node applications
module.exports = Tasks;