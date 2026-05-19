// Importações

import React from "react"
import {beforeEach, describe, expect, it, vi} from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import {LessonPlanForm} from "../src/components/LessonPlanForm/LessonPlanForm"
import userevent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import "@testing-library/jest-dom"
import api from "../api"

// Configuração

vi.mock("../api", () => ({
    default: {
        postAula: vi.fn().mockResolvedValue({}),
        putAula: vi.fn().mockResolvedValue({}),
        postGemini: vi.fn().mockResolvedValue({
            contents: "Tópicos de Álgebra Avançada",
            resources: "Slides de Geometria, Khan Academy",
            tags: ["Matemática", "Álgebra", "Geometria"]
        })
    }
}))

const planMock = {
    id: 1,
    título: "Álgebra",
    objetivo: "Ensinar álgebra",
    resumo: "Plano de aula para ensinar álgebra",
    data: "2024-06-01T00:00:00Z",
    disciplina: "Matemática",
    conteúdos: "Equações, Inequações, Funções",
    recursos: "Livro didático",
    tags: ["Cálculo", "Funções"]
}

const onSavedMock = vi.fn()
const onOpenChangeMock = vi.fn()

function renderLessonPlanForm(plan = null){
    render(
        <LessonPlanForm 
            open={true} 
            initial={plan} 
            onSaved={onSavedMock}
            onOpenChangeMock={onOpenChangeMock}
        />
    )
}

// Testes

describe("Testes de LessonPlanForm", () => {
    let user;

    beforeEach(() => {
        vi.clearAllMocks()
        user = userevent.setup()
    })

    // Testes positivos

    it("CT-01: Deve renderizar o formulário para criação", () => {
        renderLessonPlanForm()

        expect(screen.getByText(/Novo plano de aula/i)).toBeInTheDocument()
    })

    it("CT-02: Deve renderizar o formulário para edição com os dados preenchidos", () => {
        renderLessonPlanForm(planMock)

        expect(screen.getByText(/Editar plano de aula/i)).toBeInTheDocument()

        expect(screen.getByDisplayValue("Álgebra")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Ensinar álgebra")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Plano de aula para ensinar álgebra")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Matemática")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Equações, Inequações, Funções")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Livro didático")).toBeInTheDocument()
        expect(screen.getByText("Cálculo")).toBeInTheDocument()
        expect(screen.getByText("Funções")).toBeInTheDocument()
    })
    
    it ("CT-03: Deve chamar onSaved ao tentar salvar um plano", async () => {
        renderLessonPlanForm(planMock)

        const saveButton = screen.getByRole("button", {name: /Salvar alterações/i})
        await user.click(saveButton)
        await waitFor(() => {
            expect(api.putAula).toHaveBeenCalled()
            expect(onSavedMock).toHaveBeenCalled()
        })
    })

    it("CT-04: Deve preencher campos de conteúdos, recursos e tags com IA", async () => {
        renderLessonPlanForm({
            ...planMock, conteúdos:'', recursos:'', tags: []})
        
        const aiButton = screen.getByRole("button", {name: "Gerar Recomendações com IA"})

        await user.click(aiButton)

        expect(api.postGemini).toHaveBeenCalledWith({
            title: "Álgebra",
            type: "Matemática",
            description: "Plano de aula para ensinar álgebra"
        })

        expect(await screen.findByDisplayValue("Tópicos de Álgebra Avançada")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Slides de Geometria, Khan Academy")).toBeInTheDocument()
        expect(screen.getByText("Matemática")).toBeInTheDocument()
        
        })


    // Testes negativos

    it("CT-05: Deve mostrar mensagens de erro ao tentar salvar com campos obrigatórios vazios", async () => {
        renderLessonPlanForm()
        const saveButton = screen.getByRole("button", {name: /Criar plano/i})
        await user.click(saveButton)

        expect(screen.getByText(/Informe o título/i)).toBeInTheDocument()
        expect(screen.getByText(/Informe a disciplina/i)).toBeInTheDocument()
        expect(screen.getByText(/Informe o objetivo/i)).toBeInTheDocument()
        expect(screen.getByText(/Informe a ementa/i)).toBeInTheDocument()
        expect(screen.getByText(/Informe a data/i)).toBeInTheDocument()
    })

})
