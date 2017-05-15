const mongoose=require('./../db/dbSetup');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    commentBy:  {
        type: String,
        required: true
    },
    comment:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
var comments = mongoose.model('comments', commentSchema);
module.exports=comments;