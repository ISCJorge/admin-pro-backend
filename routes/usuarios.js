/**
 * Rutas: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, createUser, actrualizarUsuario, deleteUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../midelwares/validar-campos');
const { validarJWT } = require('../midelwares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/',    
    [
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('password', 'La contraseña es obligatoria.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        validarCampos,
    ], 
    createUser);

router.put('/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'El email es obligatorio.').isEmail(),
        check('role', 'El role es obligatorio.').not().isEmpty(),
        validarCampos
    ], 
    actrualizarUsuario);

router.delete('/:id', validarJWT, deleteUsuario);


module.exports = router;
