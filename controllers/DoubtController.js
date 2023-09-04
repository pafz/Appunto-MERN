const Doubt = require("../models/Doubt");
const User = require("../models/User");
const upload = require("../middleware/upload");

const DoubtController = {
    async createDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { topic, question } = req.body;

            if (!topic || !question) {
                return res.status(400).send({ message: "Tenés que completar todos los campos" });
            }

            let imagePath = ""; // inicializo la url de la imagen como un string vacio

            // uso el upload.single, para manejar la carga de la imagen
            upload.single("image")(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: "Error al cargar la imagen" });
                }

                if (req.file) {
                    // si se carga una imagen, actualizamos imagePath
                    imagePath = `/uploads/${req.file.filename}`;
                }

                const doubt = await Doubt.create({ ...req.body, _idUser: req.user._id, imagePath });
                await User.findByIdAndUpdate(req.user._id, { $push: { _idDoubt: doubt._id } });

                res.status(201).send({ message: "Se ha creado tu consulta", doubt });
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al crear la consulta" });
        }
    },

    async updateDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const updatedDoubt = await Doubt.findOneAndUpdate({}, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "No se encontró ninguna consulta para actualizar" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", doubt: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async updateDoubtById(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { _id } = req.params;
            const updatedDoubt = await Doubt.findByIdAndUpdate(_id, req.body, { new: true });

            if (!updatedDoubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", doubt: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async updateDoubtByTopic(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { topic } = req.params;
            const updatedDoubt = await Doubt.findOneAndUpdate({ topic }, req.body, { new: true });
            console.log(updatedDoubt);

            if (!updatedDoubt) {
                return res.status(404).send({ message: "No se encontró ninguna consulta con ese tema" });
            }

            res.status(200).send({ message: "Consulta actualizada exitosamente", doubt: updatedDoubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar la consulta" });
        }
    },

    async getAllDoubtsPagination(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const page = parseInt(req.doubt.page) || 1;
            const limit = 2;
            const skip = (page - 1) * limit;

            const doubts = await Doubt.find().limit(limit).skip(skip);

            res.status(200).send({ message: "Estás viendo las dudas con paginación de 2 en 2", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al obtener las consultas" });
        }
    },

    async getEverything(req, res) {
        try {
            const doubts = await Doubt.find()
                .populate({
                    path: "_idUser",
                    select: "_id name",
                })
                .populate({
                    path: "_idAnswer",
                    select: "_id reply likes",
                    populate: {
                        path: "_idUser",
                        select: "_id name",
                    },
                })
                .select("_id topic question _idAnswer");

            res.status(200).send({ message: "Datos obtenidos exitosamente", doubts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error al obtener las dudas y respuestas" });
        }
    },

    async markDoubtAsResolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { doubtId } = req.params;
            const { resolved } = req.body;

            if (resolved === undefined) {
                return res.status(400).send({ message: "Falta proporcionar el campo 'resolved'" });
            }

            const doubt = await Doubt.findByIdAndUpdate(doubtId, { resolved }, { new: true });

            if (!doubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "La consulta se marcó como resuelta!", doubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar el estado de la consulta" });
        }
    },

    async markDoubtAsUnresolved(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { doubtId } = req.params;

            const doubt = await Doubt.findByIdAndUpdate(doubtId, { resolved: false }, { new: true });

            if (!doubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "OK! La consulta fue marcada como no resuelta", doubt });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al actualizar el estado de la consulta" });
        }
    },

    async deleteDoubt(req, res) {
        try {
            if (!req.user) {
                return res.status(401).send({ message: "No estás autenticado" });
            }

            const { doubtId } = req.params;

            const deletedDoubt = await Doubt.findByIdAndDelete(doubtId);

            if (!deletedDoubt) {
                return res.status(404).send({ message: "La consulta no existe" });
            }

            res.status(200).send({ message: "Consulta eliminada exitosamente" });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Ha habido un problema al eliminar la consulta" });
        }
    },
};

module.exports = DoubtController;
