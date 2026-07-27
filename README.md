# Expense Tracker

A full-stack expense tracking web app to manage your monthly budgets and expenses.

## Features

- Set monthly budgets for each category (Groceries, Rent, Transport, etc.)
- Track expenses against your budget in real-time
- Visual progress bars showing spending vs budget
- Add, edit, and delete expenses
- Add custom categories
- Filter expenses by month and category

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Setup

### Prerequisites

- Node.js (v18+)
- MySQL (installed and running)

### 1. Database Setup

Make sure MySQL is running, then:

```bash
cd backend
npm install
node seed.js
```

This creates the `expense_tracker` database and seeds default categories.

### 2. Start the Backend

```bash
cd backend
npm start
```

The API runs on http://localhost:3001

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens on http://localhost:5173

## Usage

1. Go to **Budgets** page to set your monthly budget for each category
2. Use **Add Expense** to log your daily expenses
3. View your **Dashboard** to see spending vs budget at a glance
4. Check **Expenses** page to view, edit, or delete past expenses
5. Manage **Categories** to add custom expense categories
