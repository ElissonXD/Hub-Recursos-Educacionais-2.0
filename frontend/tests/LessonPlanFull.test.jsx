// Importações

import React from "react"
import {beforeEach, describe, expect, it, vi} from "vitest"
import { render, screen } from "@testing-library/react"
import { LessonPlanFull } from "../src/components/LessonPlanFull/LessonPlanFull"
import "@testing-library/jest-dom/vitest"
import "@testing-library/jest-dom"

// Configuração

const planMock = {
    título: "Álgebra",
    objetivo: "Ensinar álgebra",
    resumo: "Plano de aula para ensinar álgebra",
    data: "2024-06-01T00:00:00Z",
    disciplina: "Matemática",
    conteúdos: "Equações, Inequações, Funções",
    recursos: "Livro didático",
    tags: ["Cálculo", "Funções"]
}

const onCloseMock = vi.fn()

function renderLessonPlanFull(){
    render(
        <LessonPlanFull 
            open={true} 
            plan={planMock} 
            onClose={onCloseMock}
        />
    )
}

// Testes

describe("Testes de LessonPlanFull", () => {

    // Testes positivos

    it("CT-01: Deve renderizar o card com as informações do material", () => {
        renderLessonPlanFull()

        expect(screen.getByText("Álgebra")).toBeInTheDocument()
        expect(screen.getByText("Ensinar álgebra")).toBeInTheDocument()
        expect(screen.getByText("Plano de aula para ensinar álgebra")).toBeInTheDocument()
        expect(screen.getByText("31 de mai. de 2024")).toBeInTheDocument()
        expect(screen.getByText("Matemática")).toBeInTheDocument()
        expect(screen.getByText("Equações, Inequações, Funções")).toBeInTheDocument()
        expect(screen.getByText("Livro didático")).toBeInTheDocument()
        expect(screen.getByText("Cálculo")).toBeInTheDocument()
        expect(screen.getByText("Funções")).toBeInTheDocument()
    })
})