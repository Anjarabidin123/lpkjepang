
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit } from "lucide-react";
import { jobOrderService } from '@/services/jobOrderService';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { JobOrderDetailTab } from './JobOrderDetailTab';
import { JobOrderDataPesertaTab } from './JobOrderDataPesertaTab';
import { JobOrderComprehensivePrintButton } from './JobOrderComprehensivePrintButton';

export function JobOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log('JobOrderDetailPage - Loading job order with ID:', id);

  const { data: jobOrder, isLoading, error } = useQuery({
    queryKey: ['job_order', id],
    queryFn: async () => {
      if (!id) throw new Error('Job Order ID is required');
      console.log('JobOrderDetailPage - Fetching job order data for ID:', id);
      
      try {
        const jobOrders = await jobOrderService.fetchJobOrders();
        console.log('JobOrderDetailPage - Fetched job orders:', jobOrders?.length || 0);
        
        const foundJobOrder = jobOrders.find(jo => jo.id === id);
        console.log('JobOrderDetailPage - Found job order:', foundJobOrder ? 'Yes' : 'No');
        
        if (!foundJobOrder) {
          throw new Error('Job Order not found');
        }
        return foundJobOrder;
      } catch (err) {
        console.error('JobOrderDetailPage - Error fetching job order:', err);
        throw err;
      }
    },
    enabled: !!id,
  });

  if (isLoading) {
    console.log('JobOrderDetailPage - Loading state');
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !jobOrder) {
    console.error('JobOrderDetailPage - Error state:', error);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/job-order')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {error instanceof Error ? error.message : 'Job Order tidak ditemukan'}
              </p>
              <Button onClick={() => navigate('/job-order')}>
                Kembali ke Daftar Job Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('JobOrderDetailPage - Rendering job order:', jobOrder.nama_job_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/job-order')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Detail Job Order</h1>
        </div>
        <div className="flex items-center gap-2">
          <JobOrderComprehensivePrintButton jobOrder={jobOrder} />
          <Button
            onClick={() => {
              console.log('JobOrderDetailPage - Edit button clicked, navigating back to job order list');
              navigate('/job-order');
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div>
        <p className="text-gray-600 mb-4">Data peserta untuk job order yang dipilih</p>
        
        <Tabs defaultValue="detail" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detail">Detail Job Order</TabsTrigger>
            <TabsTrigger value="peserta">Data Peserta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="detail" className="mt-6">
            <JobOrderDetailTab jobOrder={jobOrder} />
          </TabsContent>
          
          <TabsContent value="peserta" className="mt-6">
            <JobOrderDataPesertaTab jobOrder={jobOrder} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
