const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Every task route requires a logged-in user
router.use(auth);

router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  next();
});

// Only allow known fields. `user` is deliberately NOT allowed from the client.
const pick = (body) => {
  const allowed = ['title', 'description', 'priority', 'dueDate', 'completed'];
  const data = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  return data;
};

// GET /api/tasks?status=active|completed
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.status === 'active') filter.completed = false;
    if (req.query.status === 'completed') filter.completed = true;

    const tasks = await Task.find(filter).sort({ completed: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create({ ...pick(req.body), user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id  (only if the task belongs to the logged-in user)
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
