import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tenant } from '@/types/tenant-management';

interface UseTenantsOptions {
  search?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
}

/**
 * Custom hook untuk fetch dan manage tenants data
 * 
 * Features:
 * - Automatic caching dengan React Query
 * - Search filtering
 * - Status filtering
 * - Refetch capability
 * 
 * @param options - Search dan filter options
 * @returns Query result dengan data, loading state, error, dan refetch function
 */
export function useTenants(options: UseTenantsOptions = {}): UseQueryResult<Tenant[], Error> {
  const { search = '', statusFilter = 'all' } = options;

  return useQuery({
    queryKey: ['tenants', search, statusFilter],
    queryFn: async () => {
      try {
        console.log('Fetching tenants with params:', { search, statusFilter });

        // Gunakan RPC function jika tersedia
        const { data, error } = await supabase.rpc('get_tenants_with_user_count', {
          p_search: search || null,
          p_status_filter: statusFilter
        });

        if (!error && data) {
          console.log('Tenants fetched successfully via RPC:', data?.length || 0, 'tenants');
          return data as Tenant[];
        }

        console.warn('RPC get_tenants_with_user_count failed or unavailable, using direct table fallback:', error?.message);

        // Fallback: Query tabel tenants langsung
        let query = supabase.from('tenants').select('*');

        if (search) {
          query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
        }

        if (statusFilter === 'active') {
          query = query.eq('is_active', true);
        } else if (statusFilter === 'inactive') {
          query = query.eq('is_active', false);
        }

        const { data: directTenants, error: directError } = await query.order('created_at', { ascending: false });

        if (directError) {
          console.error('Direct tenants fetch error:', directError);
          throw new Error(`Gagal memuat tenant: ${directError.message}`);
        }

        // Ambil user profiles untuk menghitung user_count per tenant
        const { data: profiles } = await supabase.from('user_profiles').select('tenant_id');
        const userCountMap = new Map<string, number>();
        if (profiles) {
          profiles.forEach((p: any) => {
            if (p.tenant_id) {
              userCountMap.set(p.tenant_id, (userCountMap.get(p.tenant_id) || 0) + 1);
            }
          });
        }

        const result: Tenant[] = (directTenants || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          status: t.status || (t.is_active ? 'active' : 'inactive'),
          is_active: t.is_active ?? true,
          created_at: t.created_at,
          updated_at: t.updated_at,
          logo_url: t.logo_url,
          primary_color: t.primary_color,
          secondary_color: t.secondary_color,
          metadata: t.metadata || {},
          user_count: userCountMap.get(t.id) || 0
        }));

        console.log('Tenants fetched successfully via fallback:', result.length, 'tenants');
        return result;
      } catch (error) {
        console.error('Exception in useTenants:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds - lebih pendek untuk data yang sering berubah
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry 2 kali jika gagal
    retryDelay: 1000, // Delay 1 detik antara retry
  });
}
