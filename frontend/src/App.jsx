import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  BookOpen,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Importação da API (ajuste o caminho se necessário)
import { api } from "../api";

// Mantendo os seus caminhos customizados de componentes
import { LessonPlanForm } from "./components/LessonPlanForm/LessonPlanForm";
import { LessonPlanCard } from "./components/LessonPlanCard/LessonPlanCard";

const PER_PAGE = 9;

// Hook customizado convertido para JS
function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function App() {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const dSearch = useDebounced(search);
  const dTags = useDebounced(tagsFilter);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const params = useMemo(
    () => ({
      page,
      per_page: PER_PAGE,
      search: dSearch || undefined,
      discipline: discipline || undefined,
      tags: dTags ? dTags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      date: date || undefined,
      sort,
      order,
    }),
    [page, dSearch, discipline, dTags, date, sort, order]
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.list(params);
      setData(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar.");
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [params]);

  useEffect(() => {
    setPage(1);
  }, [dSearch, discipline, dTags, date, sort, order]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await api.remove(deleting.id);
      toast.success("Plano excluído com sucesso!");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível excluir.");
    }
  }

  const allDisciplines = useMemo(
    () => Array.from(new Set(data.map((p) => p.discipline).filter(Boolean))),
    [data]
  );

  return (
    <div className="container">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="brand-container">
            <div className="icon-box">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="subtitle">Plataforma Pedagógica</p>
              <h1 className="title">Planos de Aula</h1>
            </div>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="primary-button"
          >
            <Plus size={16} style={{ marginRight: "6px" }} />
            Novo plano
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="status-badge">Smart Assist com IA</span>
            <h2 className="hero-title">
              Planeje aulas com clareza,<br />
              <span style={{ fontStyle: "italic", color: "#4f46e5" }}>organize com elegância.</span>
            </h2>
            <p className="hero-text">
              Cadastre, edite e consulte planos de aula. Use a IA para gerar conteúdos,
              recursos e tags em segundos — você revisa, ajusta e publica.
            </p>
          </div>
        </section>

        {/* Filtros */}
        <section className="filters-section">
          <div className="filters-grid">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título…"
                className="filter-input"
                style={{ paddingLeft: "36px" }}
              />
            </div>

            <input
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              placeholder="Disciplina"
              className="filter-input"
            />

            <input
              value={tagsFilter}
              onChange={(e) => setTagsFilter(e.target.value)}
              placeholder="Tags (vírgula)"
              className="filter-input"
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="filter-input"
            />

            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="filter-input"
                style={{ flex: 1 }}
              >
                <option value="created_at">Cadastro</option>
                <option value="title">Título</option>
              </select>

              <button
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                title={order === "asc" ? "Crescente" : "Decrescente"}
                className="icon-button"
              >
                <ArrowUpDown size={14} style={{ marginRight: "4px" }} />
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {order === "asc" ? "A→Z" : "Z→A"}
                </span>
              </button>
            </div>
          </div>

          {(search || discipline || tagsFilter || date) && (
            <div className="active-filters">
              <SlidersHorizontal size={14} />
              <span>Filtros ativos</span>
              <button
                onClick={() => {
                  setSearch("");
                  setDiscipline("");
                  setTagsFilter("");
                  setDate("");
                }}
                className="clear-button"
              >
                Limpar
              </button>
            </div>
          )}

          {allDisciplines.length > 0 && !discipline && (
            <div className="discipline-tags">
              {allDisciplines.slice(0, 8).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiscipline(d)}
                  className="tag-filter-button"
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Listagem / Estados da UI */}
        <section>
          {loading ? (
            <div className="center-state">
              <Loader2 size={24} className="animate-spin" />
              <p style={{ marginTop: "12px", fontSize: "14px" }}>Carregando planos…</p>
            </div>
          ) : error ? (
            <div className="error-card">
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>Não foi possível carregar.</p>
              <p style={{ fontSize: "14px", color: "#ef4444", marginTop: "4px" }}>{error}</p>
              <button onClick={load} className="icon-button" style={{ marginTop: "16px", padding: "8px 16px" }}>
                Tentar novamente
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <Inbox size={32} style={{ color: "#9ca3af" }} />
              <p style={{ fontSize: "20px", fontWeight: "600", marginTop: "12px" }}>Nenhum plano por aqui</p>
              <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                Crie o primeiro plano de aula para começar.
              </p>
              <button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="primary-button"
                style={{ marginTop: "16px" }}
              >
                <Plus size={16} style={{ marginRight: "6px" }} />
                Novo plano
              </button>
            </div>
          ) : (
            <>
              <div className="grid-cards">
                {data.map((p) => (
                  <LessonPlanCard
                    key={p.id}
                    plan={p}
                    onEdit={(plan) => {
                      setEditing(plan);
                      setFormOpen(true);
                    }}
                    onDelete={(plan) => setDeleting(plan)}
                  />
                ))}
              </div>

              {/* Paginação */}
              <div className="pagination-container">
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  {total} {total === 1 ? "plano" : "planos"} • página {page} de {totalPages}
                </p>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="page-button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="page-button"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <footer className="footer-container">
          <span>Plataforma Pedagógica</span>
          <span>Backend: <code className="code-block">{import.meta.env.VITE_API_URL ?? "http://localhost:8000"}</code></span>
        </footer>
      </main>

      {/* Form Modal */}
      <LessonPlanForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSaved={load}
      />

      {/* Alerta de Confirmação de Deleção */}
      {!!deleting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Excluir plano?</h3>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
              Esta ação não pode ser desfeita. O plano <strong>{deleting?.title}</strong> será removido permanentemente.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setDeleting(null)} className="cancel-button">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="delete-button">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;