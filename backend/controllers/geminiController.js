// Importações

const dotenv = require('dotenv')
dotenv.config()
const { GoogleGenAI } = require('@google/genai');

// Configuração

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function getResponse(req, res) {
    const {title, type, description} = req.body;

    const startHr = process.hrtime.bigint();

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
                }}`
    });

    const endHr = process.hrtime.bigint();
    const durationS = Number(endHr - startHr) / 1e9;

    const tokenUsage = response.totalTokens

    console.log(`[INFO] AI Request: Title = ${title}, Discipline = ${type}, TokenUsage = ${tokenUsage}, Latency = ${durationS.toFixed(2)}s`);

    return res.status(200).json(response.text || response);
}

module.exports = {getResponse}