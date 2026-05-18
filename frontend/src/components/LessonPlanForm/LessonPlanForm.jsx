import React, { useEffect, useState } from "react";
import { Sparkles, Loader2, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import api from "../../../api";
import "./LessonPlanForm.css";

const emptyForm = {
  título: "",
  objetivo: "",
  resumo: "",
  data_prevista: "",
  disciplina: "",
  conteúdos: "",
  recursos: "",
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
              título: initial.título,
              objetivo: initial.objetivo,
              resumo: initial.resumo,
              data_prevista: initial.data?.slice(0, 10) ?? "",
              disciplina: initial.disciplina,
              conteúdos: initial.conteúdos,
              recursos: initial.recursos,
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
    if (!form.título.trim()) e.title = "Informe o título";
    if (!form.disciplina.trim()) e.discipline = "Informe a disciplina";
    if (!form.objetivo.trim()) e.objective = "Informe o objetivo";
    if (!form.resumo.trim()) e.summary = "Informe a ementa";
    if (!form.data_prevista) e.scheduled_date = "Informe a data";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSmartAssist() {
    if (!form.título || !form.disciplina || !form.resumo) {
      toast.error("Preencha Título, Disciplina e Ementa antes de gerar.");
      return;
    }
    setAiLoading(true);
    try {
      const r = await api.postGemini({
        title: form.título,
        type: form.disciplina,
        description: form.resumo,
      });
      setForm((f) => ({
        ...f,
        conteúdos: r.contents ?? f.conteúdos,
        recursos: r.resources ?? f.recursos,
        tags: r.tags?.length ? Array.from(new Set([...f.tags, ...r.tags])) : f.tags,
      }));
      toast.success("Recomendações aplicadas.");
    } catch (err) {
      toast.error("A IA não conseguiu responder. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (initial?.id != null) await api.putAula({...form, id: initial.id});
      else await api.postAula(form);
      toast.success(initial ? "Plano atualizado." : "Plano criado.");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

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
                value={form.título}
                onChange={(e) => update("título", e.target.value)}
                placeholder="Ex.: Introdução ao OSPF"
                className="field-input"
              />
            </Field>
            
            <Field label="Disciplina" error={errors.discipline}>
              <input
                value={form.disciplina}
                onChange={(e) => update("disciplina", e.target.value)}
                placeholder="Ex.: Redes de Computadores"
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Objetivo" error={errors.objective}>
            <textarea
              rows={2}
              value={form.objetivo}
              onChange={(e) => update("objetivo", e.target.value)}
              placeholder="O que o aluno deve alcançar?"
              className="field-textarea"
            />
          </Field>

          <Field label="Ementa / Resumo" error={errors.summary}>
            <textarea
              rows={3}
              value={form.resumo}
              onChange={(e) => update("resumo", e.target.value)}
              placeholder="Resumo do conteúdo da aula"
              className="field-textarea"
            />
          </Field>

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
                value={form.data_prevista}
                onChange={(e) => update("data_prevista", e.target.value)}
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
              value={form["conteúdos"]}
              onChange={(e) => update("conteúdos", e.target.value)}
              placeholder="Tópicos principais que serão abordados"
              className="field-textarea"
            />
          </Field>

          <Field label="Recursos de apoio">
            <textarea
              rows={3}
              value={form.recursos}
              onChange={(e) => update("recursos", e.target.value)}
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