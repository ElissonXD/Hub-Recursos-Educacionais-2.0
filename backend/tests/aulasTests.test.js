// Importações

const app = require('../app')
import {test, expect, beforeAll} from "vitest"
const request = require("supertest")
const express = require("express")

// Configuração

const test_app = express()
test_app.use(express.urlencoded({extended: false}))
test_app.use('/', app)

beforeAll(async () => {
    await request(test_app)
        .get('/api/db')
})

const aulaMock ={
    título: "Teste",
    objetivo: "Teste",
    resumo: "Teste",
    data_prevista: "2023-10-10",
    disciplina: "Teste",
    conteúdos: "Teste",
    recursos: "Teste",
    tags: ["Teste"]
}

// Testes

// Testes positivos

test("CT-01: testando endpoint GET de aulas", async () => {
    const res = await request(test_app)
        .get('/api/aulas')
        .expect("Content-Type", /json/)
        .expect(200)
    
    expect(res.body.data).toBeInstanceOf(Array)
})

test("CT-02: testando endpoint POST de aulas", async () => {
    const res = await request(test_app)
        .post('/api/aulas')
        .send(aulaMock)
        .expect("Content-Type", /json/)
        .expect(201)
})

test("CT-03: testando endpoint PUT de aulas", async () => {
    const res = await request(test_app)
        .put('/api/aulas')
        .send({...aulaMock, título: "atualizado", id: 1})
        .expect("Content-Type", /json/)
        .expect(200)
})

test("CT-04: testando endpoint DELETE de aulas", async () => {
    const res = await request(test_app)
        .delete('/api/aulas/?id=1')
        .expect("Content-Type", /json/)
        .expect(200)
})

// Testes negativos

test("CT-05: testando endpoint POST de aulas com dados faltando/inválidos", async () => {
    const res = await request(test_app)
        .post('/api/aulas')
        .send({...aulaMock, título: '', objetivo: 123})
        .expect("Content-Type", /json/)
        .expect(400)
})

test("CT-06: testando endpoint PUT de aulas com dados faltando/inválidos", async () => {
    const res = await request(test_app)
        .put('/api/aulas')
        .send({...aulaMock, título: '', objetivo: 123, id: 1})
        .expect("Content-Type", /json/)
        .expect(400)
})

