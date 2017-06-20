'use strict'

import * as Hapi from 'hapi'

// Create a server with a host and port
// const server = new Hapi.Server()
const server: Hapi.Server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8000,
})

// Add the routes
server.route({
  method: 'GET',
  path:'/',
  handler: (request, reply) =>
    reply({ body: 'hello world' }),
})

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (request, reply) =>
    reply({ body: `Hello, ${encodeURIComponent(request.params.name)}!` }),
})

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at:', server.info.uri)
})
