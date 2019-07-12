const jwt = require('jsonwebtoken');

const validToken = (request, response, next) => {
    const token = request.get('Authorization');

    const a = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return response.status(401).json({
                status: 'error',
                message: 'Usuario no autorizado para solicitar el servicio',
                detail: err.message
            });
        }

        console.log('decoded: ', decoded);
        request.user = decoded
        next();
    });
};

module.exports = {
    validToken
}