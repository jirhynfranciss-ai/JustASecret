import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface SettingsData {
  website_title: string;
  website_subtitle: string;
  welcome_message: string;
  final_message: string;
  questionnaire_enabled: string;
  allow_multiple_submissions: string;
}

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    website_title: '',
    website_subtitle: '',
    welcome_message: '',
    final_message: '',
    questionnaire_enabled: 'true',
    allow_multiple_submissions: 'false',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap: Partial<SettingsData> = {};
      (data || []).forEach((item) => {
        settingsMap[item.setting_key as keyof SettingsData] = item.setting_value;
      });

      setSettings((prev) => ({
        ...prev,
        ...settingsMap,
      }));
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('admin_settings')
          .upsert(update, { onConflict: 'setting_key' });

        if (error) throw error;
      }

      setSaveMessage('Settings saved successfully! ✓');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-slate-600">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Customize your questionnaire</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6 max-w-2xl">
        {/* Website Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Website Title
          </label>
          <Input
            value={settings.website_title}
            onChange={(e) =>
              setSettings({ ...settings, website_title: e.target.value })
            }
            placeholder="Can I Get to Know You?"
          />
        </div>

        {/* Website Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Website Subtitle
          </label>
          <Input
            value={settings.website_subtitle}
            onChange={(e) =>
              setSettings({ ...settings, website_subtitle: e.target.value })
            }
            placeholder="A little question for you... 💌"
          />
        </div>

        {/* Welcome Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Welcome Message
          </label>
          <Textarea
            value={settings.welcome_message}
            onChange={(e) =>
              setSettings({ ...settings, welcome_message: e.target.value })
            }
            placeholder="I've been curious about you..."
          />
        </div>

        {/* Final Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Final Message
          </label>
          <Textarea
            value={settings.final_message}
            onChange={(e) =>
              setSettings({ ...settings, final_message: e.target.value })
            }
            placeholder="Thank you for letting me get to know you..."
          />
        </div>

        {/* Questionnaire Enabled */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Questionnaire Status
          </label>
          <select
            value={settings.questionnaire_enabled}
            onChange={(e) =>
              setSettings({ ...settings, questionnaire_enabled: e.target.value })
            }
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-rose-400"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>

        {/* Allow Multiple Submissions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Allow Multiple Submissions
          </label>
          <select
            value={settings.allow_multiple_submissions}
            onChange={(e) =>
              setSettings({
                ...settings,
                allow_multiple_submissions: e.target.value,
              })
            }
            className="w-full rounded-lg border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-rose-400"
          >
            <option value="true">Allow</option>
            <option value="false">Disallow</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            {saveMessage && (
              <p
                className={`text-sm font-medium ${
                  saveMessage.includes('Error')
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            size="lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
