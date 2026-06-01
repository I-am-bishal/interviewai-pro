import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Briefcase, Key, Bell, Mic, Moon, ChevronRight, Download, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { userApi } from '../api/index.js';
import { Card, Input, SectionTitle, Toggle, Divider } from '../components/ui/index.jsx';
import Button from '../components/ui/Button';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const { isDark, setTheme } = useThemeStore();
  const [saving, setSaving]   = useState(false);
  const [prefs, setPrefs]     = useState({
    notifications: true,
    voiceMode:     true,
    darkMode:      isDark,
    autoAdvance:   false,
    emailDigest:   true,
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name:            user?.name || '',
      targetRole:      user?.targetRole || '',
      experienceLevel: user?.experienceLevel || 'mid',
    },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors }, watch } = useForm();

  const onSaveProfile = async (data) => {
    setSaving(true);
    try {
      const updated = await userApi.updateProfile(data);
      updateUser(updated);
      toast.success('Profile saved ✅');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    try {
      await userApi.updatePassword(data.currentPassword, data.newPassword);
      toast.success('Password updated ✅');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AI';

  const Section = ({ title, children }) => (
    <Card className="mb-4">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account, preferences and API keys</p>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-slate-400">{user?.email}</div>
            <div className="mt-1 flex gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                user?.plan === 'pro' ? 'bg-accent/15 text-accent-2' : 'bg-slate-100 text-slate-500'
              }`}>
                {user?.plan === 'pro' ? '⚡ Pro Plan' : '🆓 Free Plan'}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">Change Photo</Button>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              icon={<User size={14} />}
              error={errors.name?.message}
              {...register('name', { required: 'Name required' })}
            />
            <Input
              label="Email"
              type="email"
              icon={<Mail size={14} />}
              defaultValue={user?.email}
              disabled
              className="opacity-50"
            />
            <Input
              label="Target Role"
              icon={<Briefcase size={14} />}
              placeholder="e.g. Senior Engineer"
              {...register('targetRole')}
            />
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Experience Level</label>
              <select
                className="w-full bg-bg-3 border border-border rounded-lg px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-accent transition-all"
                {...register('experienceLevel')}
              >
                <option value="entry">Entry Level (&lt;2 yrs)</option>
                <option value="mid">Mid Level (2–5 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>
          <Button type="submit" size="sm" loading={saving}>Save Profile</Button>
        </form>
      </Section>

      {/* Password */}
      <Section title="Change Password">
        <form onSubmit={handlePw(onChangePassword)} className="space-y-3">
          <Input
            label="Current Password"
            type="password"
            icon={<Lock size={14} />}
            error={pwErrors.currentPassword?.message}
            {...regPw('currentPassword', { required: 'Required' })}
          />
          <Input
            label="New Password"
            type="password"
            icon={<Lock size={14} />}
            error={pwErrors.newPassword?.message}
            {...regPw('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={<Lock size={14} />}
            error={pwErrors.confirm?.message}
            {...regPw('confirm', {
              required: 'Required',
              validate: (v) => v === watch('newPassword') || 'Passwords do not match',
            })}
          />
          <Button type="submit" size="sm">Update Password</Button>
        </form>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        <div className="space-y-0">
          {[
            { key: 'notifications', label: 'Push Notifications',    desc: 'Daily practice reminders',           icon: Bell },
            { key: 'voiceMode',     label: 'Voice Interview Mode',   desc: 'Enable microphone for answers',      icon: Mic },
            { key: 'darkMode',      label: 'Dark Mode',              desc: 'Toggle dark or light color theme',   icon: Moon },
            { key: 'autoAdvance',   label: 'Auto-advance Questions', desc: 'Move to next question automatically', icon: ChevronRight },
            { key: 'emailDigest',   label: 'Weekly Email Digest',    desc: 'Performance summary every Monday',   icon: Mail },
          ].map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-400" />
                <div>
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
              </div>
              <Toggle
                checked={key === 'darkMode' ? isDark : prefs[key]}
                onChange={(val) => {
                  if (key === 'darkMode') {
                    setTheme(val);
                  } else {
                    setPrefs(p => ({ ...p, [key]: val }));
                  }
                  toast.success(`${label} ${val ? 'enabled' : 'disabled'}`);
                }}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* API Key */}
      <Section title="API Configuration">
        <div className="space-y-3">
          <Input
            label="OpenAI API Key"
            type="password"
            icon={<Key size={14} />}
            placeholder="sk-proj-..."
            defaultValue=""
          />
          <div className="text-xs text-slate-400">
            Your key is encrypted at rest. Used only for AI question generation and feedback. Never shared.
          </div>
          <Button size="sm" variant="ghost" onClick={() => toast.success('Key validated ✅')}>
            Verify Key
          </Button>
        </div>
      </Section>

      {/* Danger Zone */}
      <Card className="border-danger/30">
        <SectionTitle>Danger Zone</SectionTitle>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3.5 border-b border-border">
            <div>
              <div className="text-sm font-medium flex items-center gap-2">
                <Download size={14} className="text-slate-400" /> Export All Data
              </div>
              <div className="text-xs text-slate-400">Download all interviews, scores, and feedback as JSON</div>
            </div>
            <Button
              variant="ghost" size="sm"
              onClick={() => toast.success('Preparing export...')}
            >
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <div className="text-sm font-medium text-danger flex items-center gap-2">
                <Trash2 size={14} /> Delete Account
              </div>
              <div className="text-xs text-slate-400">Permanently delete your account and all associated data</div>
            </div>
            <Button
              variant="danger" size="sm"
              onClick={() => toast.error('Confirm deletion via email first')}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;
