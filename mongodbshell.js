// Actualiza territorios para DIPUTADOS
db.candidatos.find({ "Tipo  Eleccion": "DIPUTADO" }).forEach(candidato => {
    const distrito = candidato["Territorio  Electoral"];
    const region = candidato["Región"];
    if (distrito && region) {
        db.territorios.updateMany(
            {
                nombre_territorio: distrito,
                tipo: "Diputado"
            },
            {
                $set: { region: region }
            }
        );
    }
});

// Actualiza territorios para SENADORES
db.candidatos.find({ "Tipo  Eleccion": "SENADOR" }).forEach(candidato => {
    const circunscripcion = candidato["Territorio  Electoral"];
    const region = candidato["Región"];
    if (circunscripcion && region) {
        db.territorios.updateMany(
            {
                nombre_territorio: circunscripcion,
                tipo: "Senador"
            },
            {
                $set: { region: region }
            }
        );
    }
});