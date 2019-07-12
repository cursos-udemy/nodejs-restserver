process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const DB_URL_DEV = 'mongodb://192.168.0.201:27017/udemy-nodejs-cafe';
const DB_URL_PROD = process.env.MONGO_DB;
process.env.DATA_BASE_URL = process.env.NODE_ENV === 'dev' ? DB_URL_DEV : DB_URL_PROD;


process.env.TOKEN_EXPIRED_IN = process.env.TOKEN_EXPIRED_IN || (60 * 60 * 24 * 7);
process.env.TOKEN_PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY || 'jendrix';

//TODO: SOLO PARA PRUEBAS!
// process.env.DATA_BASE_URL = 'mongodb+srv://jendrix:???????@cluster0-zfegt.mongodb.net/udemy-nodejs-cafe?retryWrites=true&w=majority';
