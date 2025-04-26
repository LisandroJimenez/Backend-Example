import { Router } from "express";
import { check } from "express-validator";
import { getChannelDetails, getChannels, getFollowedChannels, postFollowChannel } from "./channel.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router()

router.get('/followed', validarJWT, getFollowedChannels)

router.get('/:channelId',
    [
        check('channelId','the Channel Id is necesary').not().isEmpty()
    ],getChannelDetails)

router.get('/', getChannels)

router.post('/follow',
    [
        validarJWT
    ], postFollowChannel)

export default router