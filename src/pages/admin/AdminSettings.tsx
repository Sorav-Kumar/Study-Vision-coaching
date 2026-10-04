import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, CardBody, LoadingSpinner } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Save, Settings } from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
    setSettings(data ?? { coaching_name: 'Study Vision Coaching Centre', tagline: 'Learn Better • Build Strong Concepts • Achieve More', about_content: '', phone: '9354024459', address: '', instagram: '', google_maps: '', footer_text: '' });
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    if (settings.id) {
      const { error } = await supabase.from('site_settings').update({ ...settings, updated_at: new Date().toISOString() }).eq('id', settings.id);
      if (error) { show(error.message, 'error'); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('site_settings').insert(settings);
      if (error) { show(error.message, 'error'); setSaving(false); return; }
    }
    show('Settings saved', 'success');
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage website content and contact details" action={<Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}</Button>} />
      <Card>
        <CardBody className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Settings className="h-5 w-5" /> General</h3>
          <Input label="Coaching Name" value={settings.coaching_name ?? ''} onChange={(e) => setSettings({ ...settings, coaching_name: e.target.value })} />
          <Input label="Tagline" value={settings.tagline ?? ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          <Textarea label="About Content" value={settings.about_content ?? ''} onChange={(e) => setSettings({ ...settings, about_content: e.target.value })} rows={4} />
        </CardBody>
      </Card>
      <Card>
        <CardBody className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Contact Details</h3>
          <Input label="Phone" value={settings.phone ?? ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
          <Textarea label="Address" value={settings.address ?? ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} />
          <Input label="Instagram" value={settings.instagram ?? ''} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} placeholder="@handle" />
          <Input label="Google Maps URL" value={settings.google_maps ?? ''} onChange={(e) => setSettings({ ...settings, google_maps: e.target.value })} />
          <Input label="Footer Text" value={settings.footer_text ?? ''} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} />
        </CardBody>
      </Card>
      <div className="flex justify-end"><Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Settings'}</Button></div>
    </div>
  );
}
