const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    /*const usuarios = await Usuario
                                .find({}, 'nombre email role google')
                                .skip(desde)
                                .limit(5);

    const total = await Usuario.count();*/

     const [ usuarios, total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        
            Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });

}

const createUser = async (req, res = response) => {

    const { nombre, password, email } = req.body;
   
    try {

        const existeEmial = await Usuario.findOne({email});

        if (existeEmial) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado.'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña.
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();

        // Generar Token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs.'
        });
    }

}

const actrualizarUsuario = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el mismo usuario

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el ID especificado.'
            });
        }
        
        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email.'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok:true,
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const deleteUsuario = async (req, res = response) => {

    try {

        const uid = req.params.id;
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con el ID especificado.'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok:true,
            msg: 'Usuario eliminado.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}


module.exports = {
    getUsuarios,
    createUser,
    actrualizarUsuario,
    deleteUsuario
}