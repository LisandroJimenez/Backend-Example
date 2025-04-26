import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    author:{type:String},
    content: {type:String},
    date: {type:String}
})

export default mongoose.model('Message', messageSchema)