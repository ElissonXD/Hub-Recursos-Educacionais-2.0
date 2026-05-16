import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Importando o arquivo de estilos separado
import "./LessonPlanForm.css";

// Mantenha as referências para os seus utilitários de API locais

const emptyForm = {
  title: "",
  objective: "",
  summary: "",
  scheduled_date: "",
  discipline: "",
  contents: "",
  resources: "",
  tags: [],
};

export function LessonPlanForm({ open, onOpenChange, initial, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              title: initial.title,
              objective: initial.objective,
              summary: initial.summary,
              scheduled_date: initial.scheduled_date?.slice(0, 10) ?? "",
              discipline: initial.discipline,
              contents: initial.contents,
              resources: initial.resources,
              tags: initial.tags ?? [],
            }
          : emptyForm
      );
      setErrors({});
      setTagInput("");
    }
  }, [open, initial]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTag(raw) {
    const t = raw.trim();
    if (!t) return;
    if (form.tags.includes(t)) return;
    update("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(t) {
    update("tags", form.tags.filter((x) => x !== t));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Informe o título";
    if (!form.discipline.trim()) e.discipline = "Informe a disciplina";
    if (!form.objective.trim()) e.objective = "Informe o objetivo";
    if (!form.summary.trim()) e.summary = "Informe a ementa";
    if (!form.scheduled_date) e.scheduled_date = "Informe a data";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSmartAssist() {
    if (!form.title || !form.discipline || !form.summary) {
      toast.error("Preencha Título, Disciplina e Ementa antes de gerar.");
      return;
    }
    setAiLoading(true);
    try {
      const r = await api.smartAssist({
        title: form.title,
        discipline: form.discipline,
        summary: form.summary,
      });
      setForm((f) => ({
        ...f,
        contents: r.contents ?? f.contents,
        resources: r.resources ?? f.resources,
        tags: r.tags?.length ? Array.from(new Set([...f.tags, ...r.tags])) : f.tags,
      }));
      toast.success("Recomendações aplicadas.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "A IA não conseguiu responder. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (initial?.id != null) await api.update(initial.id, form);
      else await api.create(form);
      toast.success(initial ? "Plano atualizado." : "Plano criado.");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  // Se o modal estiver fechado, não renderiza nada em tela
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initial ? "Editar plano de aula" : "Novo plano de aula"}
          </h2>
          <p className="modal-description">
            Preencha os campos. Use o Smart Assist para gerar conteúdos com IA.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-space">
          <div className="form-grid-2">
            <Field label="Título da aula" error={errors.title}>
              <input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Ex.: Introdução ao OSPF"
                className="field-input"
              />
            </Field>
            
            <Field label="Disciplina" error={errors.discipline}>
              <input
                value={form.discipline}
                onChange={(e) => update("discipline", e.target.value)}
                placeholder="Ex.: Redes de Computadores"
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Objetivo" error={errors.objective}>
            <textarea
              rows={2}
              value={form.objective}
              onChange={(e) => update("objective", e.target.value)}
              placeholder="O que o aluno deve alcançar?"
              className="field-textarea"
            />
          </Field>

          <Field label="Ementa / Resumo" error={errors.summary}>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Resumo do conteúdo da aula"
              className="field-textarea"
            />
          </Field>

          {/* Seção Inteligente da IA */}
          <div className="ai-banner">
            <div className="ai-banner-content">
              <div>
                <p className="ai-title">Smart Assist</p>
                <p className="ai-description">
                  Gera conteúdos, recursos e 3 tags com base em Título, Disciplina e Ementa.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSmartAssist}
                disabled={aiLoading}
                className="btn-ai"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Pensando…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Gerar Recomendações com IA
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="form-grid-2">
            <Field label="Data prevista" error={errors.scheduled_date}>
              <input
                type="date"
                value={form.scheduled_date}
                onChange={(e) => update("scheduled_date", e.target.value)}
                className="field-input"
              />
            </Field>

            <Field label="Tags">
              <div className="tags-list-wrapper">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder="Digite e pressione Enter"
                  className="field-input"
                />
                {form.tags.length > 0 && (
                  <div className="tags-flex-box">
                    {form.tags.map((t) => (
                      <span key={t} className="form-tag-badge">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="tag-remove-btn"
                          aria-label={`Remover ${t}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </div>

          <Field label="Conteúdos">
            <textarea
              rows={4}
              value={form.contents}
              onChange={(e) => update("contents", e.target.value)}
              placeholder="Tópicos principais que serão abordados"
              className="field-textarea"
            />
          </Field>

          <Field label="Recursos de apoio">
            <textarea
              rows={3}
              value={form.resources}
              onChange={(e) => update("resources", e.target.value)}
              placeholder="Links, livros, vídeos, slides…"
              className="field-textarea"
            />
          </Field>

          <div className="modal-footer">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="btn-outline"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="btn-submit"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {initial ? "Salvar alterações" : "Criar plano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente utilitário interno convertido para JavaScript funcional limpo
function Field({ label, error, children }) {
  return (
    <div className="field-container">
      <label className="field-label">
        {label}
      </label>
      {children}
      {error && <p className="field-error-msg">{error}</p>}
    </div>
  );
}