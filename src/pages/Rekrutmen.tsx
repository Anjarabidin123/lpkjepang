import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Clock, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecruitmentStats, useRecruitmentApplications, useDeleteApplication, RecruitmentApplication } from '@/hooks/useRecruitment';
import { AuthGuard } from '@/components/AuthGuard';
import { RecruitmentForm } from '@/components/RecruitmentForm';

export default function Rekrutmen() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<RecruitmentApplication | null>(null);

  const { data: stats, isLoading: isLoadingStats } = useRecruitmentStats();
  const { data: applications, isLoading: isLoadingApps } = useRecruitmentApplications({
    status: statusFilter !== 'all' ? statusFilter : undefined
  });
  const deleteApp = useDeleteApplication();

  const handleEdit = (app: RecruitmentApplication) => {
    setSelectedApp(app);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApp.mutateAsync(id);
      } catch (error) {
        alert('Failed to delete application');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedApp(null);
  };

  if (isLoadingStats || isLoadingApps) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">Rekrutmen</h1>
              <p className="text-gray-600">Kelola proses rekrutmen siswa dan kandidat</p>
            </div>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.newApplications || 0}</p>
                  <p className="text-sm text-muted-foreground">Aplikasi Baru</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.inReview || 0}</p>
                  <p className="text-sm text-muted-foreground">Dalam Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <UserCheck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.accepted || 0}</p>
                  <p className="text-sm text-muted-foreground">Diterima</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.successRate || 0}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Applications</CardTitle>
            <div className="flex gap-2">
              {['all', 'new', 'review', 'interview', 'accepted', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{app.siswa?.nama || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500 font-medium">
                          NIK: {app.siswa?.nik || '-'}
                        </p>
                        <p className="text-xs text-gray-400">
                          Application #{app.application_number}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              app.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {app.status}
                          </span>
                          {app.program && (
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                              {app.program.nama}
                            </span>
                          )}
                          {app.score && (
                            <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                              Score: {app.score}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {new Date(app.application_date).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(app)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(app.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No applications found.
              </p>
            )}
          </CardContent>
        </Card>

        <RecruitmentForm
          open={isFormOpen}
          onClose={handleCloseForm}
          application={selectedApp}
        />
      </div>
    </AuthGuard>
  );
}
