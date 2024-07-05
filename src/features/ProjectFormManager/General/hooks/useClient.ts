import { getAllClient } from '@/api';
import { IClient } from '@/types';
import { useEffect, useState } from 'react';
export interface AllClientProjectsReturnType {
  clients: IClient[]
  loading: boolean
  refetchData: () => void
}
export const useClient = (): AllClientProjectsReturnType => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const refetchData = (): void => {
    setRefetch(prev => !prev);
  };

  useEffect(() => {
    const fetchClient = async (): Promise<void> => {
      try {
        const response = await getAllClient();
        if (response.success) {
          setClients(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchClient();
  }, [refetch]);
  return {
    clients,
    loading,
    refetchData
  };
};
