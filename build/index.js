'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Hapi = require("hapi");
var pg = require("pg");
var SQL = require('sql-template-strings');
var pgConfig = {
    user: process.env.DBUSER || 'nearform',
    password: process.env.DBPASS || 'supersecretpassword',
    database: process.env.DBNAME || 'appdb',
    host: process.env.DBHOST || 'localhost',
    port: process.env.DBPORT || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    ssl: process.env.DBHOST && process.env !== 'localhost' ? true : false,
};
console.log("pgConfig =", pgConfig);
var pool = new pg.Pool(pgConfig);
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: process.env.PORT || 1337,
});
server.route({
    method: 'GET',
    path: '/tasks',
    handler: function (request, reply) {
        return pool.query((_a = ["SELECT * FROM tasks WHERE is_completed = false"], _a.raw = ["SELECT * FROM tasks WHERE is_completed = false"], SQL(_a)), function (err, res) {
            if (err) {
                return console.error('error running query', err);
            }
            reply(res.rows);
        });
        var _a;
    }
});
server.route({
    method: 'POST',
    path: '/tasks',
    handler: function (request, reply) {
        return pool.query((_a = ["\n          INSERT INTO tasks (name)\n          VALUES (", ")\n        "], _a.raw = ["\n          INSERT INTO tasks (name)\n          VALUES (", ")\n        "], SQL(_a, request.payload.name)), function (err, res) {
            if (err) {
                console.error('error running query', err);
                throw err;
            }
            reply('');
        });
        var _a;
    }
});
server.route({
    method: 'POST',
    path: '/tasks/{taskId}',
    handler: function (request, reply) {
        pool.query((_a = ["\n        UPDATE tasks\n        SET is_completed = true\n        WHERE id = ", ""], _a.raw = ["\n        UPDATE tasks\n        SET is_completed = true\n        WHERE id = ", ""], SQL(_a, request.params.taskId)), function (err, res) {
            console.log('WOOT');
            if (err) {
                console.error('error running query', err);
                throw err;
            }
            reply('');
        });
        var _a;
    }
});
server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
//# sourceMappingURL=index.js.map