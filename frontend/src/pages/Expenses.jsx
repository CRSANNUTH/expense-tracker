import { useState, useEffect } from 'react';
import api from '../api';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filterCategory, setFilterCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [month, year, filterCategory]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      let url = `/expenses?month=${month}&year=${year}`;
      if (filterCategory) url += `&category_id=${filterCategory}`;
      const res = await api.get(url);
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      category_id: expense.category_id,
      amount: expense.amount,
      description: expense.description,
      expense_date: expense.expense_date.split('T')[0]
    });
  };

  const handleUpdate = async (id) => {
    await api.put(`/expenses/${id}`, { ...editForm, amount: parseFloat(editForm.amount) });
    setEditingId(null);
    fetchExpenses();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <p className="text-lg font-semibold text-gray-600">
          Total: <span className="text-orange-600">₹{totalSpent.toLocaleString()}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
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
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">No expenses found for {monthNames[month - 1]} {year}.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  {editingId === expense.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input type="date" value={editForm.expense_date}
                          onChange={(e) => setEditForm({ ...editForm, expense_date: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full" />
                      </td>
                      <td className="px-4 py-3">
                        <select value={editForm.category_id}
                          onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full">
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input type="text" value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-full" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input type="number" value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="border rounded px-2 py-1 text-sm w-20 text-right" />
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handleUpdate(expense.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium">Save</button>
                        <button onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(expense.expense_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <span>{expense.category_icon}</span>
                          <span className="text-gray-700">{expense.category_name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{expense.description || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        ₹{parseFloat(expense.amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button onClick={() => handleEdit(expense)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Expenses;
