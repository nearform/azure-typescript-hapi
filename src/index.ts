'use strict'

import * as Hapi from 'hapi'

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
    reply({ body: 'Hello, world' }),
})

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {
    const response = { body: `Hello, ${encodeURIComponent(request.params.name)}!` }

    // request.log is HAPI standard way of logging
    request.log('the response/reply is', response)

    // you can also use a pino instance, which will be faster
    request.logger.info('In handler %s', request.path)

    reply(response)
  },
})

server.register(require('hapi-pino'), (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  // the logger is available in server.app
  server.app.logger.warn('Pino is registered')

  // also as a decorated API
  server.logger().info('another way for accessing it')

  // and through Hapi standard logging system
  server.log(['subsystem'], 'third way for accessing it')

  // Start the server
  server.start((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})
