import { getAllBranchFillter, getUserNotPagging } from '@/api';
import { IBranch, IUser } from '@/types';
import { useEffect, useState } from 'react';
export interface FetchResult<T> {
  data: T
  loading: boolean
  error: string | null
}
export const useUsers = (): FetchResult<IUser[]> => {
  const [users, setUser] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await getUserNotPagging();
        if (response.success) {
          setUser(response.result);
        } else {
          const errorMessage = typeof response.error === 'string'
            ? response.error
            : (response.error?.message ?? 'Failed to fetch user');
          setError(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    void fetchUser();
  }, []);
  return {
    data: users,
    loading,
    error
  };
};
export const useBranch = (): FetchResult<IBranch[]> => {
  const [branches, setBranch] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBranch = async (): Promise<void> => {
      try {
        const response = await getAllBranchFillter();
        if (response.success) {
          setBranch(response.result);
        } else {
          const errorMessage = typeof response.error === 'string'
            ? response.error
            : (response.error?.message ?? 'Failed to fetch branches');
          setError(errorMessage);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    void fetchBranch();
  }, []);
  return {
    data: branches,
    loading,
    error
  };
};
