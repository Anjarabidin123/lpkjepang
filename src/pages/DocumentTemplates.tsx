import React, { useState } from "react";
import { DocumentTemplateList } from "@/components/Document/DocumentTemplateList";
import { DocumentTemplateForm } from "@/components/Document/DocumentTemplateForm";
import { useDocumentTemplates } from "@/hooks/useDocuments";
import { DocumentTemplate } from "@/types/document";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DocumentTemplates() {
    const { createTemplate, updateTemplate, creating, updating } = useDocumentTemplates();
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (template: DocumentTemplate) => {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Template Dokumen
                </h1>
                <p className="text-muted-foreground">
                    Kelola template dokumen untuk surat kontrak, visa, paspor, dan lainnya.
                </p>
            </div>

            <DocumentTemplateList onPreview={handlePreview} />

            {/* Preview Dialog (Using Form in Read-only / Preview Mode if applicable, or explicit preview component) */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Preview Template: {selectedTemplate?.nama}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 border rounded-md p-6 bg-white shadow-inner min-h-[400px] prose max-w-none">
                        {/* Simple HTML Preview */}
                        <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.template_content || '<p class="text-gray-400 italic">Konten kosong</p>' }} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
