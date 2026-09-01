<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Store an uploaded image on the public disk and return its relative path.
     * Optionally one generated thumbnail-ish main variant is produced name-wise only.
     */
    public function storeImage(UploadedFile $file, string $directory = 'listings', string $disk = 'public'): array
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension());

        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
        if (! in_array($extension, $allowed, true)) {
            throw new \InvalidArgumentException('Unsupported image type: '.$extension);
        }

        $filename = Str::uuid().'-'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)).'.'.$extension;
        $path = $file->storeAs($directory, $filename, $disk);

        return [
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'url' => asset('storage/'.$path),
        ];
    }

    public function deleteImage(string $relativePath, string $disk = 'public'): void
    {
        if ($relativePath && Storage::disk($disk)->exists($relativePath)) {
            Storage::disk($disk)->delete($relativePath);
        }
    }

    /** @param  array<\Illuminate\Http\UploadedFile>  $files */
    public function storeImages(array $files, string $directory = 'listings'): array
    {
        $stored = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile && $file->isValid()) {
                $stored[] = $this->storeImage($file, $directory);
            }
        }

        return $stored;
    }
}