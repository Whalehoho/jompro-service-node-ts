require('dotenv').config();
const { readFileSync } = require('fs');

// Validate required environment variables
const requiredEnv = [
    'API_PORT',

    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',

    'REDIS_HOST',
    'REDIS_PORT',

    'SOCKET_PORT',

    'EVENT_ENGINE_HOST',
    'EVENT_ENGINE_PORT',

    'FACE_ENGINE_HOST',
    'FACE_ENGINE_PORT',
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const projectId = 'jompro';

exports.api = {
    port: Number(process.env.API_PORT),
};

exports.postgres = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
};

exports.redis = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    namespace: projectId,
};

exports.socket = {
    port: Number(process.env.SOCKET_PORT),
};

exports.event_recommender_engine = {
    host: process.env.EVENT_ENGINE_HOST,
    port: Number(process.env.EVENT_ENGINE_PORT),
};

exports.face_verifier_engine = {
    host: process.env.FACE_ENGINE_HOST,
    port: Number(process.env.FACE_ENGINE_PORT),
};
