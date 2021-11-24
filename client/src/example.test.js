const {init, server} = require('../../api/index');
const {v4: uuid} = require('uuid');
let hapiServer;
beforeAll(async () => {
    await init()
    hapiServer = server();
});

afterAll(async () => {
    await hapiServer.stop();
});

describe('GET /example/{id}/echo only accepts UUIDS as id', () => {

    test('when id is not a UUID it returns 400', async () => {
        const res = await hapiServer.inject({
            method: 'get',
            url: '/example/invalid-id/echo'
        });
        expect(res.statusCode).toBe(400);
    });

    test('when id is a valid UUID it returns the id', async () => {

        const expectedUUID = uuid()
        const res = await hapiServer.inject({
            method: 'get',
            url: `/example/${expectedUUID}/echo`
        });
        expect(res.statusCode).toBe(200);
        expect(res.result).toBe(expectedUUID)
    });
});

describe('/example/uuid CRUD tests', () => {

    getAll = async () => {
        const res = await hapiServer.inject({
            method: 'GET',
            url: '/example/uuid/',
        });
        return res.result
    }

    test('creating&deleting a uuid', async () => {
        const initialLength = (await getAll()).length

        const postObject = {uuid: uuid()}
        const res = await hapiServer.inject({
            method: 'POST',
            url: '/example/uuid/',
            payload: postObject
        });
        expect(res.statusCode).toBe(201);
        expect(res.result).toBe('created')
        const lengthAfterCreate = (await getAll()).length
        expect(lengthAfterCreate).toBe(initialLength + 1)

        const deleteResponse = await hapiServer.inject({
            method: 'DELETE',
            url: `/example/uuid/${postObject.uuid}`,
            payload: postObject
        });
        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.result).toBe('deleted')
        const finalLength = (await getAll()).length
        expect(finalLength).toBe(initialLength)
    })

    test('it returns 404 when deleting a non existent object', async () => {
        const postObject = {uuid: uuid()}
        const deleteResponse = await hapiServer.inject({
            method: 'DELETE',
            url: `/example/uuid/${postObject.uuid}`,
            payload: postObject
        });
        expect(deleteResponse.statusCode).toBe(404);
    })

    test('it returns an array for GET /example/uuid/ ', async () => {
        const res = await hapiServer.inject({
            method: 'GET',
            url: '/example/uuid/',
        });
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.result)).toBeTruthy()
    })

})
