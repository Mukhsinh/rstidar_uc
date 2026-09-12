import { supabase } from '@/integrations/supabase/client';

export interface TenantOnboardingData {
  // Tenant information
  tenantName: string;
  tenantSlug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;

  // Admin user credentials
  adminEmail: string;
  adminPassword: string;
  adminFullName: string;

  // Optional settings
  includeJasaPelayanan?: boolean;
  defaultCurrency?: string;
}

export interface OnboardingResult {
  success: boolean;
  tenantId?: string;
  adminUserId?: string;
  error?: string;
  details?: any;
}

/**
 * Membuat tenant baru dengan admin user dan default data
 * Menggunakan RPC function dengan SECURITY DEFINER untuk elevated privileges
 */
export async function createTenant(data: TenantOnboardingData): Promise<OnboardingResult> {
  try {
    // Validasi slug format di client-side
    const slugValidation = validateTenantSlug(data.tenantSlug);
    if (!slugValidation.valid) {
      return {
        success: false,
        error: slugValidation.error
      };
    }

    // Validasi password minimal 8 karakter
    if (!data.adminPassword || data.adminPassword.length < 8) {
      return {
        success: false,
        error: 'Password admin minimal 8 karakter'
      };
    }

    console.log('Calling create_tenant_with_admin with params:', {
      p_tenant_name: data.tenantName,
      p_tenant_slug: data.tenantSlug,
      p_admin_email: data.adminEmail,
      p_admin_full_name: data.adminFullName
    });

    // Panggil RPC function untuk membuat tenant
    let result: any = null;
    let rpcError: any = null;
    try {
      const rpcRes = await supabase.rpc('create_tenant_with_admin', {
        p_tenant_name: data.tenantName,
        p_tenant_slug: data.tenantSlug,
        p_admin_email: data.adminEmail,
        p_admin_password: data.adminPassword,
        p_admin_full_name: data.adminFullName,
        p_logo_url: data.logoUrl || null,
        p_primary_color: data.primaryColor || '#6366f1',
        p_secondary_color: data.secondaryColor || '#8b5cf6',
        p_include_jasa_pelayanan: data.includeJasaPelayanan ?? true,
        p_default_currency: data.defaultCurrency || 'IDR'
      });
      result = rpcRes.data;
      rpcError = rpcRes.error;
    } catch (e) {
      rpcError = e;
    }

    console.log('RPC Response:', { result, error: rpcError, resultType: typeof result });

    if (!rpcError && result) {
      // Parse result jika berupa string JSON
      let parsedResult = result;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          console.error('Failed to parse JSON result:', parseError);
        }
      }

      if (typeof parsedResult === 'object' && parsedResult !== null && !Array.isArray(parsedResult)) {
        if (parsedResult.success === true || parsedResult.success === 'true' || parsedResult.tenant_id || parsedResult.tenantId) {
          return {
            success: true,
            tenantId: parsedResult.tenant_id || parsedResult.tenantId,
            adminUserId: parsedResult.admin_user_id || parsedResult.adminUserId
          };
        }
      }
    }

    // Fallback Mode: jika RPC gagal/tidak terinstall di Supabase, buat Tenant secara langsung
    console.warn('RPC create_tenant_with_admin failed or unavailable, executing direct fallback onboarding...');

    // 0. Cek apakah slug sudah digunakan
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', data.tenantSlug)
      .maybeSingle();

    if (existingTenant) {
      return {
        success: false,
        error: `Slug "${data.tenantSlug}" sudah digunakan oleh tenant lain`
      };
    }

    // 1. Insert tenant ke tabel tenants dengan kolom yang valid di schema
    const tenantPayload = {
      name: data.tenantName,
      slug: data.tenantSlug,
      is_active: true,
      logo_url: data.logoUrl || null
    };

    const { data: newTenant, error: insertTenantError } = await supabase
      .from('tenants')
      .insert(tenantPayload)
      .select()
      .single();

    if (insertTenantError) {
      console.error('Fallback tenant insert error:', insertTenantError);
      return {
        success: false,
        error: insertTenantError.message || 'Gagal membuat tenant di database (Fallback)',
        details: insertTenantError
      };
    }

    // 2. Buat Admin User via Auth SignUp jika password & email tersedia
    let adminUserId: string | null = null;
    if (data.adminEmail && data.adminPassword) {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.adminEmail,
        password: data.adminPassword,
        options: {
          data: {
            full_name: data.adminFullName,
            tenant_id: newTenant.id
          }
        }
      });

      if (signUpError) {
        console.warn('Fallback admin auth sign up warning:', signUpError.message);
      } else if (authData?.user) {
        adminUserId = authData.user.id;
        try {
          await supabase
            .from('user_profiles')
            .upsert({
              id: authData.user.id,
              user_id: authData.user.id,
              email: data.adminEmail,
              full_name: data.adminFullName,
              tenant_id: newTenant.id
            });
        } catch (err) {
          console.warn('Failed to upsert user_profile:', err);
        }
      }
    }

    return {
      success: true,
      tenantId: newTenant.id,
      adminUserId: adminUserId
    };

  } catch (error: any) {
    console.error('Error during tenant onboarding:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan saat membuat tenant',
      details: error
    };
  }
}



/**
 * Validasi tenant slug format
 */
export function validateTenantSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.length < 3) {
    return { valid: false, error: 'Slug minimal 3 karakter' };
  }

  if (slug.length > 50) {
    return { valid: false, error: 'Slug maksimal 50 karakter' };
  }

  // Hanya huruf kecil, angka, dan dash
  const slugRegex = /^[a-z0-9-]+$/;
  if (!slugRegex.test(slug)) {
    return { valid: false, error: 'Slug hanya boleh mengandung huruf kecil, angka, dan dash' };
  }

  // Tidak boleh dimulai atau diakhiri dengan dash
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return { valid: false, error: 'Slug tidak boleh dimulai atau diakhiri dengan dash' };
  }

  return { valid: true };
}

/**
 * Generate slug dari nama tenant
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter special
    .replace(/\s+/g, '-') // Ganti spasi dengan dash
    .replace(/-+/g, '-') // Ganti multiple dash dengan single dash
    .substring(0, 50); // Limit panjang
}
