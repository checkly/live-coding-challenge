const dataBase = []

/**
 * A simple Example controller with:
 * - an echo function, that just returns the id parameter
 *   that was passed in.
 * - a set of simple CRUD functions of objects containing a UUID
 * */
class ExampleController {

    async echo(request) {
        const id = request.params.id
        return id
    }

    async storeUUID(request, h) {
        dataBase.push(request.payload)
        return h.response('created').code(201)
    }

    async deleteUUID(request, h) {
        const id = request.params.id
        const index = dataBase.findIndex(x => x.uuid === id)
        if (index === -1) {
            return h.response().code(404)
        }
        if (index > -1) {
            dataBase.splice(index, 1);
        }
        return 'deleted'

    }

    async getUUIDs() {
        return dataBase
    }

}

module.exports = new ExampleController()
