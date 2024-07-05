import { GetCurrentLoginInformations } from '@/api';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';
interface AllProjectsReturnType {
  user: IUser | null
  loading: boolean
}
export const useCurrentLogin = (): AllProjectsReturnType => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async (): Promise<void> => {
      try {
        const response = await GetCurrentLoginInformations();
        const userData = response?.result?.user;
        if (userData !== null) {
          setUser(userData);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchUser();
  }, []);
  return {
    user,
    loading
  };
};
