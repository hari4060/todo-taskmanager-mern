import { useState } from 'react';

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function TaskItem({ task, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  const startEdit = () => {
    setDraft({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: toInputDate(task.dueDate),
    });
    setEditing(true);
  };

  const save = async () => {
    if (!draft.title.trim()) return;
    await onSave(task._id, { ...draft, dueDate: draft.dueDate || null });
    setEditing(false);
  };

  const overdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().toDateString());

  if (editing) {
    return (
      <li className="card task editing">
        <input
          type="text"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          maxLength={120}
        />
        <textarea
          rows={2}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          maxLength={500}
        />
        <div className="form-row">
          <select
            value={draft.priority}
            onChange={(e) => setDraft({ ...draft, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={draft.dueDate}
            onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
          />
          <button className="btn primary" onClick={save}>Save</button>
          <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`card task ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <span className={`badge ${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={overdue ? 'due overdue' : 'due'}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button className="btn" onClick={startEdit}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </li>
  );
}
