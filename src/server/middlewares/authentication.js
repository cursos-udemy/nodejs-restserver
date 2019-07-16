const jwt = require('jsonwebtoken');

const ADMIN_ROLE = 'ADMIN_ROLE';
const USER_ROLE = 'USER_ROLE';

const validToken = (request, response, next) => {
    const token = request.get('Authorization');
    jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return response.status(401).json({
                status: 'error',
                message: 'Usuario no autorizado para solicitar el servicio',
                detail: err.message
            });
        }

        request.userContext = decoded
        next();
    });
};

const validTokenURL = (request, response, next) => {
    const token = request.query.token;
    jwt.verify(token, process.env.TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return response.status(401).json({
                status: 'error',
                message: 'Usuario no autorizado para solicitar el servicio',
                detail: err.message
            });
        }

        request.userContext = decoded
        next();
    });
};

const isUserAdminRole = (request, response, next) => {
    const { role } = request.userContext.user;
    if (role !== ADMIN_ROLE) {
        return response.status(401).json({
            status: 'error',
            message: 'Usuario no autorizado para realizar esta accion',
        });
    }
    next();
};

const isUserUserRole = (request, response, next) => {
    const { role } = request.userContext.user;
    if (role !== USER_ROLE) {
        return response.status(401).json({
            status: 'error',
            message: 'Usuario no autorizado para realizar esta accion',
        });
    }
    next();
};

module.exports = {
    validToken,
    validTokenURL,
    isUserAdminRole,
    isUserUserRole
}