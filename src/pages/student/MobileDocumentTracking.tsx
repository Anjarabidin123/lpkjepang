
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface MobileDocumentTrackingProps {
    steps: Array<{
        name: string;
        status: string;
        desc: string;
    }>;
    getStatusBadge: (status: string) => React.ReactNode;
    getStepIcon: (status: string) => React.ReactNode;
}

export function MobileDocumentTracking({ steps, getStatusBadge, getStepIcon }: MobileDocumentTrackingProps) {
    return (
        <div className="space-y-4 pb-10">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                <h1 className="text-lg font-black text-slate-900 font-sans uppercase">Progress Dokumen</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Tracking Keberangkatan</p>
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="relative space-y-6">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 relative z-10">
                                <div className="bg-white border-2 border-slate-50 rounded-full p-0.5 shadow-sm">
                                    {getStepIcon(step.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm truncate">{step.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{step.desc}</p>
                                        </div>
                                        <div className="scale-75 origin-right">
                                            {getStatusBadge(step.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
