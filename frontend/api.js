// Importações

import axios from "axios";

// Apis

const api = {

  getAulas: async (params) => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/aulas`);
      
      let filteredAulas = [...response.data.data];
      
      if (params.search){
        filteredAulas = filteredAulas.filter(aula => aula.título.toLowerCase().includes(params.search.toLowerCase()));
      }

      if (params.discipline){
        filteredAulas = filteredAulas.filter(aula => aula.disciplina.toLowerCase().includes(params.discipline.toLowerCase()))
      }

      if (params.tags && params.tags.length > 0){
        filteredAulas = filteredAulas.filter(aula => aula.tags.every(tag => tag.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))));
      }

      if (params.date){
        filteredAulas = filteredAulas.filter((aula) => aula.data?.startsWith(params.date));
      }

      filteredAulas.sort((a, b) => {
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

      const length = filteredAulas.length;
      const page = params.page || 1
      const per_page = params.per_page || 9
      const start = (page - 1) * per_page;
      const end = start + per_page;
      const paginatedAulas = filteredAulas.slice(start, end);

      return { data: paginatedAulas, total: length};
    },
  postAula: async (aula) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/aulas`, aula);
      return response.data.success;
  },

  putAula: async (aula) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/aulas/`, aula);
      return response.data.success;
  },

  deleteAula: async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/aulas/?id=${id}`);
    return response.data.success;
  },


  postGemini: async (data) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/gemini`, data);
    return response.data;
  }

}

export default api;