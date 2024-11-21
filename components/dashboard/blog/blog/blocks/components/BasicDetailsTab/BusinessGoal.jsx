// components/admin/dashboard/blog/blocks/components/BasicDetailsTab/BusinessGoal.jsx
export const BusinessGoal = ({ businessGoal, onChange }) => {
  const maxLength = 30;
  const currentLength = (businessGoal || '').length;
  const isAtLimit = currentLength >= maxLength;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onChange('business_goal', value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label
          htmlFor="business-goal"
          className="block text-sm font-medium text-gray-700"
        >
          Business Goal
        </label>
        <span 
          className={`text-xs ${
            isAtLimit ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {currentLength}/{maxLength}
        </span>
      </div>
      <input
        id="business-goal"
        type="text"
        value={businessGoal || ''}
        onChange={handleChange}
        maxLength={maxLength}
        className={`mt-1 block w-full rounded-md border ${
          isAtLimit ? 'border-red-300' : 'border-gray-300'
        } py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
        placeholder="Enter your business goal"
      />
      {isAtLimit && (
        <p className="text-xs text-red-500 mt-1">
          Maximum character limit reached
        </p>
      )}
    </div>
  );
};