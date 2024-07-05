import { useState, useCallback } from 'react';
import { signIn } from '@/api';
import { IAppResponse, IToken, IUserCredential } from '@/types';

interface UseSignInResult {
  signIn: (data: IUserCredential) => Promise<IAppResponse<IToken>>
  isLoading: boolean
  error: Error | null
}
export const useSignIn = (): UseSignInResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSignIn = useCallback(async (data: IUserCredential): Promise<IAppResponse<IToken>> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn(data);
      return response;
    } catch (err) {
      console.log(err);
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signIn: handleSignIn, isLoading, error };
};
