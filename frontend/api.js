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
        filteredAulas = filteredAulas.filter(aula => params.tags.every(tag => aula.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))));
      }

      if (params.date){
        filteredAulas = filteredAulas.filter((aula) => {
          const aulaDate = new Date(aula.data)
          const year = aulaDate.getFullYear();
          const month = String(aulaDate.getMonth() + 1).padStart(2, '0');
          const day = String(aulaDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          return formattedDate === params.date;
        });
      }

      filteredAulas.sort((a, b) => {
          let field = params.sort || "created_at";

          if (field === "title") field = "título"
          if (field === "created_at") field = "data"

          const valA = a[field] ?? "";
          const valB = b[field] ?? "";

          if (field === "data" && valA && valB) {
            const timeA = new Date(valA).getTime();
            const timeB = new Date(valB).getTime();
            if (!isNaN(timeA) && !isNaN(timeB)) {
              return params.order === "asc" ? timeA - timeB : timeB - timeA;
            }
          }

          if (typeof valA === "string" && typeof valB === "string") {
            return params.order === "asc"
              ? valA.localeCompare(valB, "pt-BR", { sensitivity: "base" })
              : valB.localeCompare(valA, "pt-BR", { sensitivity: "base" });
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