const app = require('../server');
const request = require('supertest');
const assert = require('assert');

describe('Testing mern server APIs', ()=>{
    
    it('Testing POST APIs', async ()=>{
        const postResponse = await request(app)
        .post('/api/v1/post')
        .send({'KEY':'VALUE'})
        .expect(201)
        assert.match(postResponse.body.message, /POST/);
    })

    it('Testing GET APIs', async ()=>{
        const getResponse = await request(app)
        .get('/api/v1/get')
        .expect(200)
        assert.strictEqual(getResponse.body.read, '/api/v1/get')
    })

    it('Testing PUT APIs',async ()=>{
        const putResponse = await request(app)
        .put(`/api/v1/put/${Date.now()}`)
        .expect(200)
        assert.match(putResponse.body.message, /PUT/);
    })

    it('Testing DELETE APIs',async ()=>{
        const deleteResponse = await request(app)
        .delete(`/api/v1/delete/${Date.now()}`)
        .expect(200)
        assert.match(deleteResponse.body.message, /DELETE/);
    })
})