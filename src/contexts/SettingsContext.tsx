import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/settings';
import { defaultSiteSettings } from '../types/settings';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  hasUnsavedChanges: boolean;
  markDirty: () => void;
  markClean: () => void;
  requestNavigation: (pathOrAction: string | (() => void)) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSiteSettings,
  loading: true,
  refreshSettings: async () => {},
  hasUnsavedChanges: false,
  markDirty: () => {},
  markClean: () => {},
  requestNavigation: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const markDirty = useCallback(() => setHasUnsavedChanges(true), []);
  const markClean = useCallback(() => setHasUnsavedChanges(false), []);

  const requestNavigation = useCallback((pathOrAction: string | (() => void)) => {
    if (typeof pathOrAction === 'string' && location.pathname === pathOrAction) return;
    
    const action = typeof pathOrAction === 'string' ? () => navigate(pathOrAction) : pathOrAction;
    
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
    } else {
      action();
    }
  }, [hasUnsavedChanges, location.pathname, navigate]);

  const confirmNavigation = () => {
    if (pendingAction) {
      setHasUnsavedChanges(false);
      pendingAction();
      setPendingAction(null);
    }
  };

  const cancelNavigation = () => {
    setPendingAction(null);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching site settings:', error);
        }
        setSettings(defaultSiteSettings);
        return;
      }

      if (data) {
        setSettings({
          brand_settings: { ...defaultSiteSettings.brand_settings, ...data.brand_settings },
          hero_settings: { ...defaultSiteSettings.hero_settings, ...data.hero_settings },
          about_settings: { ...defaultSiteSettings.about_settings, ...data.about_settings },
          stats_settings: data.stats_settings && data.stats_settings.length > 0 ? data.stats_settings : defaultSiteSettings.stats_settings,
          contact_settings: { ...defaultSiteSettings.contact_settings, ...data.contact_settings },
          social_settings: data.social_settings && data.social_settings.length > 0 ? data.social_settings : defaultSiteSettings.social_settings,
          footer_settings: { ...defaultSiteSettings.footer_settings, ...data.footer_settings },
        });
      } else {
        setSettings(defaultSiteSettings);
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
      setSettings(defaultSiteSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Browser beforeunload protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, hasUnsavedChanges, markDirty, markClean, requestNavigation }}>
      {children}
      
      {/* Unsaved Changes Modal */}
      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={cancelNavigation} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif text-white">Unsaved Changes</h3>
                <p className="text-sm text-gray-400">
                  You have unsaved changes. Leave this page without saving?
                </p>
              </div>
              
              <div className="p-6 border-t border-white/5 bg-[#050505] flex gap-3">
                <button onClick={cancelNavigation} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors border border-white/10">
                  Stay
                </button>
                <button onClick={confirmNavigation} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-[#ceab7a] text-black hover:bg-[#b08d5c] transition-colors flex justify-center">
                  Leave Without Saving
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
