import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const user = useUser();
  const [preferences, setPreferences] = useState({
    mode: 'default', // 'default', 'visual', 'motor', 'neurodiversity'
    highContrast: false,
    reducedMotion: false,
    largeText: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('accessibility_preferences')
        .eq('uid', user.id)
        .single();

      if (data?.accessibility_preferences) {
        setPreferences(data.accessibility_preferences);
      }
    } catch (err) {
      console.error('Error fetching accessibility preferences:', err);
    } finally {
      setLoading(false);
    }
  }

  const updatePreferences = async (newPrefs) => {
    setPreferences(newPrefs);
    if (user) {
      await supabase
        .from('users')
        .update({ accessibility_preferences: newPrefs })
        .eq('uid', user.id);
    }

    // Apply global body classes
    applyStyles(newPrefs);
  };

  const applyStyles = (prefs) => {
    const body = document.body;
    body.classList.toggle('high-contrast', prefs.mode === 'visual' || prefs.highContrast);
    body.classList.toggle('reduced-motion', prefs.mode === 'neurodiversity' || prefs.reducedMotion);
    body.classList.toggle('large-text', prefs.largeText);
    body.setAttribute('data-a11y-mode', prefs.mode);
  };

  useEffect(() => {
    applyStyles(preferences);
  }, [preferences]);

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreferences, loading }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
