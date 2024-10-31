
const { Sequelize } = require("sequelize");
const User = require ("../models/user.model");
const { Op } = require("sequelize");

const userController = {};

userController.getAll = async(req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json({ data:users });
    }catch(error){
        res.status(500).json({ error: error.message});
    }
};

userController.getByUsername = async (req, res) => {
    try{
        const q = req.params.username;
        const users = await User.findAll({
            where: 
            { username:  {[Op.like]: '%'+ q + '%'}} ,
        });
        res.status(200).json({ data: users });
        
    }catch(error) {
        res.status(500).json({ error: error.message});
    }
};

userController.addNewUser = async (req, res) => {
    
    try{const users = await User.create(req.body);
    res.status(201).json({ data:users});
}catch(error) {
    res.status(500).json({error: error.message});
}
};

userController.delete = async (req, res) => {
    const deleting = await User.destroy({where: {id: req.params.id} });
    const status = deleting ? 200:404; //operador ternario.  condición ? valor_si_verdadero : valor_si_falso
    const message = deleting ? "User deleted" : "User not found";
    res.status(status).json({ message });
};


userController.update = async (req, res) => {
    try {
        const id = req.params.id; 

        const [updated] = await User.update(req.body, { where: { id } });

        if (updated) {
            res.status(200).json({
                message: "Usuario actualizado",
                data: req.body,
            });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = userController;