import { useState, useEffect } from 'react';
import { apiFetch, getAuthToken, isSessionAuth, sessionFetch, UserData } from '../../api';

interface UserResponse {
  success: boolean;
  data: UserData;
}

interface UseCurrentUserReturn {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    if (isSessionAuth()) {
      const res = await sessionFetch<UserResponse>('/api/session/user');
      if (res.data) setUser(res.data.data);
      if (res.error) setError(res.error.message);
      setLoading(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('not-authenticated');
      setLoading(false);
      return;
    }

    const res = await apiFetch<UserResponse>('/api/user');
    if (res.data) setUser(res.data.data);
    if (res.error) setError(res.error.message);
    setLoading(false);
  };

  useEffect(() => { fetchUser(); }, []);

  return { user, loading, error, refetch: fetchUser };
}
