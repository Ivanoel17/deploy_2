require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const storeData = require('../services/storeData'); // Import storeData

(async () => {
    const server = Hapi.server({
        port: 8000,
        host: '127.0.0.1',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    // Rute
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Hello World!' };
        }
    });

    // storeData firestore
    server.route({
        method: 'POST',
        path: '/store-data',
        handler: async (request, h) => {
            const { id, data } = request.payload;
            try {
                await storeData(id, data);
                return { status: 'success', message: 'Data has been stored in Firestore!' };
            } catch (error) {
                console.error(error);
                return h.response({ status: 'fail', message: 'Failed to store data' }).code(500);
            }
        }
    });

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `${response.message}`
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();
