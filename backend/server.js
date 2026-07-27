const express = require('express');
const cors = require('cors');
const categoriesRouter = require('./routes/categories');
const budgetsRouter = require('./routes/budgets');
const expensesRouter = require('./routes/expenses');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
  res.json({ status: 'Expense Tracker API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Expense Tracker API running on port ${PORT}`);
});
