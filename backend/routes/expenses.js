const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { month, year, category_id } = req.query;
    let query = `
      SELECT e.*, c.name as category_name, c.icon as category_icon
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (month && year) {
      query += ' AND MONTH(e.expense_date) = ? AND YEAR(e.expense_date) = ?';
      params.push(month, year);
    }
    if (category_id) {
      query += ' AND e.category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY e.expense_date DESC, e.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category_id, amount, description, expense_date } = req.body;
    if (!category_id || !amount || !expense_date) {
      return res.status(400).json({ error: 'category_id, amount, and expense_date are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO expenses (category_id, amount, description, expense_date) VALUES (?, ?, ?, ?)',
      [category_id, amount, description || '', expense_date]
    );

    const [newExpense] = await pool.query(
      `SELECT e.*, c.name as category_name, c.icon as category_icon
       FROM expenses e JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newExpense[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { category_id, amount, description, expense_date } = req.body;
    await pool.query(
      'UPDATE expenses SET category_id = ?, amount = ?, description = ?, expense_date = ? WHERE id = ?',
      [category_id, amount, description, expense_date, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT e.*, c.name as category_name, c.icon as category_icon
       FROM expenses e JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [req.params.id]
    );
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
