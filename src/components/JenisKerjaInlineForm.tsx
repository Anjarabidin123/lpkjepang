
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJenisKerja } from "@/hooks/useJenisKerja";
import { useJenisKerjaForm, JenisKerjaFormData } from "@/hooks/useJenisKerjaForm";
import { JenisKerjaFormFields } from "@/components/JenisKerja/JenisKerjaFormFields";
import { JenisKerjaFormActions } from "@/components/JenisKerja/JenisKerjaFormActions";
import type { Tables } from "@/integrations/supabase/types";

interface JenisKerjaInlineFormProps {
  jenisKerja?: Tables<'jenis_kerja'>;
  onCancel: () => void;
  onSuccess: () => void;
}

export function JenisKerjaInlineForm({ jenisKerja, onCancel, onSuccess }: JenisKerjaInlineFormProps) {
  const { createJenisKerja, updateJenisKerja, isCreating, isUpdating } = useJenisKerja();
  const { form, formatDataForSubmission } = useJenisKerjaForm(jenisKerja);

  const onSubmit = (data: JenisKerjaFormData) => {
    const formData = formatDataForSubmission(data);

    if (jenisKerja) {
      updateJenisKerja({ id: jenisKerja.id, data: formData });
    } else {
      createJenisKerja(formData);
    }
    onSuccess();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {jenisKerja ? "Edit Jenis Kerja" : "Tambah Jenis Kerja"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <JenisKerjaFormFields form={form} />
          <JenisKerjaFormActions 
            jenisKerja={jenisKerja}
            isLoading={isLoading}
            onCancel={onCancel}
          />
        </form>
      </CardContent>
    </Card>
  );
}
