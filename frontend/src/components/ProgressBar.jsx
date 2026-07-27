function ProgressBar({ spent, budget }) {
  if (budget === 0) return null;

  const percentage = Math.min((spent / budget) * 100, 100);
  const overBudget = spent > budget;

  let barColor = 'bg-green-500';
  if (percentage >= 90) barColor = 'bg-red-500';
  else if (percentage >= 70) barColor = 'bg-yellow-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>₹{spent.toLocaleString()} spent</span>
        <span>₹{budget.toLocaleString()} budget</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {overBudget && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          Over budget by ₹{(spent - budget).toLocaleString()}!
        </p>
      )}
    </div>
  );
}

export default ProgressBar;
