import { useEffect, useMemo, useState } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMe,
  getToken,
  setToken,
  setUnauthorizedHandler,
} from './api';
import AuthForm from './AuthForm.jsx';
import TaskForm from './TaskForm.jsx';
import TaskItem from './TaskItem.jsx';

const FILTERS = ['all', 'active', 'completed'];

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(Boolean(getToken()));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = () => {
    setToken(null);
    setUser(null);
    setTasks([]);
    setError('');
  };

  // Any 401 from the API (expired token) sends the user back to login
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, []);

  // On first load, restore the session if a token is saved
  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setCheckingSession(false));
  }, []);

  // Load this user's tasks once logged in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Wrap actions so any failure shows up in the banner
  const run = async (action) => {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = (task) =>
    run(async () => {
      const created = await createTask(task);
      setTasks((prev) => [created, ...prev]);
    });

  const handleToggle = (task) =>
    run(async () => {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });

  const handleSave = (id, changes) =>
    run(async () => {
      const updated = await updateTask(id, changes);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    });

  const handleDelete = (id) =>
    run(async () => {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

  const visible = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  if (checkingSession) return <p className="empty">Loading…</p>;
  if (!user) return <AuthForm onAuth={setUser} />;

  return (
    <main className="app">
      <header className="top">
        <div>
          <h1>Task Manager</h1>
          <p className="subtitle">
            {tasks.length === 0
              ? 'Nothing here yet'
              : `${remaining} of ${tasks.length} task${tasks.length === 1 ? '' : 's'} remaining`}
          </p>
        </div>
        <div className="account">
          <span className="email">{user.email}</span>
          <button className="btn" onClick={logout}>Log out</button>
        </div>
      </header>

      <TaskForm onAdd={handleAdd} />

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <nav className="filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </nav>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="empty">No {filter === 'all' ? '' : filter + ' '}tasks.</p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
