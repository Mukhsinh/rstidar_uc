import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BrandingSettings {
  id?: string;
  app_title: string;
  logo_url?: string;
  logo_alt_text: string;
}

const useBrandingSettings = () => {
  const [settings, setSettings] = useState<BrandingSettings>({
    app_title: 'PINTAR UC',
    logo_alt_text: 'Logo'
  });
  const [loading, setLoading] = useState(true);

  // Get user from AuthContext - single source of truth
  const { user } = useAuth();

  useEffect(() => {
    fetchBrandingSettings();
  }, [user]);

  const fetchBrandingSettings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('Warning fetching branding settings:', error.message);
      }

      if (data) {
        setSettings({
          id: data.id,
          app_title: data.app_name || 'PINTAR UC',
          logo_url: data.logo_url || undefined,
          logo_alt_text: 'Logo'
        });
      } else {
        setSettings({
          app_title: 'PINTAR UC',
          logo_alt_text: 'Logo'
        });
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
      setSettings({
        app_title: 'PINTAR UC',
        logo_alt_text: 'Logo'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    refetch: () => fetchBrandingSettings()
  };
};

export { useBrandingSettings };
