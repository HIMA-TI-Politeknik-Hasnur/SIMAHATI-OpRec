import { useState, useEffect } from 'react';
import { apiFetch, getAuthToken, isSessionAuth, sessionFetch } from '../../api';

interface StatsData {
  total_pendaftar: number;
  pending_verifikasi: number;
  lolos_administrasi: number;
  ditolak_administrasi: number;
  dalam_interview: number;
  lolos_seleksi: number;
  ditolak_seleksi: number;
  total_divisi: number;
  total_admin: number;
  total_interview: number;
  total_pengumuman: number;
}

interface StatsResponse {
  success: boolean;
  data: StatsData;
}

interface UseStatsReturn {
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    if (isSessionAuth()) {
      const res = await sessionFetch<StatsResponse>('/api/dashboard/stats');
      if (res.data) setStats(res.data.data);
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

    const res = await apiFetch<StatsResponse>('/api/dashboard/stats');
    if (res.data) setStats(res.data.data);
    if (res.error) setError(res.error.message);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, error, refetch: fetchStats };
}
