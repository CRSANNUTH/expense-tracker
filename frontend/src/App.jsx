import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
