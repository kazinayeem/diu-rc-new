import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ShieldCheck, ChevronRight, Image as ImageIcon, Mail } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-slate-400">Manage application settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/admin/settings/admins">
          <Card variant="elevated" className="bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/8 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">Manage Admins</p>
                <p className="text-slate-400 text-sm">Create managers, assign roles and permissions</p>
              </div>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings/homepage">
          <Card variant="elevated" className="bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/8 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={22} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">Homepage Content</p>
                <p className="text-slate-400 text-sm">Control home slider and achievements carousel</p>
              </div>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings/smtp">
          <Card variant="elevated" className="bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/8 transition-all cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">SMTP Configuration</p>
                <p className="text-slate-400 text-sm">Configure email settings for notifications</p>
              </div>
              <ChevronRight size={18} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}


