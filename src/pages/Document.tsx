import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Variable, Users, LayoutTemplate } from 'lucide-react';
import { DocumentTemplateList, DocumentVariableManager, StudentDocumentTracker } from '@/components/Document';

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState('tracking');

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/25">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Manajemen Dokumen
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola template dokumen dan tracking kelengkapan dokumen siswa magang
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border shadow-sm p-1 h-auto">
          <TabsTrigger
            value="tracking"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white px-6 py-3 gap-2"
          >
            <Users className="h-4 w-4" />
            Tracking Siswa
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white px-6 py-3 gap-2"
          >
            <LayoutTemplate className="h-4 w-4" />
            Template Dokumen
          </TabsTrigger>
          <TabsTrigger
            value="variables"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white px-6 py-3 gap-2"
          >
            <Variable className="h-4 w-4" />
            Variabel Mail Merge
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="mt-6">
          <StudentDocumentTracker />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <DocumentTemplateList />
        </TabsContent>

        <TabsContent value="variables" className="mt-6">
          <DocumentVariableManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
