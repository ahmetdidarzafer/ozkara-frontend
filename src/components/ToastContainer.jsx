import { useState, useEffect } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Global toast event listener
  useEffect(() => {
    const showToast = (event) => {
      const { message, type, duration, actions } = event.detail;
      const id = Date.now();
      
      setToasts(prev => [...prev, { id, message, type, duration, actions }]);
    };

    window.addEventListener('show-toast', showToast);
    return () => window.removeEventListener('show-toast', showToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          actions={toast.actions}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 