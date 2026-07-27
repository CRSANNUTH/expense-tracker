const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY is_default DESC, name ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const [result] = await pool.query(
      'INSERT INTO categories (name, icon, is_default) VALUES (?, ?, false)',
      [name, icon || '📁']
    );
    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(newCategory[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, icon } = req.body;
    await pool.query('UPDATE categories SET name = ?, icon = ? WHERE id = ? AND is_default = false', [name, icon, req.params.id]);
    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (category.length === 0) return res.status(404).json({ error: 'Category not found' });
    if (category[0].is_default) return res.status(400).json({ error: 'Cannot delete default categories' });

    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
