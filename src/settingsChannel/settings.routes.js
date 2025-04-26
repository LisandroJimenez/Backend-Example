import {Router} from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { getChannelSetting, patchChangePassword, putChannelSettings } from "./settings.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router()

router.get('/channel', validarJWT, getChannelSetting)

router.put('/channel',
    [
        validarJWT,
        check('username','Username is necesary').not().isEmpty(),
        check('description','Description is necesary').not().isEmpty(),
        check('title', 'Title is necesary').not().isEmpty(),
        check('avatarUrl','The avatarUrl is necesary').not().isEmpty(),
        check('username','Username min 3 max 8').isLength({min:3,max:8}),
        check('description','Description min 10 max 200').isLength({min:8, max:200}),
        check('title', 'Title min 3, max 30').isLength({min:3, max:30}),
        check('avatarUrl','It is necesary a valir URL').isURL(),
        validarCampos
    ], putChannelSettings)

router.patch('/password',
    [
        validarJWT,
        check('password','The password is necesary').not().isEmpty(),
        check('newPassword','The new password is necesary').not().isEmpty(),
        check('password','Password min 6 max 12').isLength({min:6,max:12}),
        check('newPassword','New password min 6 max 12').isLength({min:6,max:12}),
    ], patchChangePassword)



export default router