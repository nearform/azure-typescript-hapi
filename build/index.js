'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Hapi = require("hapi");
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: process.env.PORT || 1337,
});
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply({ body: 'Hello, world' });
    },
});
server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        var response = { body: "Hello, " + encodeURIComponent(request.params.name) + "!" };
        request.log('the response/reply is', response);
        reply(response);
    },
});
server.register(require('hapi-pino'), function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    server.app.logger.warn('Pino is registered');
    server.log(['subsystem'], 'third way for accessing it');
    server.start(function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
});
//# sourceMappingURL=index.js.map