
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JobOrder } from '@/types/jobOrder';
import { JobOrderPeserta } from '@/types/jobOrder';

export class JobOrderPdfService {
  static async generateParticipantListPdf(
    jobOrder: JobOrder, 
    participants: JobOrderPeserta[]
  ): Promise<void> {
    try {
      console.log('Starting PDF generation for job order:', jobOrder.nama_job_order);
      
      // Create a temporary div for PDF content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Create the content HTML
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 18px; font-weight: bold; margin: 0; text-decoration: underline;">
            Daftar Kandidat - 候補者リスト
          </h1>
          <div style="margin-top: 20px; text-align: left;">
            <strong>Job Order:</strong> ${jobOrder.nama_job_order}<br>
            <strong>Status:</strong> ${jobOrder.status || 'Aktif'}<br>
            <strong>Kuota:</strong> ${jobOrder.kuota || 0}<br>
            <strong>Total Peserta:</strong> ${participants.length}
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 5%;">No.</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 20%;">Nama Siswa<br>氏名</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 15%;">Tanggal Lahir<br>生年月日</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 15%;">Tempat Lahir<br>出生地</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 10%;">Umur<br>年齢</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 15%;">Photo<br>写真</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center; width: 20%;">Keterangan<br>備考</th>
            </tr>
          </thead>
          <tbody>
            ${participants.map((participant, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #000; padding: 8px;">
                  ${participant.siswa?.nama || '-'}<br>
                  <small>NIK: ${participant.siswa?.nik || '-'}</small>
                </td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">
                  ${participant.siswa?.tanggal_lahir ? new Date(participant.siswa.tanggal_lahir).toLocaleDateString('en-US') : '-'}
                </td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">-</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center; height: 60px;">
                  <div style="width: 50px; height: 50px; background-color: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 10px;">
                    No Photo
                  </div>
                </td>
                <td style="border: 1px solid #000; padding: 8px;">
                  Status: ${participant.status}<br>
                  ${participant.keterangan || ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 30px; text-align: right; font-size: 10px;">
          Dicetak pada: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      `;
      
      document.body.appendChild(tempDiv);
      
      // Generate PDF using html2canvas and jsPDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(tempDiv);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `Daftar_Kandidat_${jobOrder.nama_job_order.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Gagal membuat PDF. Silakan coba lagi.');
    }
  }
}
