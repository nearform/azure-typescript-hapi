'use strict'

import * as Hapi from 'hapi'
import * as pg from 'pg'
import * as Joi from 'joi'
const SQL = require('sql-template-strings') // lacks types

// note: all config is optional and the environment variables
// will be read if the config is not present
const pgConfig: pg.PoolConfig = {
  user: process.env.DBUSER, // || 'manager',
  password: process.env.DBPASS, // || 'supersecretpassword',
  database: process.env.DBNAME || 'ath',
  host: process.env.DBHOST || 'localhost',
  port: process.env.DBPORT || 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  ssl: process.env.DBHOST && process.env !== 'localhost' ? true : false,
}
if (!process.env.DBUSER) delete pgConfig.user
if (!process.env.DBPASS) delete pgConfig.password

console.log(`pgConfig =`, pgConfig)

// this initializes a connection pool
// it will keep idle connections open for idleTimeoutMillis
// and set a limit of maximum 10 idle clients
const pool = new pg.Pool(pgConfig)

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
})

// Create a server with a host and port
const server: Hapi.Server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: process.env.PORT || 1337,
})

// Add the routes
server.route({
  method: 'GET',
  path:'/',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) =>
    reply(`This should've failed. Go to /tasks to use this site`),
})

server.route({
  method: 'GET',
  path:'/tasks',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) =>
    pool.query(
      SQL`SELECT * FROM tasks WHERE is_completed = false`,
      (err, res) => {
        if (err) {
          return console.error('error running query', err)
        }
        reply(res.rows)
      }
    ),
})

server.route({
  method: 'POST',
  path:'/tasks',
  config: {
    validate: {
      payload: Joi.object().required().keys({
        name: Joi.string().min(1).required()
      }),
    },
    handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) =>
        pool.query(
          SQL`
            INSERT INTO tasks (name)
            VALUES (${request.payload.name})
          `,
          (err, res) => {
            if (err) {
              console.error('error running query', err)
              throw err
            }
            reply('')
          }
        )
  },
})

server.route({
  method: 'POST',
  path:'/tasks/{taskId}',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {
    pool.query(
      /*
      SQL`
        UPDATE tasks
        SET ${request.payload.name
          ? `name = '${request.payload.name}'`
          : `is_completed = true`}
        WHERE id = ${request.params.taskId}`,
        */
      SQL`
        UPDATE tasks
        SET is_completed = true
        WHERE id = ${request.params.taskId}`,
      (err, res) => {
        console.log('WOOT')
        if (err) {
          console.error('error running query', err)
          throw err
        }
        reply('')
      }
    )
  }
})

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at:', server.info.uri)
})
