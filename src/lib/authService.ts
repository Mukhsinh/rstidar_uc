import type {
  AuthChangeEvent,
  AuthError,
  Session,
  SignInWithPasswordCredentials,
  User,
} from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthStateListener = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_active: boolean;
}

export const authService = {
  /**
   * Get session with recovery mechanism
   * Tries to recover from localStorage if initial getSession fails
   */
  async getSession() {
    try {
      const result = await supabase.auth.getSession();

      // If session error occurs (e.g. invalid refresh token / 400), clean up stale storage
      if (result.error) {
        console.warn('Session retrieval failed or token expired:', result.error.message);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase-auth-token');
          sessionStorage.removeItem('tenant_id');
          sessionStorage.removeItem('tenant_name');
        }
        return { data: { session: null }, error: null };
      }

      return result;
    } catch (error) {
      console.error('Unexpected error in getSession:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase-auth-token');
      }
      return {
        data: { session: null },
        error: error as AuthError
      };
    }
  },

  async getUser(): Promise<{ data: { user: User | null }; error: AuthError | null }> {
    return supabase.auth.getUser();
  },

  /**
   * Get session - DO NOT trigger refresh to avoid 429
   */
  async refreshSession() {
    console.log('⚠️ refreshSession called - using getSession to avoid 429');
    return await this.getSession();
  },

  /**
   * Get tenant information for the current user
   * Extracts tenant_id from user metadata and fetches tenant details
   */
  async getTenantInfo(userId: string): Promise<{ data: TenantInfo | null; error: Error | null }> {
    try {
      // Get user profile which contains tenant_id
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('user_id', userId)
        .maybeSingle();

      let tenantId = profile?.tenant_id;

      if (!tenantId) {
        // Fallback: fetch active default tenant
        const { data: defaultTenant } = await supabase
          .from('tenants')
          .select('id')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();
        tenantId = defaultTenant?.id;
      }

      if (!tenantId) {
        return { data: null, error: new Error('Tenant not found') };
      }

      // Get tenant details
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .select('id, name, slug, logo_url, is_active')
        .eq('id', tenantId)
        .single();

      if (tenantError || !tenant) {
        return { data: null, error: new Error('Tenant not found') };
      }

      // Verify tenant is active
      if (!tenant.is_active) {
        return { data: null, error: new Error('Tenant is not active') };
      }

      return { data: tenant as TenantInfo, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  /**
   * Sign in with password and validate tenant
   * Enhanced to include tenant detection and validation
   */
  async signInWithPassword(credentials: SignInWithPasswordCredentials) {
    try {
      // Perform authentication
      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error || !data.user) {
        return { data, error };
      }

      // Store session immediately for recovery purposes
      if (data.session && typeof window !== 'undefined') {
        try {
          localStorage.setItem('supabase-auth-token', JSON.stringify(data.session));
          console.log('✅ Session stored for recovery');
        } catch (storageError) {
          console.warn('Failed to store session for recovery:', storageError);
        }
      }

      // Get and validate tenant info
      const { data: tenantInfo, error: tenantError } = await this.getTenantInfo(data.user.id);

      if (tenantError || !tenantInfo) {
        // Sign out if tenant validation fails
        await supabase.auth.signOut();
        return {
          data: null,
          error: new Error('Tenant validation failed: ' + (tenantError?.message || 'Unknown error')),
        };
      }

      // Set tenant context in session storage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tenant_id', tenantInfo.id);
        sessionStorage.setItem('tenant_name', tenantInfo.name);
      }

      return { data: { ...data, tenant: tenantInfo }, error: null };
    } catch (error) {
      console.error('Unexpected error in signInWithPassword:', error);
      return {
        data: null,
        error: error as AuthError,
      };
    }
  },

  /**
   * Sign out and clear tenant context
   */
  async signOut() {
    try {
      // Clear tenant context from session storage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('tenant_id');
        sessionStorage.removeItem('tenant_name');
        // Also clear recovery session
        localStorage.removeItem('supabase-auth-token');
      }

      return await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Get tenant context from session storage
   */
  getTenantContext(): { tenantId: string | null; tenantName: string | null } {
    if (typeof window === 'undefined') {
      return { tenantId: null, tenantName: null };
    }

    return {
      tenantId: sessionStorage.getItem('tenant_id'),
      tenantName: sessionStorage.getItem('tenant_name'),
    };
  },

  onAuthStateChange(callback: AuthStateListener) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

