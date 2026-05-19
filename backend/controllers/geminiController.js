// Importações

const dotenv = require('dotenv')
dotenv.config()
const { GoogleGenAI } = require('@google/genai');

// Configuração

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function postResponse(req, res) {
    const {title, type, description} = req.body;

    const startHr = process.hrtime.bigint();

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um assistente pedagógico especializado em organizar materiais didáticos.
                Sua tarefa é gerar descrições úteis para alunos com base no 'Título', 'Disciplina' e no 'Resumo' do material fornecido.
                Além do mais, você deve sugerir recursos adicionais relacionados ao conteúdo, como vídeos, artigos ou documentos, que
                possa acrescentar à descrição para enriquecer a experiência de aprendizado. 
                
                A descrição deve ser clara, concisa, engajadora e explicar o que o aluno pode esperar aprender ou encontrar neste recurso.
                Os recursos devem ser em formato de texto, onde cada recurso está separado por um ponto e vírgula, não coloque links, apenas o título do recurso e o nome do local onde foi encontrado.
                Além disso, sugira 3 tags relevantes para categorizar o material. As tags devem ser palavras únicas, contidas em um array

                Título do Material: ${title}
                Disciplina: ${type}
                Resumo: ${description}

                Responda indiscutivelmente com um objeto JSON válido e bem formatado, seguindo exatamente esta estrutura, deixe sua mensagem OBRIGATORIAMENTE em formato de texto:
                {{
                    "contents": "sua descrição aqui",
                    "resources": "seus recursos aqui",
                    "tags": ["tag1", "tag2", "tag3"]
                }}`
    });

    const endHr = process.hrtime.bigint();
    const durationS = Number(endHr - startHr) / 1e9;

    const tokenUsage = response.usageMetadata.totalTokenCount

    console.log(`[INFO] AI Request: Title = ${title}, Discipline = ${type}, TokenUsage = ${tokenUsage}, Latency = ${durationS.toFixed(2)}s`);
    
    const parsedContent = JSON.parse(response.text);

    return res.status(200).json(parsedContent);
}

module.exports = {postResponse}