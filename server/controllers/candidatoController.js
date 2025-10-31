const Candidato = require('../models/candidato')

exports.getAll = async(req, res) => {
    try {
        const candidatos = await Candidato.find();
        res.json(candidatos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los candidatos'});
    }
};

exports.getById = async (req, res) => {
    try {
        const candidato = await Candidato.findById(req.params.id);
        if (!candidato) return res.status(404).json({ error: 'Candidato no encontrado' });
        res.json(candidato);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener candidato'});
    }
};