<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AddPanelController extends Controller
{
    public function panels(Request $request)
    {
        // Ambil semua data ebook tanpa pagination
        $users = DB::table('panel')->get();
        return Inertia::render('admin/AddPanels', [
            'users' => $users,
        ]);
    }

    public function Store(Request $request)
    {
       $request->validate([
        // Kelas dibatasi alfanumerik agar tidak bisa dipakai path traversal
        // (mis. "../../public") saat dijadikan bagian nama file.
        'Kelas'  => 'required|alpha_num|max:10',
        'header' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        'footer' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $kelas = $request->Kelas;
        $header = $request->file('header');
        $footer = $request->file('footer');
        $headerName = 'header_' . $kelas  . '.' . $header->getClientOriginalExtension();
        $footerName = 'footer_' . $kelas  . '.' . $footer->getClientOriginalExtension();

        // Buat folder tujuan bila belum ada
        foreach (['header', 'footer'] as $dir) {
            if (!file_exists(public_path($dir))) {
                mkdir(public_path($dir), 0755, true);
            }
        }

        // Simpan file ke folder public
        $header->move(public_path('header'), $headerName);
        $footer->move(public_path('footer'), $footerName);

        // Simpan nama file ke database
        DB::table('panel')->insert([
            'kelas' => $kelas,
            'header' => $headerName,
            'footer' => $footerName,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return back()->with('success', 'File berhasil diupload!');
    }

    public function deleteUsers($id)
    {
        DB::table('panel')->where('id', $id)->delete();
        return redirect()->route('add-panels')->with('success', 'Data Berhasil dihapus!');
    }
}
