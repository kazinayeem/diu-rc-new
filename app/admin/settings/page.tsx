import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div className="text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-slate-400">Manage application settings</p>
      </div>

      <Card variant="elevated" className="bg-white/5 border border-white/10">
        <CardHeader>
          <h2 className="text-xl font-semibold">General Settings</h2>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

