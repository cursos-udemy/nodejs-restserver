
const handleResponseError = (statusCode, response, message, err) => {
    console.error('Error: ', message);
    let msgError = {
        status: 'error',
        message,
    };
    if (err) {
        console.error(err);
        msgError.details = err.message;
    }
    response.status(statusCode).json(msgError);
};

module.exports = {
    handleResponseError
}