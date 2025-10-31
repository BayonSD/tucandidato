const Partido = require('../models/partido');

exports.getAll = async (req, res) => {
    try{
        const partidos = await Partido.find();
        res.json(partidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los partidos'});
    }
};

exports.getById = async (req, res) => {
    try{
        const partido = await Partido.findById(req.params.id);
        if (!partido) return res.status(404).json({ error: 'Partido no encontrado'});
        res.json(partido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener partido'});
    }
};