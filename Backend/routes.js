const express = require('express');
const db = require('./db');
const router = express.Router();

// Listar todas as tarefas (GET)
router.get('/', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
});

// Criar uma nova tarefa (POST)
router.post('/', (req, res) => {
  const { title } = req.body;
  db.run(`INSERT INTO tasks (title) VALUES (?)`, [title], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Atualizar uma tarefa (PUT)
router.put('/:id', (req, res) => {
  const { title, completed } = req.body;
  const { id } = req.params;
  db.run(
    `UPDATE tasks SET title = ?, completed = ? WHERE id = ?`,
    [title, completed, id],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ updatedID: id });
    }
  );
});

// Deletar uma tarefa (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM tasks WHERE id = ?`, id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

module.exports = router;
