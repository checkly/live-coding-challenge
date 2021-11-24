const Joi = require('joi')
const ExampleController = require('./ExampleController')

module.exports = [
    {
        method: 'GET',
        path: '/example/{id}/echo',
        config: {
            validate: {
                params: {
                    id: Joi.string().uuid().required()
                }
            },
            plugins: {},
            handler: ExampleController.echo
        }
    },
    {
        method: 'POST',
        path: '/example/uuid',
        config: {
            validate: {
                payload: Joi.object().keys({
                    uuid: Joi.string().uuid().required().description("the uuid payload")
                })
            },
            plugins: {},
            handler: ExampleController.storeUUID
        }
    },
    {
        method: 'DELETE',
        path: '/example/uuid/{id}',
        config: {
            validate: {
                params: {
                    id: Joi.string().uuid().required()
                }
            },
            handler: ExampleController.deleteUUID
        }
    },
    {
        method: 'GET',
        path: '/example/uuid',
        config: {
            handler: ExampleController.getUUIDs
        }
    }
]
