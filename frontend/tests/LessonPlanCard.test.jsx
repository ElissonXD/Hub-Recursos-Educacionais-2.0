// Importações

import React from "react"
import {beforeEach, describe, expect, it, vi} from "vitest"
import { render, screen } from "@testing-library/react"
import {LessonPlanCard} from "../src/components/LessonPlanCard/LessonPlanCard"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/vitest"
import "@testing-library/jest-dom"

// Configuração

const onEditMock = vi.fn()
const onDeleteMock = vi.fn()
const onViewMock = vi.fn()

const planMock = {
    disciplina: "Matemática",
    título: "Plano de Aula 1",
    resumo: "Resumo do plano de aula 1",
    data: "2024-06-01T00:00:00Z",
    tags: ["Álgebra", "Geometria"]
}

function renderLessonPlanCard(){
    render(
        <LessonPlanCard 
            plan={planMock} 
            onEdit={onEditMock}
            onDelete={onDeleteMock}
            onView={onViewMock}
        />
    )
}

// Testes

describe("Testes de LessonPlanCard", () => {
    let user

    beforeEach(() => {
        vi.clearAllMocks()
        user = userEvent.setup()
    })

    // Testes positivos

    it("CT-01: Deve renderizar o componente com os dados corretos", () => {
        renderLessonPlanCard()

        expect(screen.getByText("Matemática")).toBeInTheDocument()
        expect(screen.getByText("Plano de Aula 1")).toBeInTheDocument()
        expect(screen.getByText("Resumo do plano de aula 1")).toBeInTheDocument()
        expect(screen.getByText("01 de jun. de 2024")).toBeInTheDocument()
        expect(screen.getByText("Álgebra")).toBeInTheDocument()
        expect(screen.getByText("Geometria")).toBeInTheDocument()
    })

    it("CT-02: Deve chamar onView ao clicar no card", async () => {
        renderLessonPlanCard()

        const card = screen.getByText("Plano de Aula 1")
        await user.click(card)

        expect(onViewMock).toHaveBeenCalled()
    })

    it("CT-03: Deve chamar onEdit ao clicar no botão de editar", async () => {
        renderLessonPlanCard()
        const editButton = screen.getByTestId("Editar")
        await user.click(editButton)

        expect(onEditMock).toHaveBeenCalled()
    
    })

    it("CT-04: Deve chamar onDelete ao clicar no botão de excluir", async () => {
        renderLessonPlanCard()
        
        const deleteButton = screen.getByTestId("Excluir")
        await user.click(deleteButton)

        expect(onDeleteMock).toHaveBeenCalled()
    })

})