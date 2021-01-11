/**
 * Path: /api/login
 */

const { Router } = require('express');
const { login } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../midelwares/validar-campos');

const router = Router();

router.post('/',
    [
        check('email', 'El correo es obligatorio.').isEmail(),
        check('password', 'La constraseña es obligatoria.').not().isEmpty(),
        validarCampos
    ],
    login);


module.exports = router;