const routes = require('./routes')

exports.register = function (server) {
    server.route(routes)
}

Object.assign(exports, {
    name: 'task1'
})
