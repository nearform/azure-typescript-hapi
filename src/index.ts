'use strict'

import * as Hapi from 'hapi'

// Create a server with a host and port
const server: Hapi.Server = new Hapi.Server()
server.connection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 1337,
})

// Add the routes
server.route({
  method: 'GET',
  path:'/',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) =>
    reply({ body: 'Hello, world' }),
})

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) =>
    reply({ body: `Hello, ${encodeURIComponent(request.params.name)}!` }),
})

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at:', server.info.uri)
})
