// Banco de dados em memória temporária para simular o comportamento do backend
let mockLessonPlans = [
  {
    id: "1",
    title: "Introdução à Recursão e Divisão e Conquista",
    discipline: "Introdução à Programação",
    objective: "Compreender o conceito de recursão, pilha de execução e como quebrar problemas em subproblemas menores.",
    summary: "Abordagem prática sobre funções recursivas, garantindo o entendimento do caso base, caso indutivo e análise de algoritmos clássicos como Fibonacci e Partições.",
    scheduled_date: "2026-05-20T00:00:00.000Z",
    contents: "- O que é recursão?\n- Anatomia de uma função recursiva (Caso Base vs. Caso Indutivo)\n- Como evitar o Stack Overflow na pilha de execução\n- Algoritmos práticos de divisão e conquista",
    resources: "Slides da disciplina, Visualgo.org para visualização de estruturas, problemas selecionados no LeetCode",
    tags: ["Recursão", "Algoritmos", "IP", "Estrutura de Dados"],
    created_at: "2026-05-10T10:00:00.000Z"
  },
  {
    id: "2",
    title: "Testes Unitários e de Componentes com Vitest",
    discipline: "Engenharia de Software",
    objective: "Aprender a isolar componentes React e testar comportamentos, interações de clique e renderização de estados.",
    summary: "Introdução ao ecossistema de testes moderno para aplicações frontend utilizando Vitest e React Testing Library.",
    scheduled_date: "2026-05-25T00:00:00.000Z",
    contents: "- Configuração inicial do Vitest no Vite\n- Criação de Mocks para funções, contextos e chamadas de API\n- Renderização isolada de componentes em ambiente simulado (happy path)\n- Asserções comuns e análise de cobertura de código (coverage)",
    resources: "Documentação oficial do Vitest, Guia prático da Testing Library, Repositório com boilerplates de teste",
    tags: ["Vitest", "React", "QA", "Testes"],
    created_at: "2026-05-12T14:30:00.000Z"
  },
  {
    id: "3",
    title: "Desenvolvimento de Jogos 2D: Máquinas de Estados",
    discipline: "Desenvolvimento de Jogos",
    objective: "Implementar uma Finite State Machine (FSM) robusta para controle de movimentação e animação de personagens.",
    summary: "Criação de padrões de arquitetura voltados a jogos para evitar códigos espaguete repletos de condicionais complexas no tratamento de inputs.",
    scheduled_date: "2026-06-02T00:00:00.000Z",
    contents: "- O problema dos 'ifs' infinitos na função de física do motor\n- Estrutura de um padrão State básico (Enter, Exit, Update)\n- Transições fluidas de estado (Idle, Running, Jumping, Attacking)\n- Integração com o reprodutor de animações",
    resources: "Documentação de arquitetura de jogos, tutoriais de padrões de projeto (FSM), pacotes de sprites 2D para testes",
    tags: ["Gamedev", "Arquitetura", "FSM", "Lógica"],
    created_at: "2026-05-14T09:15:00.000Z"
  }
];

export const api = {
  // Simula a listagem completa com busca, paginação, filtros e ordenação
  list: async (params) => {
    // Delay de 400ms para simular a resposta de uma requisição HTTP
    await new Promise((resolve) => setTimeout(resolve, 400));

    let filtered = [...mockLessonPlans];

    // Filtro por Texto (Título ou Ementa)
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.summary.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por Disciplina
    if (params.discipline) {
      const discLower = params.discipline.toLowerCase();
      filtered = filtered.filter((p) =>
        p.discipline.toLowerCase().includes(discLower)
      );
    }

    // Filtro por Tags individuais
    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter((p) =>
        params.tags.every((t) =>
          p.tags?.some((pt) => pt.toLowerCase().includes(t.toLowerCase()))
        )
      );
    }

    // Filtro por Data
    if (params.date) {
      filtered = filtered.filter((p) => p.scheduled_date?.startsWith(params.date));
    }

    // Ordenação dinâmica
    filtered.sort((a, b) => {
      const field = params.sort || "created_at";
      const valA = a[field] || "";
      const valB = b[field] || "";

      if (typeof valA === "string") {
        return params.order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return params.order === "asc" ? valA - valB : valB - valA;
    });

    // Paginação
    const total = filtered.length;
    const page = params.page || 1;
    const perPage = params.per_page || 9;
    const startIndex = (page - 1) * perPage;
    const paginatedData = filtered.slice(startIndex, startIndex + perPage);

    return {
      data: paginatedData,
      total: total,
    };
  },

  // Simula a criação de um novo plano de aula
  create: async (form) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newPlan = {
      ...form,
      id: String(Date.now()), // Gera um ID único baseado no timestamp
      created_at: new Date().toISOString(),
    };
    
    // Adiciona no início da lista para aparecer primeiro por padrão
    mockLessonPlans = [newPlan, ...mockLessonPlans];
    return newPlan;
  },

  // Simula a edição/atualização de um plano existente
  update: async (id, form) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    mockLessonPlans = mockLessonPlans.map((p) =>
      p.id === id ? { ...p, ...form } : p
    );
    return { success: true };
  },

  // Simula a remoção de um plano de aula
  remove: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    mockLessonPlans = mockLessonPlans.filter((p) => p.id !== id);
    return { success: true };
  },

  // Simula as recomendações geradas de forma inteligente por IA (Smart Assist)
  smartAssist: async ({ title, discipline, summary }) => {
    // Delay um pouco maior para fingir o processamento do LLM
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Quebra o título para gerar algumas tags dinâmicas divertidas baseadas no input
    const dynamicTag = title.split(" ")[0] || "Educacional";

    return {
      contents: `• Tópico Conceitual: Fundamentos essenciais aplicados a "${title}".\n• Prática Guiada: Resolução passo a passo de problemas baseados no escopo de ${discipline}.\n• Discussão de Caso: Debate em sala correlacionando a ementa com aplicações reais do mercado técnico.`,
      resources: `- Slides detalhados e notas de aula sobre ${title}.\n- Documentações oficiais e guias de referência rápida para a ementa.\n- Links para desafios práticos em ambientes de testes e desenvolvimento.`,
      tags: ["IA", dynamicTag, "SmartAssist"],
    };
  },
};