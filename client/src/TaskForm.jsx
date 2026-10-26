import { useState } from 'react';

const EMPTY = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onAdd({ ...form, dueDate: form.dueDate || null });
      setForm(EMPTY);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card task-form" onSubmit={submit}>
      <input
        type="text"
        placeholder="What needs doing?"
        value={form.title}
        onChange={set('title')}
        maxLength={120}
        required
      />
      <textarea
        placeholder="Details (optional)"
        value={form.description}
        onChange={set('description')}
        maxLength={500}
        rows={2}
      />
      <div className="form-row">
        <select value={form.priority} onChange={set('priority')} aria-label="Priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" value={form.dueDate} onChange={set('dueDate')} aria-label="Due date" />
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
