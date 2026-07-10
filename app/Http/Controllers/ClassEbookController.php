<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassEbookController extends Controller
{
    public function ClassEbook()
    {
        $userClass = Auth::user()->Kelas;
        $userID = Auth::user()->id;

        // Ambil angka kelas dari string seperti "7A, 8C, 4" -> ["7", "8", "4"]
        $kelasParts = preg_split('/[\s,]+/', (string) $userClass, -1, PREG_SPLIT_NO_EMPTY);
        $kelasNumbers = array_values(array_filter(array_map(function ($part) {
            preg_match('/\d+/', $part, $matches);
            return $matches[0] ?? null;
        }, $kelasParts)));

        // whereIn: siswa yang berada di beberapa kelas melihat SEMUA ebook kelasnya.
        // (Sebelumnya di-AND sehingga siswa multi-kelas tidak mendapat ebook sama sekali.)
        $ebooks = DB::table('ebook')
            ->when($kelasNumbers, fn ($query) => $query->whereIn('kelas', $kelasNumbers))
            ->get();

        return Inertia::render('ClassEbook/PageClass', [
            'ebooks' => $ebooks,
            'class' => $kelasNumbers,
            'usersID' => $userID,
        ]);
    }

    public function sendtoken(Request $request) 
    {
        $validated = $request->validate([
            'token' => 'required|string|max:255',
            'file_pdf' => 'required|string|max:255',
            'id_nama' => 'required|max:255',
        ]);

        $token = $validated['token'];
        $id_nama = $validated['id_nama'];
        $file_pdf = $validated['file_pdf'];

        $data = DB::table('token')
        ->select('name', 'id_nama', 'token', 'ebook')
        ->where('token', $token)
        ->first();

       if (!$data) {
            throw ValidationException::withMessages([
                'token' => 'Token tidak ditemukan',
            ]);
        }

        if ($id_nama != $data->id_nama) {
            throw ValidationException::withMessages([
                'token' => 'Token tidak sesuai User',
            ]);
        }

        if ($file_pdf != $data->ebook) {
            throw ValidationException::withMessages([
                'token' => 'Token tidak sesuai Ebook',
            ]);
        }

        // Simpan grant di session PERSISTEN (bukan flash) supaya route penyaji
        // PDF dan reload halaman flipbook tetap terotorisasi.
        $request->session()->put([
            'access_key' => $validated['token'],
            'id_nama'    => $validated['id_nama'],
            'file_pdf'   => $validated['file_pdf'],
        ]);

        return redirect('/flipbook');

    }

    public function index() {
        return Inertia::render('Index');
    }
}
