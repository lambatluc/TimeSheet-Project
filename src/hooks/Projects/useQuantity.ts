import { useEffect, useState } from 'react';
import { getQuantityProject } from '@/api';
import { IQuantityProject } from '@/types';

interface QuantityProjectReturnType {
  quantities: IQuantityProject[]
  loadingQuantity: boolean
  refetchDataQuantity: () => void
}
export const useQuantity = (): QuantityProjectReturnType => {
  const [quantities, setQuantities] = useState<IQuantityProject[]>([]);
  const [loadingQuantity, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const refetchDataQuantity = (): void => {
    setRefetch(prev => !prev);
  };
  useEffect(() => {
    const fetchQuantities = async (): Promise<void> => {
      try {
        const response = await getQuantityProject();
        if (response.success) {
          setQuantities(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchQuantities();
  }, [refetch]);
  return { quantities, loadingQuantity, refetchDataQuantity };
};
