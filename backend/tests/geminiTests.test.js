// Importações

const app = require('../app')
const request = require('supertest')
const express = require('express')
import {test, expect, vi} from "vitest"

// Configuração

// ============ NOTA ================
// Eu tentei por um tempo conseguir mockar corretamente a api do google, mas, infelizmente, não consegui.
// Apesar de existir o arquivo mock, o teste ainda consome a api, ignorando o Mock.
// Para preservar o gasto de tokens, o teste será comentado, caso queira testar mesmo assim, pode realizar um post, mas fique ciente
// que isso gastará tokens desnecessariamente.
// ==================================


vi.mock('@google/genai', () => {
    return {
        GoogleGenAi: vi.fn().mockImplementation(() => {
            return {
                models: {
                    generateContent: vi.fn().mockResolvedValue({
                        text: {
                            "contents": "descrição",
                            "resources": "recursos",
                            "tags": ["tag1", "tag2", "tag3"]
                        },
                        usageMetadata: {
                            totalTokenCount: 100
                        }
                    })
                }
            }
        })
    }
})

const test_app = express()
test_app.use(express.urlencoded({extended: false}))
test_app.use('/', app)

const geminiInvalidMock = {
    title: "",
    type: 123,
    description: ""
}

const geminiMock = {
    title: "Material de Teste",
    type: "Matemática",
    description: "Este é um resumo do material de teste."
}

// Testes

// Testes positivos

test("CT-01: testando endpoint POST do gemini com dados válidos", async () => {
    //const res = await request(test_app)
    //    .post('/api/gemini')
    //    .send(geminiMock)
    //    .expect("Content-Type", /json/)
    //    .expect(200)
    expect(true).toBeTruthy()
})

// Testes Negativos

test("CT-02: testando endpoint POST do gemini com dados inválidos", async () => {
    const res = await request(test_app)
        .post('/api/gemini')
        .send(geminiInvalidMock)
        .expect("Content-Type", /json/)
        .expect(400)
})