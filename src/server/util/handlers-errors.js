
const handleResponseError = (statusCode, response, message, err) => {
    console.error(err);
    let msgError = {
        status: 'error',
        message,
    };
    if (err) {
        msgError.details = err.message;
    }
    response.status(statusCode).json(msgError);
};

module.exports = {
    handleResponseError
}