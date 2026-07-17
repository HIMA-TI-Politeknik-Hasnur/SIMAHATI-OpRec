<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengumuman;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function exportExcel()
    {
        $fileName = 'laporan_pengumuman.csv';
        $pengumumans = Pengumuman::all();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['ID', 'Judul', 'Tipe', 'Tanggal Terbit', 'Dibuat Oleh'];

        $callback = function() use($pengumumans, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($pengumumans as $item) {
                fputcsv($file, [
                    $item->id,
                    $item->judul,
                    $item->tipe,
                    $item->published_at ? $item->published_at->format('Y-m-d') : '-',
                    $item->created_by
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf()
    {
        // Sebagai fallback standar jika library laravel-dompdf belum terinstall, 
        // mengembalikan tampilan HTML clean untuk dicetak (Print to PDF) oleh browser
        $pengumumans = Pengumuman::all();
        
        $html = '<h1 style="text-align:center;">Laporan Pengumuman OpRec</h1>';
        $html .= '<table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse: collapse;">';
        $html .= '<tr><th>ID</th><th>Judul</th><th>Tipe</th><th>Terbit</th></tr>';
        foreach ($pengumumans as $item) {
            $html .= '<tr>';
            $html .= '<td>' . $item->id . '</td>';
            $html .= '<td>' . $item->judul . '</td>';
            $html .= '<td>' . $item->tipe . '</td>';
            $html .= '<td>' . ($item->published_at ? $item->published_at->format('Y-m-d') : '-') . '</td>';
            $html .= '</tr>';
        }
        $html .= '</table>';
        $html .= '<script>window.print();</script>';

        return response($html)->header('Content-Type', 'text/html');
    }
}
