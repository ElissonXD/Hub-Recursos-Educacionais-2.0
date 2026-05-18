
import React from "react";
import { X, CalendarDays } from "lucide-react";
import "../LessonPlanForm/LessonPlanForm.css";

export function LessonPlanFull({ open, plan, onClose }) {
  if (!open || !plan) return null;

  const date = plan.data
    ? new Date(plan.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="form-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{plan.título}</h2>
          <p className="modal-description">{plan.disciplina}</p>
        </div>

        <div className="form-space">
          <div>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
              Objetivo
            </p>
            <p style={{ fontSize: "14px", color: "#111827", margin: "0", whiteSpace: "pre-wrap" }}>
              {plan.objetivo}
            </p>
          </div>

          <div>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
              Ementa / Resumo
            </p>
            <p style={{ fontSize: "14px", color: "#111827", margin: "0", whiteSpace: "pre-wrap" }}>
              {plan.resumo}
            </p>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
                Data prevista
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#111827" }}>
                <CalendarDays size={14} />
                {date}
              </div>
            </div>

            {plan.tags?.length > 0 && (
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
                  Tags
                </p>
                <div className="tags-flex-box">
                  {plan.tags.map((t) => (
                    <span key={t} className="form-tag-badge" style={{ cursor: "default" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {plan.conteúdos && (
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
                Conteúdos
              </p>
              <p style={{ fontSize: "14px", color: "#111827", margin: "0", whiteSpace: "pre-wrap" }}>
                {plan.conteúdos}
              </p>
            </div>
          )}

          {plan.recursos && (
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px 0" }}>
                Recursos de apoio
              </p>
              <p style={{ fontSize: "14px", color: "#111827", margin: "0", whiteSpace: "pre-wrap" }}>
                {plan.recursos}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-outline">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}