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
        return reply({ body: "Hello, " + encodeURIComponent(request.params.name) + "!" });
    },
});
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
//# sourceMappingURL=index.js.map