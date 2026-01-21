
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JobOrder } from '@/types/jobOrder';
import { JobOrderPeserta } from '@/types/jobOrder';
import { supabase } from '@/integrations/supabase/client';

export class JobOrderComprehensivePdfService {
  static async generateComprehensivePdf(
    jobOrder: JobOrder, 
    participants: JobOrderPeserta[]
  ): Promise<void> {
    try {
      console.log('Starting comprehensive PDF generation for job order:', jobOrder.nama_job_order);
      
      // Initialize PDF with compression settings
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // First page: Candidate List with improved layout matching reference image
      await this.addCandidateListPage(pdf, jobOrder, participants);

      // Individual biodata pages for each participant
      for (const [index, participant] of participants.entries()) {
        console.log(`Generating biodata for participant ${index + 1}:`, participant.siswa?.nama);
        
        // Fetch complete student data with all related information
        const { data: completeStudentData, error } = await supabase
          .from('siswa')
          .select(`
            *,
            siswa_pendidikan(*),
            siswa_pengalaman_kerja(*),
            siswa_kontak_keluarga(*),
            siswa_keluarga_indonesia(*),
            siswa_keluarga_jepang(*)
          `)
          .eq('id', participant.siswa_id)
          .single();

        if (error) {
          console.error('Error fetching complete student data:', error);
          continue;
        }

        // Add new page for each biodata
        pdf.addPage();
        await this.addBiodataPage(pdf, completeStudentData, jobOrder, index + 1, participants.length);
      }
      
      const fileName = `Comprehensive_Report_${jobOrder.nama_job_order.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      console.log('Comprehensive PDF generated successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating comprehensive PDF:', error);
      throw new Error('Gagal membuat PDF lengkap. Silakan coba lagi.');
    }
  }

  private static async addCandidateListPage(
    pdf: jsPDF,
    jobOrder: JobOrder,
    participants: JobOrderPeserta[]
  ): Promise<void> {
    // Create temporary div for candidate list with optimized dimensions
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '20px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '11px';
    
    // Create the candidate list HTML content matching reference image layout
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-decoration: underline;">
          Daftar Kandidat - 候補者リスト
        </h1>
        <div style="margin-top: 15px; text-align: left; font-size: 11px; line-height: 1.5;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="width: 50%; padding: 4px; font-weight: bold;">Job Order:</td>
              <td style="width: 50%; padding: 4px;">${jobOrder.nama_job_order}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold;">Status:</td>
              <td style="padding: 4px;">${jobOrder.status || 'Aktif'}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold;">Kuota:</td>
              <td style="padding: 4px;">${jobOrder.kuota || 0}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold;">Total Peserta:</td>
              <td style="padding: 4px;">${participants.length}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold;">Kumiai:</td>
              <td style="padding: 4px;">${jobOrder.kumiai?.nama || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 4px; font-weight: bold;">Jenis Kerja:</td>
              <td style="padding: 4px;">${jobOrder.jenis_kerja?.nama || '-'}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; border: 2px solid #000;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 6%; font-weight: bold;">
              No.
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 22%; font-weight: bold;">
              Nama Siswa<br/>氏名
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 15%; font-weight: bold;">
              Tanggal Lahir<br/>生年月日
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 15%; font-weight: bold;">
              Tempat Lahir<br/>出生地
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 8%; font-weight: bold;">
              Umur<br/>年齢
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 12%; font-weight: bold;">
              Photo<br/>写真
            </th>
            <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 22%; font-weight: bold;">
              Keterangan<br/>備考
            </th>
          </tr>
        </thead>
        <tbody>
          ${participants.map((participant, index) => {
            const birthDate = participant.siswa?.tanggal_lahir;
            const age = birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : null;
            
            return `
            <tr style="min-height: 50px;">
              <td style="border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; font-weight: bold;">
                ${index + 1}
              </td>
              <td style="border: 1px solid #000; padding: 8px; vertical-align: middle; word-wrap: break-word;">
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 11px;">${participant.siswa?.nama || '-'}</div>
                <div style="font-size: 9px; color: #666;">NIK: ${participant.siswa?.nik || '-'}</div>
              </td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; font-size: 10px;">
                ${birthDate ? new Date(birthDate).toLocaleDateString('id-ID') : '-'}
              </td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; font-size: 10px; word-wrap: break-word;">
                ${participant.siswa?.tempat_lahir || '-'}
              </td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; font-size: 10px; font-weight: bold;">
                ${age ? age + ' tahun' : '-'}
              </td>
              <td style="border: 1px solid #000; padding: 8px; text-align: center; vertical-align: middle; background-color: #f8f8f8;">
                <div style="font-size: 8px; color: #888; font-style: italic;">No Photo</div>
              </td>
              <td style="border: 1px solid #000; padding: 8px; vertical-align: middle; word-wrap: break-word;">
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 10px;">Status: ${participant.status || 'Pending'}</div>
                ${participant.keterangan ? `<div style="font-size: 9px; color: #666; line-height: 1.3;">${participant.keterangan}</div>` : ''}
              </td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
      
      <div style="margin-top: 30px; text-align: right; font-size: 9px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
        Halaman 1 dari ${participants.length + 1} | 
        Job Order: ${jobOrder.nama_job_order} | 
        Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    // Generate canvas with optimized settings for file size
    const canvas = await html2canvas(tempDiv, {
      scale: 1.5, // Slightly increased for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123, // A4 height in pixels at 96 DPI
      logging: false, // Disable logging for performance
      imageTimeout: 0,
      removeContainer: true
    });
    
    document.body.removeChild(tempDiv);
    
    // Add image to PDF with compression
    const imgData = canvas.toDataURL('image/jpeg', 0.9); // Higher quality for candidate list
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Ensure the image fits within one page
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // Scale down to fit in one page
      const scaledHeight = pageHeight - 10; // Leave some margin
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'JPEG', (imgWidth - scaledWidth) / 2, 5, scaledWidth, scaledHeight);
    }
  }

  private static async addBiodataPage(
    pdf: jsPDF,
    siswa: any,
    jobOrder: JobOrder,
    pageNumber: number,
    totalPages: number
  ): Promise<void> {
    const pengalamanKerja = siswa?.siswa_pengalaman_kerja || [];
    const kontakKeluarga = siswa?.siswa_kontak_keluarga || [];
    const keluargaIndonesia = siswa?.siswa_keluarga_indonesia || [];
    const keluargaJepang = siswa?.siswa_keluarga_jepang || [];
    const pendidikan = siswa?.siswa_pendidikan || [];

    // Create temporary div for biodata with optimized dimensions
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.minHeight = '1123px';
    tempDiv.style.maxHeight = '1400px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '15px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '10px';
    tempDiv.style.lineHeight = '1.3';
    tempDiv.style.overflow = 'hidden';
    
    // Create compact biodata HTML content with proper table formatting
    tempDiv.innerHTML = `
      <div style="margin-bottom: 12px; text-align: center;">
        <h2 style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold;">
          履歴書<br/>BIODATA - CV
        </h2>
        <div style="text-align: right; font-size: 24px; font-weight: bold; margin-bottom: 8px; position: absolute; top: 10px; right: 20px;">${pageNumber}</div>
      </div>

      <!-- Main Information Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 2px solid #000; table-layout: fixed;">
        <tr>
          <td style="width: 70%; vertical-align: top; padding: 0; border-right: 2px solid #000;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 25%; padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Nama:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px; word-wrap: break-word;">${siswa?.nama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">氏名:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px; word-wrap: break-word;">${siswa?.nama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Tanggal Lahir:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.tanggal_lahir ? new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">生年月日:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.tanggal_lahir ? new Date(siswa.tanggal_lahir).toLocaleDateString('ja-JP') : '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Jenis Kelamin:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.jenis_kelamin || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">性別:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.jenis_kelamin === 'Laki-laki' ? '男性' : siswa?.jenis_kelamin === 'Perempuan' ? '女性' : '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Status Pernikahan:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.status_pernikahan || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">配偶者:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.status_pernikahan === 'Belum Menikah' ? '未婚' : '既婚'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Alamat Rumah:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; word-wrap: break-word; line-height: 1.2;">${siswa?.alamat || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">自宅住所:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; word-wrap: break-word; line-height: 1.2;">${siswa?.alamat || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Tempat Lahir:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.tempat_lahir || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">出生地:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.tempat_lahir || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">Agama:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.agama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">宗教:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.agama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">No. Telp:</td>
                <td style="padding: 4px 6px; border-bottom: 1px solid #000; font-size: 10px;">${siswa?.telepon || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 6px; font-size: 9px; font-weight: bold; background-color: #f8f8f8;">電話番号:</td>
                <td style="padding: 4px 6px; font-size: 10px;">${siswa?.telepon || '-'}</td>
              </tr>
            </table>
          </td>
          <td style="width: 30%; vertical-align: top; text-align: center; padding: 8px;">
            <div style="border: 2px solid #000; width: 100px; height: 130px; margin: 0 auto 6px auto; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9;">
              ${siswa?.foto_url ? 
                `<img src="${siswa.foto_url}" style="max-width: 96px; max-height: 126px; object-fit: cover;" alt="Foto" />` : 
                '<span style="font-size: 10px; color: #666; text-align: center; line-height: 1.3;">Pas Foto<br/>3x4</span>'
              }
            </div>
            <div style="font-size: 8px; margin-bottom: 8px; color: #666;">写真 (Photo)</div>
            <div style="font-size: 9px; text-align: left; line-height: 1.3;">
              <div style="margin-bottom: 4px;">
                <strong>Umur:</strong> ${siswa?.tanggal_lahir ? new Date().getFullYear() - new Date(siswa.tanggal_lahir).getFullYear() : '-'} Tahun
              </div>
              <div>
                <strong>年齢:</strong> ${siswa?.tanggal_lahir ? new Date().getFullYear() - new Date(siswa.tanggal_lahir).getFullYear() : '-'} 歳
              </div>
            </div>
          </td>
        </tr>
      </table>

      ${this.generateCompactSections(siswa, pengalamanKerja, kontakKeluarga, keluargaIndonesia, keluargaJepang, pendidikan)}

      <div style="margin-top: 15px; text-align: right; font-size: 7px; color: #666; border-top: 1px solid #ccc; padding-top: 8px;">
        Halaman ${pageNumber + 1} dari ${totalPages + 1} | 
        Job Order: ${jobOrder.nama_job_order} | 
        Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    // Generate canvas with compression settings
    const canvas = await html2canvas(tempDiv, {
      scale: 1.3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: 1200,
      logging: false,
      imageTimeout: 0,
      removeContainer: true
    });
    
    document.body.removeChild(tempDiv);
    
    // Add image to PDF with compression
    const imgData = canvas.toDataURL('image/jpeg', 0.85);
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      const scaledHeight = pageHeight - 8;
      const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
      pdf.addImage(imgData, 'JPEG', (imgWidth - scaledWidth) / 2, 4, scaledWidth, scaledHeight);
    }
  }

  private static generateCompactSections(siswa: any, pengalamanKerja: any[], kontakKeluarga: any[], keluargaIndonesia: any[], keluargaJepang: any[], pendidikan: any[]): string {
    return `
      <!-- Physical Information Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; border: 2px solid #000;">
        <tr>
          <td style="width: 25%; padding: 4px; border-right: 1px solid #000; font-size: 8px; font-weight: bold; background-color: #f8f8f8;">Tinggi Badan:</td>
          <td style="width: 25%; padding: 4px; border-right: 1px solid #000; font-size: 9px; text-align: center;">${siswa?.tinggi_badan ? siswa.tinggi_badan + ' cm' : '-'}</td>
          <td style="width: 25%; padding: 4px; border-right: 1px solid #000; font-size: 8px; font-weight: bold; background-color: #f8f8f8;">Berat Badan:</td>
          <td style="width: 25%; padding: 4px; font-size: 9px; text-align: center;">${siswa?.berat_badan ? siswa.berat_badan + ' kg' : '-'}</td>
        </tr>
        <tr>
          <td style="padding: 4px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 8px; font-weight: bold; background-color: #f8f8f8;">身長:</td>
          <td style="padding: 4px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 9px; text-align: center;">${siswa?.tinggi_badan ? siswa.tinggi_badan + ' cm' : '-'}</td>
          <td style="padding: 4px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 8px; font-weight: bold; background-color: #f8f8f8;">体重:</td>
          <td style="padding: 4px; border-top: 1px solid #000; font-size: 9px; text-align: center;">${siswa?.berat_badan ? siswa.berat_badan + ' kg' : '-'}</td>
        </tr>
      </table>
    `;
  }
}
