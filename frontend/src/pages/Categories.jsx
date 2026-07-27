import { useState, useEffect } from 'react';
import api from '../api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await api.post('/categories', { name: newName.trim(), icon: newIcon || '📁' });
      setNewName('');
      setNewIcon('');
      fetchCategories();
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? All expenses and budgets in this category will also be deleted.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Add New Category</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 w-16 text-center text-xl focus:ring-2 focus:ring-indigo-500"
            placeholder="📁"
            maxLength={2}
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500"
            placeholder="Category name"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{cat.name}</p>
                    {cat.is_default ? (
                      <span className="text-xs text-gray-400">Default</span>
                    ) : (
                      <span className="text-xs text-indigo-500">Custom</span>
                    )}
                  </div>
                </div>
                {!cat.is_default && (
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
