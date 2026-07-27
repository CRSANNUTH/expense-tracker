import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/add-expense', label: 'Add Expense' },
  { path: '/expenses', label: 'Expenses' },
  { path: '/budgets', label: 'Budgets' },
  { path: '/categories', label: 'Categories' },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              💰 Expense Tracker
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
