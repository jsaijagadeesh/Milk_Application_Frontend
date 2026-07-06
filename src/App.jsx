import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext';
import { useToast }      from './hooks/useToast';
import AppRouter         from './routes/AppRouter';

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'} {t.message}
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  const toast = useToast();
  return (
    <>
      <AppRouter toastContainer={<ToastContainer toasts={toast.toasts} />} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
