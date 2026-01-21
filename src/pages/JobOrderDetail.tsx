
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye } from "lucide-react";
import { useJobOrder } from '@/hooks/useJobOrder';
import { JobOrderDetailTab } from '@/components/JobOrderDetailTab';
import { JobOrderDataPesertaTab } from '@/components/JobOrderDataPesertaTab';

export default function JobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobOrders, isLoading } = useJobOrder();
  
  const jobOrder = jobOrders?.find(jo => jo.id === id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!jobOrder) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-semibold text-gray-500">Job Order tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-6 space-y-6 animate-in fade-in duration-700">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-x-1"
        >
            <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Kembali</span>
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">Live System Active</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-2xl blur opacity-5 group-hover:opacity-10 transition duration-700" />
          <div className="relative bg-white p-6 lg:p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-primary to-indigo-700 rounded-xl shadow-xl shadow-primary/20 ring-2 ring-primary/5 transition-transform duration-500 group-hover:scale-105">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs font-medium px-2 py-0.5 rounded-full">Management Console</Badge>
                  <span className="text-slate-300">/</span>
                  <span className="text-xs font-medium text-slate-400">ID: {id?.slice(0, 8)}</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-none">{jobOrder.nama_job_order}</h1>
                <p className="text-slate-500 font-medium mt-2 text-sm max-w-2xl">Kelola informasi detail dan pemantauan peserta seleksi secara real-time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="detail" className="w-full space-y-6">
          <div className="flex justify-start">
            <TabsList className="h-12 p-1 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg shadow-slate-200/40 border border-slate-100/50">
              <TabsTrigger 
                value="detail" 
                className="h-full rounded-lg px-6 font-medium text-sm transition-all duration-300 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Overview Detail
              </TabsTrigger>
              <TabsTrigger 
                value="peserta"
                className="h-full rounded-lg px-6 font-medium text-sm transition-all duration-300 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                Database Peserta
              </TabsTrigger>
            </TabsList>
          </div>
        
        <TabsContent value="detail" className="mt-0 focus-visible:outline-none">
          <JobOrderDetailTab jobOrder={jobOrder} />
        </TabsContent>
        
        <TabsContent value="peserta" className="mt-0 focus-visible:outline-none">
          <JobOrderDataPesertaTab jobOrder={jobOrder} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
