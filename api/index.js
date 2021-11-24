const Hapi = require('@hapi/hapi')
const Joi = require('joi')

let server

exports.init = async (config = {}) => {
    server = new Hapi.Server({
        host: config.bind || '0.0.0.0',
        port: config.port || 0,
        router: {
            stripTrailingSlash: true
        },
        routes: {
            validate: {
                failAction: (request, h, err) => {
                    // This preserves joi error details in responses. In future joi versions,
                    // this output will no longer be HTML-escaped by default.
                    throw err
                }
            },
            response: {
                emptyStatusCode: 200
            }
        }
    })
    server.validator(Joi)

    // modules
    await server.register([
        require('./src/modules/example'),
        require('./src/modules/task1')
    ])

    return server.initialize()
}

exports.server = () => {
    return server
}

if (!module.parent) {
    (async ()=>{
        await exports.init({port:4000})
        await server.start()
        console.info('Server running at:', server.info.uri)
    })()
    process.on('unhandledRejection', (err) => {
        // This causes the process to crash on unhandled rejections, indentical
        // in behavior to unhandled exceptions. This is recommended, but you
        // may notice more of these after the hapi v19 upgrade due to dropping node domains support.
        // Errors that cause crashes like this generally should be considered bugs and be fixed.
        throw err
    })
}
