const User = require("../models/Usuario");

const jwt = require("jsonwebtoken");

const { jwt_secret } = require("../config/keys.js");

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const payload = jwt.verify(token, jwt_secret);

        const user = await User.findOne({ _id: payload._id, tokens: token });

        if (!user) {
            return res.status(401).send({ message: "No estas autorizado" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).send({ error, message: "Ha habido un problema con el token" });
    }
};

const isTeacher = async (req, res, next) => {
    const teachers = ["teach", "tAssis"];
    if (!teachers.includes(req.user.role)) {
        return res.status(403).send({ message: "Acceso denegado. No eres profesor" });
    }
    next();
};
module.exports = { authentication, isTeacher };
