import { getEdit } from '@/api';
import { IProjectCredential } from '@/types';
import { useEffect, useState } from 'react';
export interface AllProjectsReturnType {
  formEditData: IProjectCredential | null
  loading: boolean
}
export const useEdit = (input: string): AllProjectsReturnType => {
  const [formEditData, setEditFormData] = useState<IProjectCredential | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchEdit = async (): Promise<void> => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 600000));
        const response = await getEdit(input);
        if (response.success) {
          setEditFormData(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchEdit();
  }, [input]);

  return {
    formEditData,
    loading
  };
};
