
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { JournalContent } from '@/components/Journal/JournalContent';
import { AuthGuard } from '@/components/AuthGuard';

export default function Journal() {
  return (
    <AuthGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Journal Entries</h1>
            <p className="text-gray-600">Manage double-entry bookkeeping journal entries</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Journal Management</CardTitle>
          </CardHeader>
          <CardContent>
            <JournalContent />
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
