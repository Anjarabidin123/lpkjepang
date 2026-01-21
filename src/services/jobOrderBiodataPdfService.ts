import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JobOrder } from '@/types/jobOrder';
import { JobOrderPeserta } from '@/types/jobOrder';
import { supabase } from '@/integrations/supabase/client';

export class JobOrderBiodataPdfService {
  static async generateBiodataPdf(
    jobOrder: JobOrder, 
    participants: JobOrderPeserta[]
  ): Promise<void> {
    try {
      console.log('Starting biodata PDF generation for job order:', jobOrder.nama_job_order);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      let isFirstPage = true;

      for (const [index, participant] of participants.entries()) {
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

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

        const siswa = completeStudentData;
        const pengalamanKerja = siswa?.siswa_pengalaman_kerja || [];
        const kontakKeluarga = siswa?.siswa_kontak_keluarga || [];
        const keluargaIndonesia = siswa?.siswa_keluarga_indonesia || [];
        const keluargaJepang = siswa?.siswa_keluarga_jepang || [];
        const pendidikan = siswa?.siswa_pendidikan || [];

        // Create temporary div for each participant's biodata
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '11px';
        tempDiv.style.lineHeight = '1.4';
        
        // Create the professional biodata HTML content matching the reference image
        tempDiv.innerHTML = `
          <div style="margin-bottom: 15px; text-align: center;">
            <h2 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">
              履歴書<br/>BIODATA - CV
            </h2>
            <div style="text-align: right; font-size: 32px; font-weight: bold; margin-bottom: 10px; position: absolute; top: 10px; right: 20px;">1</div>
          </div>

          <!-- Main Information Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 2px solid #000; table-layout: fixed;">
            <tr>
              <td style="width: 70%; vertical-align: top; padding: 0; border-right: 2px solid #000;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="width: 25%; padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Nama:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px; word-wrap: break-word;">${siswa?.nama || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">氏名:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px; word-wrap: break-word;">${siswa?.nama || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Tanggal Lahir:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.tanggal_lahir ? new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID') : '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">生年月日:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.tanggal_lahir ? new Date(siswa.tanggal_lahir).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '年').replace(/年(\d{2})年/, '年$1月').replace(/月(\d{2})$/, '月$1日') : '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Jenis Kelamin:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.jenis_kelamin || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">性別:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.jenis_kelamin === 'Laki-laki' ? '男性' : siswa?.jenis_kelamin === 'Perempuan' ? '女性' : '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Status Pernikahan:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.status_pernikahan || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">配偶者:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.status_pernikahan === 'Belum Menikah' ? '未婚' : '既婚'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Alamat Rumah:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; word-wrap: break-word; line-height: 1.3;">${siswa?.alamat || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">自宅住所:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; word-wrap: break-word; line-height: 1.3;">${siswa?.alamat || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Tempat Lahir:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.tempat_lahir || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">出生地:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.tempat_lahir || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Agama:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.agama || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">宗教:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.agama || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">No. Telp:</td>
                    <td style="padding: 6px 8px; border-bottom: 1px solid #000; font-size: 11px;">${siswa?.telepon || '-'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 8px; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">電話番号:</td>
                    <td style="padding: 6px 8px; font-size: 11px;">${siswa?.telepon || '-'}</td>
                  </tr>
                </table>
              </td>
              <td style="width: 30%; vertical-align: top; text-align: center; padding: 12px;">
                <div style="border: 2px solid #000; width: 130px; height: 170px; margin: 0 auto 8px auto; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9;">
                  ${siswa?.foto_url ? 
                    `<img src="${siswa.foto_url}" style="max-width: 126px; max-height: 166px; object-fit: cover;" alt="Foto" />` : 
                    '<span style="font-size: 12px; color: #666; text-align: center; line-height: 1.4;">Pas Foto<br/>3x4</span>'
                  }
                </div>
                <div style="font-size: 10px; margin-bottom: 12px; color: #666;">写真 (Photo)</div>
                <div style="font-size: 11px; text-align: left; line-height: 1.4;">
                  <div style="margin-bottom: 6px;">
                    <strong>Umur:</strong> ${siswa?.tanggal_lahir ? new Date().getFullYear() - new Date(siswa.tanggal_lahir).getFullYear() : '-'} Tahun
                  </div>
                  <div>
                    <strong>年齢:</strong> ${siswa?.tanggal_lahir ? new Date().getFullYear() - new Date(siswa.tanggal_lahir).getFullYear() : '-'} 歳
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Physical Information Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 2px solid #000;">
            <tr>
              <td style="width: 25%; padding: 8px; border-right: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Tinggi Badan:</td>
              <td style="width: 25%; padding: 8px; border-right: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.tinggi_badan ? siswa.tinggi_badan + ' Cm' : '-'}</td>
              <td style="width: 25%; padding: 8px; border-right: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Berat Badan:</td>
              <td style="width: 25%; padding: 8px; font-size: 11px; text-align: center;">${siswa?.berat_badan ? siswa.berat_badan + ' Kg' : '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">身長:</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.tinggi_badan ? siswa.tinggi_badan + ' Cm' : '-'}</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">体重:</td>
              <td style="padding: 8px; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.berat_badan ? siswa.berat_badan + ' Kg' : '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Ukuran Sepatu:</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.ukuran_sepatu ? siswa.ukuran_sepatu + ' Cm' : '-'}</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">Golongan Darah:</td>
              <td style="padding: 8px; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.golongan_darah || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">靴サイズ:</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.ukuran_sepatu ? siswa.ukuran_sepatu + ' Cm' : '-'}</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8;">血液型:</td>
              <td style="padding: 8px; border-top: 1px solid #000; font-size: 11px; text-align: center;">${siswa?.golongan_darah || '-'}</td>
            </tr>
          </table>

          <!-- Additional Information Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; border: 2px solid #000;">
            <tr>
              <td style="width: 16.66%; padding: 8px; border-right: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">Ukuran Pinggang:</td>
              <td style="width: 16.66%; padding: 8px; border-right: 1px solid #000; font-size: 11px; text-align: center;">79.00 Cm</td>
              <td style="width: 16.66%; padding: 8px; border-right: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">Ukuran Kepala:</td>
              <td style="width: 16.66%; padding: 8px; border-right: 1px solid #000; font-size: 11px; text-align: center;">57.00 Cm</td>
              <td style="width: 16.66%; padding: 8px; border-right: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">Buta Warna:</td>
              <td style="width: 16.66%; padding: 8px; font-size: 11px; text-align: center;">☐ 有色 ☑ 無</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">ウエスト:</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 11px; text-align: center;">79.00 Cm</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">頭のサイズ:</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 11px; text-align: center;">57.00 Cm</td>
              <td style="padding: 8px; border-right: 1px solid #000; border-top: 1px solid #000; font-size: 10px; font-weight: bold; background-color: #f8f8f8; text-align: center;">色盲覚:</td>
              <td style="padding: 8px; border-top: 1px solid #000; font-size: 11px; text-align: center;">☐ 有色 ☑ 無</td>
            </tr>
          </table>

          <!-- Additional Sections with proper table formatting... -->
          ${this.generateEducationSection(pendidikan, siswa)}
          ${this.generateWorkExperienceSection(pengalamanKerja)}
          ${this.generateFamilyContactSection(kontakKeluarga)}
          ${this.generateIndonesianFamilySection(keluargaIndonesia)}
          ${this.generateJapaneseFamilySection(keluargaJepang)}

          <div style="margin-top: 20px; text-align: right; font-size: 8px; color: #666;">
            Halaman ${index + 1} dari ${participants.length} | 
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
        
        // Generate canvas from the temporary div
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 800,
          height: 1200
        });
        
        document.body.removeChild(tempDiv);
        
        // Add image to PDF
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if content is too long
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      const fileName = `Biodata_Kandidat_${jobOrder.nama_job_order.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      console.log('Biodata PDF generated successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating biodata PDF:', error);
      throw new Error('Gagal membuat PDF biodata. Silakan coba lagi.');
    }
  }

  private static generateEducationSection(pendidikan: any[], siswa: any): string {
    return `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; background-color: #f0f0f0; padding: 6px; border: 2px solid #000; text-align: center;">
          PENDIDIKAN 学歴
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 12%; font-weight: bold;">MASUK SEKOLAH<br/>入学</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 12%; font-weight: bold;">LULUS SEKOLAH<br/>卒業</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 8%; font-weight: bold;">THN<br/>年</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 8%; font-weight: bold;">BLN<br/>月</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 35%; font-weight: bold;">NAMA SEKOLAH<br/>学校名</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 25%; font-weight: bold;">JURUSAN<br/>学科・専門科目</th>
            </tr>
          </thead>
          <tbody>
            ${pendidikan.length > 0 ? pendidikan.map(edu => `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${edu.tahun_masuk || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${edu.tahun_lulus || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${edu.tahun_lulus ? new Date(edu.tahun_lulus + '-01-01').getFullYear() : '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">6</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${edu.nama_institusi}</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${edu.jurusan || '-'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${siswa?.tahun_masuk_sekolah || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${siswa?.tahun_lulus_sekolah || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${siswa?.tahun_lulus_sekolah || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">6</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${siswa?.nama_sekolah || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${siswa?.jurusan || '-'}</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateWorkExperienceSection(pengalamanKerja: any[]): string {
    return `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; background-color: #f0f0f0; padding: 6px; border: 2px solid #000; text-align: center;">
          RIWAYAT/PENGALAMAN KERJA 職歴
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 12%; font-weight: bold;">DARI<br/>年月</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 8%; font-weight: bold;">BLN<br/>月</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 12%; font-weight: bold;">SAMPAI<br/>まで</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 8%; font-weight: bold;">BLN<br/>月</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 30%; font-weight: bold;">NAMA PERUSAHAAN<br/>会社名</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 30%; font-weight: bold;">JENIS PEKERJAAN<br/>職種内容</th>
            </tr>
          </thead>
          <tbody>
            ${pengalamanKerja.length > 0 ? pengalamanKerja.map(exp => `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${exp.tahun_masuk || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">1</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${exp.tahun_keluar || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">12</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${exp.nama_perusahaan}</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${exp.jenis_pekerjaan || '-'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" style="border: 1px solid #000; padding: 12px; text-align: center; font-style: italic;">
                  Tidak ada pengalaman kerja
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateFamilyContactSection(kontakKeluarga: any[]): string {
    return `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; background-color: #f0f0f0; padding: 6px; border: 2px solid #000; text-align: center;">
          KELUARGA YANG BISA DIHUBUNGI 連絡する家族
        </h3>
        ${kontakKeluarga.length > 0 ? kontakKeluarga.map(kontak => `
          <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000; margin-bottom: 8px;">
            <tr>
              <td style="width: 20%; padding: 6px; border: 1px solid #000; background-color: #f5f5f5; font-weight: bold;">Nama:</td>
              <td style="width: 80%; padding: 6px; border: 1px solid #000; word-wrap: break-word;">${kontak.nama}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #000; background-color: #f5f5f5; font-weight: bold;">Alamat:</td>
              <td style="padding: 6px; border: 1px solid #000; word-wrap: break-word;">${kontak.alamat || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #000; background-color: #f5f5f5; font-weight: bold;">No. HP:</td>
              <td style="padding: 6px; border: 1px solid #000;">${kontak.no_hp || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #000; background-color: #f5f5f5; font-weight: bold;">Penghasilan Perbulan:</td>
              <td style="padding: 6px; border: 1px solid #000;">${kontak.penghasilan_per_bulan ? 'Rp ' + Number(kontak.penghasilan_per_bulan).toLocaleString('id-ID') : '-'}</td>
            </tr>
          </table>
        `).join('') : '<p style="font-size: 9px; font-style: italic; border: 2px solid #000; padding: 8px;">Tidak ada data kontak keluarga</p>'}
      </div>
    `;
  }

  private static generateIndonesianFamilySection(keluargaIndonesia: any[]): string {
    return `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; background-color: #f0f0f0; padding: 6px; border: 2px solid #000; text-align: center;">
          KELUARGA DI INDONESIA インドネシアでの家族
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 40%; font-weight: bold;">NAMA<br/>氏名</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 15%; font-weight: bold;">UMUR<br/>年齢</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 20%; font-weight: bold;">HUBUNGAN<br/>関係</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 25%; font-weight: bold;">PEKERJAAN<br/>職業</th>
            </tr>
          </thead>
          <tbody>
            ${keluargaIndonesia.length > 0 ? keluargaIndonesia.map(kel => `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${kel.nama}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${kel.umur || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${kel.hubungan || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${kel.pekerjaan || '-'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 12px; text-align: center; font-style: italic;">
                  Tidak ada data keluarga di Indonesia
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }

  private static generateJapaneseFamilySection(keluargaJepang: any[]): string {
    return `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; background-color: #f0f0f0; padding: 6px; border: 2px solid #000; text-align: center;">
          KELUARGA/SAUDARA/TEMAN DI JEPANG JIKA ADA 日本家族・友達
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 9px; border: 2px solid #000;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 40%; font-weight: bold;">NAMA<br/>氏名</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 15%; font-weight: bold;">UMUR<br/>年齢</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 20%; font-weight: bold;">HUBUNGAN<br/>関係</th>
              <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 25%; font-weight: bold;">PEKERJAAN<br/>職業</th>
            </tr>
          </thead>
          <tbody>
            ${keluargaJepang.length > 0 ? keluargaJepang.map(kel => `
              <tr>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${kel.nama}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${kel.umur || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">${kel.hubungan || '-'}</td>
                <td style="border: 1px solid #000; padding: 4px; word-wrap: break-word;">${kel.pekerjaan || '-'}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="4" style="border: 1px solid #000; padding: 12px; text-align: center; font-style: italic;">
                  Tidak ada keluarga di Jepang
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;
  }
}
