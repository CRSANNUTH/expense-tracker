import { useState, useEffect } from 'react';
import api from '../api';

function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [budgetInputs, setBudgetInputs] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(() => {
        setTimeout(() => {
          api.get('/categories').then(res => setCategories(res.data));
        }, 2000);
      });
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/budgets?month=${month}&year=${year}`);
      setBudgets(res.data);
      const inputs = {};
      res.data.forEach(b => { inputs[b.category_id] = b.amount; });
      setBudgetInputs(inputs);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (categoryId) => {
    const amount = parseFloat(budgetInputs[categoryId]);
    if (!amount || amount <= 0) return;

    setSaving(categoryId);
    try {
      await api.post('/budgets', {
        category_id: categoryId,
        amount,
        month,
        year
      });
      fetchBudgets();
    } catch (error) {
      console.error('Failed to save budget:', error);
    } finally {
      setSaving(null);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalBudget = Object.values(budgetInputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monthly Budgets</h1>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            {monthNames.map((name, idx) => (
              <option key={idx} value={idx + 1}>{name}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 mb-6">
        <p className="text-indigo-800 font-medium">
          Total Budget for {monthNames[month - 1]} {year}: <span className="text-xl">₹{totalBudget.toLocaleString()}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium text-gray-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={budgetInputs[cat.id] || ''}
                    onChange={(e) => setBudgetInputs({ ...budgetInputs, [cat.id]: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="₹ Budget amount"
                  />
                  <button
                    onClick={() => handleSave(cat.id)}
                    disabled={saving === cat.id}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {saving === cat.id ? '...' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Budget Amount (₹)</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-medium text-gray-800">{cat.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={budgetInputs[cat.id] || ''}
                        onChange={(e) => setBudgetInputs({ ...budgetInputs, [cat.id]: e.target.value })}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleSave(cat.id)}
                        disabled={saving === cat.id}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {saving === cat.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;
