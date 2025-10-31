const Territorio = require('../models/territorios');

exports.getAll = async (req, res) => {
    try{
        const territorio = await Territorio.find();
        res.json(territorios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los territorios' });
    }
};

exports.getById = async (req, res) => {
    try{
        const territorio = await Territorio.findById(req.params.id);
        if(!territorio) return res.status(404).json({ error: 'Territorio no encontrado' });
        res.json(territorio);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener territorio'})
    }
};