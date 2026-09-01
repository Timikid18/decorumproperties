<?php

namespace App\Services;

use App\Models\SiteSetting;

class SiteSettingsService
{
    public function publicSettings(): array
    {
        $settings = SiteSetting::query()
            ->where('is_public', true)
            ->get()
            ->keyBy('key')
            ->map(fn (SiteSetting $s) => $s->value)
            ->all();

        foreach (['whatsapp', 'phone'] as $contactKey) {
            $values = data_get((object) $settings, $contactKey, null);
            $settings[$contactKey.'_links'] = $this->waLinks($values);
        }

        return $settings;
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return SiteSetting::get($key, $default);
    }

    /** @return array<string, string|null> */
    public function waLinks(mixed $value): array
    {
        $numbers = [];
        if (is_array($value)) {
            $numbers = array_values($value);
        } elseif (is_string($value) && $value !== '') {
            $numbers = preg_split('/[\s,;]+/', $value) ?: [];
        }

        return array_map(fn (string $n) => $this->normalizePhone($n), array_filter($numbers));
    }

    public function normalizePhone(string $number): string
    {
        $digits = preg_replace('/\D/', '', $number) ?? '';

        return '234'.substr($digits, -10);
    }
}