import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function getResponse(req, res) {

    const {title, type, description} = req.body

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um assistente pedagógico especializado em organizar materiais didáticos.
                Sua tarefa é gerar descrições úteis para alunos com base no 'Título', 'Disciplina' e no 'Resumo' do material fornecido.
                
                A descrição deve ser clara, concisa, engajadora e explicar o que o aluno pode esperar aprender ou encontrar neste recurso.
                Além disso, sugira 3 tags relevantes para categorizar o material. As tags devem ser palavras únicas, contidas em um array

                Título do Material: ${title}
                Disciplina: ${type}
                Resumo: ${description}

                Responda indiscutivelmente com um objeto JSON válido e bem formatado, seguindo exatamente esta estrutura, deixe sua mensagem OBRIGATORIAMENTE em formato de texto:
                {{
                    "description": "sua descrição aqui",
                    "tags": ["tag1", "tag2", "tag3"]
                }}",`
    });

    return res.status(200).json(response.text);
}

module.exports = {}