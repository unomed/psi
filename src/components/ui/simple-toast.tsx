
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export function showSimpleToast({ message, type = 'info', duration = 3000 }: ToastProps) {
  // Criar elemento de toast simples
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  toast.textContent = message;
  toast.style.transform = 'translateX(100%)';
  
  document.body.appendChild(toast);
  
  // Animar entrada
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Remover após duração
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Adicionar ao window para uso global
declare global {
  interface Window {
    showSimpleToast: typeof showSimpleToast;
  }
}

if (typeof window !== 'undefined') {
  window.showSimpleToast = showSimpleToast;
}
