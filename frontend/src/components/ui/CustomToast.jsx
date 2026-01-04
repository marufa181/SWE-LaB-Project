const CustomToast = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const textColor = 'text-white';

  return (
    <div
      className={`${bgColor} ${textColor} px-6 py-4 rounded-lg shadow-lg max-w-md mx-auto flex items-center justify-between animate-fade-in`}
    >
      <span className="font-medium">{message}</span>

      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close Toast"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default CustomToast;
