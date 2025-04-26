import User from '../users/user.model.js'
import Channel from '../channel/channel.model.js'
import bcryptjs from 'bcryptjs'

export const getChannelSetting = async (req, res) => {
    try{
        const { uid } = req.user

        const userData = await User.findById(uid,{
            channel: 1,
            username: 1,
        }).populate('channel')

        return res.status(200).json({
            id: userData.channel._id,
            username: userData.username,
            title: userData.channel.title,
            description: userData.channel.description,
            avatarUrl: userData.channel.avatarUrl,
            streamKey: userData.channel.streamKey,
        })
    }catch(e){
        console.log(e)
        return res.status(500).send('Something went wrong')
    }
}

export const putChannelSettings = async(req, res) => {
    try{
        const { uid } = req.user;
        const { title, description, username, avatarUrl } = req.body
        const userData = await User.findById(uid, { username: 1, channel: 1})

        console.log(userData)
        if(userData.username !== username){
            await User.updateOne({_id: uid}, {username})
        }
        
        const channelData = await Channel.findByIdAndUpdate(userData.channel,{
            title,
            description,
            avatarUrl,
            isActive: true,
        }, {new:true})

        return res.status(200).json({
            channelId: channelData._id,
            username,
            title: channelData.tittle,
            description: channelData.description,
            avatarUrl: channelData.avatarUrl
        })

    }catch(e){
        console.log(e)
        return res.status(500).send('Somthing went wrong')
    }
}

export const patchChangePassword = async (req, res) => {
    try{
        const { uid } = req.user
        const { password, newPassword} = req.body

        const userData = await User.findById(uid, {password: 1})

        const isPasswordCorrect = await bcryptjs.compare(password, userData.password)

        if(!isPasswordCorrect){
            return res.status(400).send('Invalid password. Please try again')
        }

        const encryptedPassword = await bcryptjs.hash(newPassword, 10)

        await User.updateOne({_id: uid},{password: encryptedPassword})

        return res.status(200).send('Password changed succesfully')
    }catch(e){
        console.log(e)
        return res.status(500).send('Somthing went wrong')
    } 
}

