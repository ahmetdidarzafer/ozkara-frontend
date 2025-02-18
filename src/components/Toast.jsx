import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose, actions }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-none shadow-lg font-montserrat text-sm min-w-[320px] transform transition-all duration-300";
  
  const typeClasses = {
    success: "bg-green-50 border-l-4 border-green-600 text-green-800",
    error: "bg-red-50 border-l-4 border-red-600 text-red-800",
    warning: "bg-yellow-50 border-l-4 border-yellow-600 text-yellow-800",
    info: "bg-luxury-50 border-l-4 border-luxury-900 text-luxury-800"
  };

  return isVisible ? (
    <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">{message}</div>
        {!actions && (
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="text-luxury-600 hover:text-luxury-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {actions && (
        <div className="flex justify-end space-x-2 mt-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsVisible(false);
                onClose?.();
              }}
              className={`px-4 py-2 text-sm font-montserrat transition-colors ${
                index === 0
                  ? 'bg-luxury-900 text-white hover:bg-luxury-800'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null;
};

export default Toast; 