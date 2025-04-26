import mongoose, { Schema } from "mongoose";
import { v4 as uuid } from 'uuid'

const defaultTittle = 'New Channel'
const defaultDescription = 'This is a new channel'

const channelSchema = mongoose.Schema({
    isActive:{
        type: Boolean,
        default: false
    },
    title:{
        type: String,
        default: defaultTittle
    },
    description:{
        type:String,
        default: defaultDescription
    },
    avatarUrl:{
        type: String,
        default: 'none'
    },
    streamKey:{
        type: String,
        default: uuid
    },
    messages:{
        type: [{ 
            type: Schema.Types.ObjectId, ref: 'Message'
        }],
        defaul:[]
    }
})

export default mongoose.model('Channel', channelSchema)