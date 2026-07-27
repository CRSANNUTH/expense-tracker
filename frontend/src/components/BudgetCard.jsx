import ProgressBar from './ProgressBar';

function BudgetCard({ category }) {
  const { category_name, category_icon, budget_amount, spent_amount, remaining } = category;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category_icon}</span>
          <h3 className="font-semibold text-gray-800">{category_name}</h3>
        </div>
        {budget_amount > 0 && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            remaining >= 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {remaining >= 0 ? `₹${remaining.toLocaleString()} left` : `₹${Math.abs(remaining).toLocaleString()} over`}
          </span>
        )}
      </div>
      {budget_amount > 0 ? (
        <ProgressBar spent={spent_amount} budget={budget_amount} />
      ) : (
        <p className="text-sm text-gray-400">No budget set</p>
      )}
    </div>
  );
}

export default BudgetCard;
