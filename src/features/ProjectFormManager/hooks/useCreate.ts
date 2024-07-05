import { useState, useCallback } from 'react';
import { Save } from '@/api';
import { IAppResponse, IProjectCredential } from '@/types';

interface UseCreateProjectResult {
  createProject: (formData: IProjectCredential) => Promise<IAppResponse<IProjectCredential>>
  isLoading: boolean
  error: Error | null
}
export const useCreateProject = (): UseCreateProjectResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const createProject = useCallback(async (formData: IProjectCredential): Promise<IAppResponse<IProjectCredential>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Save(formData);
      return response;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return { createProject, isLoading, error };
};
