const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month || now.getMonth() + 1;
    const y = year || now.getFullYear();

    const [summary] = await pool.query(
      `SELECT
        c.id as category_id,
        c.name as category_name,
        c.icon as category_icon,
        COALESCE(b.amount, 0) as budget_amount,
        COALESCE(SUM(e.amount), 0) as spent_amount
      FROM categories c
      LEFT JOIN budgets b ON c.id = b.category_id AND b.month = ? AND b.year = ?
      LEFT JOIN expenses e ON c.id = e.category_id AND MONTH(e.expense_date) = ? AND YEAR(e.expense_date) = ?
      GROUP BY c.id, c.name, c.icon, b.amount
      ORDER BY c.name`,
      [m, y, m, y]
    );

    const totalBudget = summary.reduce((sum, row) => sum + parseFloat(row.budget_amount), 0);
    const totalSpent = summary.reduce((sum, row) => sum + parseFloat(row.spent_amount), 0);

    res.json({
      month: parseInt(m),
      year: parseInt(y),
      total_budget: totalBudget,
      total_spent: totalSpent,
      remaining: totalBudget - totalSpent,
      categories: summary.map(row => ({
        ...row,
        budget_amount: parseFloat(row.budget_amount),
        spent_amount: parseFloat(row.spent_amount),
        remaining: parseFloat(row.budget_amount) - parseFloat(row.spent_amount)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
