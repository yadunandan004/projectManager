const mongoose=require('./../db/dbSetup');
var Schema = mongoose.Schema;



// create a schema
var ticketSchema = new Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        required: false
    },
    status: {
        type: Boolean,
        required: true
    },
    closedBy: {
        type: String,
        required: false
    },
    solution: {
        type: String,
        required: false
    },
    comments:{
        type:[String],
        required:false
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Tickets = mongoose.model('ticket', ticketSchema);

// make this available to our Node applications
module.exports = Tickets;