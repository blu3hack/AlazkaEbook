<?php

use App\Http\Controllers\AddPanelController;
use Inertia\Inertia;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\annotationController;
use App\Http\Controllers\admin\AdminController;
use App\Http\Controllers\ClassEbookController;
use App\Http\Controllers\DrawingController;
use App\Http\Controllers\EbookController;
use App\Http\Controllers\TokensImportController;
use App\Http\Controllers\UserImportController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// =================================================> Session Management System <===========================================================

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// =================================================> Routing Untuk Universal LOGIN <===========================================================

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/whiteboard', fn () => Inertia::render('Whiteboard'))->name('whiteboard');
});

// =================================================> Routing Untuk Role Siswa <===========================================================

// midleware untuk Siswa
Route::middleware(['auth', 'role:Siswa'])->group(function () {
    Route::get('/ClassEbook', [ClassEbookController::class, 'ClassEbook'])->name('class-ebook');
    Route::post('/ClassEbook', [ClassEbookController::class, 'sendtoken'])->name('sendtoken');
    Route::get('/drawings', [DrawingController::class, 'index']);
    Route::post('/drawings', [DrawingController::class, 'store']);
    Route::put('/drawings/{drawing}', [DrawingController::class, 'update']); // opsional
    Route::get('/admin', [AdminController::class, 'admin'])->name('admin');
    Route::get('/annotation', [annotationController::class, 'index']);
    Route::get('/flipbook', function () {
    if (!session()->has('access_key')) {
        abort(403);
    }

    return Inertia::render('FlipbookPage', [
        'access_key' => session('access_key'),
        'id_nama' => session('id_nama'),
        'file_pdf' => session('file_pdf'),
    ]);
});

    // Penyaji file PDF ebook. File disimpan privat di storage/app/ebooks dan
    // hanya boleh diakses bila token yang divalidasi cocok dengan sesi user.
    Route::get('/ebook-file/{file}', function (string $file) {
        // basename() mencegah path traversal (mis. ../../.env)
        $file = basename($file);

        if (!session()->has('access_key') || session('file_pdf') !== $file) {
            abort(403);
        }

        $path = storage_path('app/ebooks/' . $file);
        abort_unless(is_file($path), 404);

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
        ]);
    })->name('ebook.file');

});

// =================================================> Routing Untuk Role Admin <===========================================================

// Route midleware untuk admin
Route::middleware(['auth', 'role:Admin,AdminSD,AdminSMP'])->group(function () {
    Route::get('/add-token', [TokensImportController::class, 'tokens'])->name('add-tokens');
    Route::get('/manage-token', [TokensImportController::class, 'manage'])->name('manage-token');
    Route::post('/add-tokens', [TokensImportController::class, 'store'])->name('tokens-store');
    Route::post('/import-token', [TokensImportController::class, 'import'])->name('tokens.import');
    Route::delete('/tokens/{id}', [TokensImportController::class, 'deleteUsers'])->name('tokens.delete');
    Route::put('/tokens/{id}', [TokensImportController::class, 'update'])->name('tokens.update');
    Route::delete('/tokens', [TokensImportController::class, 'deleteUsers'])->name('tokens.delete.multiple');
    Route::post('/users/import', [UserImportController::class, 'import'])->name('users.import');
    Route::post('/users/store', [UserImportController::class, 'store'])->name('users.store');
    Route::get('/add-user', [UserImportController::class, 'users'])->name('add-users');
    Route::get('/manage-user', [UserImportController::class, 'manage'])->name('manage-user');
    Route::post('/add-user', [UserImportController::class, 'users'])->name('add-users');
    Route::put('/users/{id}', [UserImportController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserImportController::class, 'deleteUsers'])->name('users.delete');
    Route::delete('/users', [UserImportController::class, 'deleteUsers'])->name('users.delete.multiple');
    Route::get('/add-ebook', [EbookController::class, 'ebooks'])->name('add-ebook');
    Route::post('/ebooks/store', [EbookController::class, 'store'])->name('ebooks-store');
    Route::delete('/ebooks/{id}', [EbookController::class, 'deleteUsers'])->name('ebooks.delete');

    Route::get('/add-panel', [AddPanelController::class, 'panels'])->name('add-panels');
    Route::post('/panels/store', [AddPanelController::class, 'store'])->name('panels-store');
    Route::delete('/panels/{id}', [AddPanelController::class, 'deleteUsers'])->name('panels.delete');
});

require __DIR__.'/auth.php';
