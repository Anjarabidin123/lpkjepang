
import { useToast } from '@/hooks/use-toast';

// Stub hook for compatibility - this should be removed when PembayaranForm.tsx is cleaned up
export function usePembayaranSimplified() {
  const { toast } = useToast();

  const getPembayaranById = async (id: string) => {
    console.warn('usePembayaranSimplified is deprecated - use useInternalPayment instead');
    return null;
  };

  return {
    getPembayaranById,
  };
}
