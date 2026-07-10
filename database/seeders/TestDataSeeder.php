<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder DATA UJI (bukan produksi).
 *
 * Menyiapkan akun admin, siswa per kelas, dan token akses buku yang siap dipakai
 * untuk menguji alur: login siswa -> pilih ebook -> masukkan token -> flipbook.
 *
 * Jalankan:  php artisan db:seed --class=TestDataSeeder
 *
 * Idempoten: semua baris uji ditandai unique_char berawalan "SEED" dan akan
 * dihapus lebih dulu setiap kali seeder dijalankan, sehingga aman diulang.
 */
class TestDataSeeder extends Seeder
{
    /** Password default untuk SEMUA akun uji. */
    private string $password = 'password';

    /**
     * Kelas -> daftar file PDF (harus ada di storage/app/ebooks/).
     */
    private array $map = [
        '4A' => ['IPAS_kelas4.pdf', 'Matematika_kelas4.pdf', 'Bahasa Indonesia_kelas4.pdf'],
        '5A' => ['Matematika_kelas5.pdf', 'PPKN_kelas5.pdf', 'Bahasa Indonesia_kelas5.pdf'],
        '7A' => ['IPA_kelas7.pdf', 'Matematika_kelas7.pdf', 'Bahasa Indonesia_kelas7.pdf'],
    ];

    public function run(): void
    {
        // 1) Bersihkan data uji lama (idempoten).
        DB::table('token')->where('unique_char', 'like', 'SEED%')->delete();
        DB::table('users')->where('unique_char', 'like', 'SEED%')->delete();

        // 2) Akun admin (untuk uji panel & scoping kelas).
        $this->createUser('SEEDADMIN', 'admin.seed', 'Admin Seeder', 'Admin', null);
        $this->createUser('SEEDADMINSD', 'adminsd.seed', 'Admin SD Seeder', 'AdminSD', null);

        // 3) Siswa + token per buku.
        $summary = [];
        foreach ($this->map as $kelas => $files) {
            $num    = preg_replace('/\D/', '', $kelas);   // "4A" -> "4"
            $uname  = 'siswa' . $num;                      // siswa4, siswa5, siswa7
            $uc     = 'SEEDSISWA' . $num;
            $userId = $this->createUser($uc, $uname, 'Siswa Kelas ' . $kelas, 'Siswa', $kelas);

            foreach ($files as $i => $file) {
                // Pastikan ebook terdaftar agar tampil di halaman ClassEbook.
                $this->ensureEbook($file, $num);

                $token = sprintf('TES-%s-%d', $num, $i + 1); // mis. TES-4-1

                DB::table('token')->insert([
                    'unique_char' => $uc,
                    'name'        => 'Siswa Kelas ' . $kelas,
                    'id_nama'     => $userId,
                    'token'       => $token,
                    'kelas'       => $kelas,
                    'ebook'       => $file,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                $summary[] = [$uname, $this->password, $kelas, $file, $token];
            }
        }

        // 4) Ringkasan kredensial ke terminal.
        $this->command->info('=== DATA UJI BERHASIL DIBUAT ===');
        $this->command->line('Admin   -> username: admin.seed    | password: ' . $this->password . ' | role: Admin');
        $this->command->line('AdminSD -> username: adminsd.seed  | password: ' . $this->password . ' | role: AdminSD');
        $this->command->line('');
        $this->command->info('Siswa & token akses buku (login lalu masukkan token pada ebook yang sesuai):');
        $this->command->table(
            ['Username', 'Password', 'Kelas', 'Ebook (file_pdf)', 'Token'],
            $summary
        );
    }

    private function createUser(string $uniqueChar, string $username, string $nama, string $role, ?string $kelas): int
    {
        return DB::table('users')->insertGetId([
            'unique_char' => $uniqueChar,
            'Username'    => $username,
            'Password'    => Hash::make($this->password),
            'Kelas'       => $kelas,
            'Nama'        => $nama,
            'role'        => $role,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    /**
     * Sisipkan baris ebook bila file_pdf-nya belum terdaftar (tidak menimpa data asli).
     */
    private function ensureEbook(string $file, string $kelasNum): void
    {
        if (DB::table('ebook')->where('file_pdf', $file)->exists()) {
            return;
        }

        // "IPAS_kelas4.pdf" -> judul "IPAS"
        $title = trim(preg_replace('/_kelas\d+\.pdf$/i', '', $file));

        DB::table('ebook')->insert([
            'ebook'      => $title !== '' ? $title : $file,
            'author'     => 'SDI Alazka',
            'kelas'      => $kelasNum,
            'cover'      => null,
            'file_pdf'   => $file,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
