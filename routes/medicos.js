/**
 * Rutas: /api/medicos
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarCampos } = require('../midelwares/validar-campos');
const { validarJWT } = require('../midelwares/validar-jwt');

const router = Router();

router.get('/', getMedicos);

router.post('/',    
    [
        validarJWT,
        check('nombre', 'El nombre del medico es obligatorio.').not().isEmpty(),
        check('hospital', 'El hospital id debe ser válido.').isMongoId(),
        validarCampos
    ], 
    crearMedico);

router.put('/:id', 
    [
    ], 
    actualizarMedico);

router.delete('/:id', borrarMedico);


module.exports = router;