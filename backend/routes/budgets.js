const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) return res.status(400).json({ error: 'month and year are required' });

    const [rows] = await pool.query(
      `SELECT b.*, c.name as category_name, c.icon as category_icon
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.month = ? AND b.year = ?
       ORDER BY c.name`,
      [month, year]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { category_id, amount, month, year } = req.body;
    if (!category_id || !amount || !month || !year) {
      return res.status(400).json({ error: 'category_id, amount, month, and year are required' });
    }

    await pool.query(
      `INSERT INTO budgets (category_id, amount, month, year)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE amount = VALUES(amount)`,
      [category_id, amount, month, year]
    );

    const [result] = await pool.query(
      `SELECT b.*, c.name as category_name, c.icon as category_icon
       FROM budgets b
       JOIN categories c ON b.category_id = c.id
       WHERE b.category_id = ? AND b.month = ? AND b.year = ?`,
      [category_id, month, year]
    );
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM budgets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
