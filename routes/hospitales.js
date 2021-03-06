/**
 * Rutas: /api/hospitales
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../midelwares/validar-campos');
const { validarJWT } = require('../midelwares/validar-jwt');

const router = Router();

router.get('/', getHospitales);

router.post('/',    
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
        validarCampos
    ], 
    crearHospital);

router.put('/:id', 
    [
    ], 
    actualizarHospital);

router.delete('/:id', borrarHospital);


module.exports = router;