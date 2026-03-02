const express = require('express');
const router = express.Router();
router.post('/todos', (req, res) => {
    let newTodo = req.body.todo;
  console.log("New todo added:", newTodo);
});

module.exports = router;