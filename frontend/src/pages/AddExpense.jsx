import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AddExpense() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: '',
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id || !form.amount || !form.expense_date) return;

    setSubmitting(true);
    try {
      await api.post('/expenses', {
        ...form,
        amount: parseFloat(form.amount)
      });
      setSuccess(true);
      setForm({ category_id: '', amount: '', description: '', expense_date: new Date().toISOString().split('T')[0] });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Expense</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          Expense added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What was this expense for?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={form.expense_date}
            onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
