process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const DB_URL_DEV = 'mongodb://192.168.0.201:27017/udemy-nodejs-cafe';
const DB_URL_PROD = process.env.MONGO_DB;
process.env.DATA_BASE_URL = process.env.NODE_ENV === 'dev' ? DB_URL_DEV : DB_URL_PROD;
