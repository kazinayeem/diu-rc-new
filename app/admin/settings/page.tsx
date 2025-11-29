import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-2">Settings</h1>
        <p className="text-dark-600">Manage application settings</p>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-xl font-semibold text-dark-900">General Settings</h2>
        </CardHeader>
        <CardContent>
          <p className="text-dark-600">Settings configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

