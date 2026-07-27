import { useState, useEffect } from 'react';
import api from '../api';
import BudgetCard from '../components/BudgetCard';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboard();
  }, [month, year]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard?month=${month}&year=${year}`);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx + 1}>{name}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Budget</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{data.total_budget.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Spent</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">₹{data.total_spent.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">Remaining</p>
              <p className={`text-xl sm:text-2xl font-bold ${data.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{data.remaining.toLocaleString()}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.categories
              .filter(cat => cat.budget_amount > 0 || cat.spent_amount > 0)
              .map(category => (
                <BudgetCard key={category.category_id} category={category} />
              ))}
          </div>

          {data.categories.filter(cat => cat.budget_amount > 0 || cat.spent_amount > 0).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg">No budgets or expenses yet for {monthNames[month - 1]} {year}.</p>
              <p className="text-gray-400 mt-2">Start by setting up your monthly budgets!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
