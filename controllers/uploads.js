const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    // Se valida que exista un tipo valido
    if (!tiposValidos.includes(tipo)) {
        res.status(400).json({
            ok: false,
            msg: 'No es un Medico, Hospital o Usuario.'
        });
    }

    // Se valida que venga un archivo en la petición
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se selecciono ningun archivo.'
        });
    }

    // Procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesvalidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesvalidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'La extensión del archivo no es valida..'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al intentar subir la imagen.'
            });
        }

        // Actualizar BD
        actualizarImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });   

}


const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);
    const pathImgDefault = path.join(__dirname, `../uploads/no-image.png`);

    if (fs.existsSync(pathImg))
        res.sendFile(pathImg);
    else
        res.sendFile(pathImgDefault);
    

}

module.exports = {
    fileUpload,
    retornaImagen
}