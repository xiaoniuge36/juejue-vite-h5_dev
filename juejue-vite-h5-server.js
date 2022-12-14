const server = require('pushstate-server')

server.start({
  port: 5173,
  directory: './dist'
})
