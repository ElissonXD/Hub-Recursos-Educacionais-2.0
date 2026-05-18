import React from "react";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import "./LessonPlanCard.css"

export function LessonPlanCard({ plan, onEdit, onDelete, onView }) {
  const date = plan.data
    ? new Date(plan.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <article className="card-container" onClick={() => onView?.(plan)} style={{ cursor: "pointer" }}>
      <div className="card-header">
        <div className="card-title-area">
          <p className="card-discipline">
            {plan.disciplina}
          </p>
          <h3 className="card-title">
            {plan.título}
          </h3>
        </div>
        
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onEdit(plan)} 
            aria-label="Editar"
            className="card-btn"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(plan)}
            aria-label="Excluir"
            className="card-btn card-btn-delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="card-summary">{plan.resumo}</p>

      <div className="card-footer">
        <div className="card-date-box">
          <CalendarDays size={14} />
          {date}
        </div>
        
        {plan.tags?.length > 0 && (
          <div className="card-tags-box">
            {plan.tags.slice(0, 4).map((t) => (
              <span key={t} className="card-badge">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}