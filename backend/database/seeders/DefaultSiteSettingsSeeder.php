<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class DefaultSiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'business_name', 'value' => 'DECORUM HOMES & PROPERTIES', 'group' => 'brand', 'is_public' => true],
            ['key' => 'slogan', 'value' => 'We make buying and selling simple.', 'group' => 'brand', 'is_public' => true],
            ['key' => 'address', 'value' => 'Accord Estate, FUNAAB, Abeokuta Road, Abeokuta, Ogun State, Nigeria.', 'group' => 'contact', 'is_public' => true],
            ['key' => 'phone', 'value' => ['07066527982', '09039744172'], 'group' => 'contact', 'is_public' => true],
            ['key' => 'whatsapp', 'value' => ['09039744172', '07066527982'], 'group' => 'contact', 'is_public' => true],
            ['key' => 'email', 'value' => 'decorumproperties.ng@gmail.com', 'group' => 'contact', 'is_public' => true],
            ['key' => 'facebook', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'instagram', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'twitter', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'linkedin', 'value' => '', 'group' => 'social', 'is_public' => true],
            ['key' => 'logo', 'value' => '', 'group' => 'brand', 'is_public' => true],
            ['key' => 'favicon', 'value' => '', 'group' => 'brand', 'is_public' => true],
            ['key' => 'hero_headline', 'value' => 'Buy. Sell. Own. Declutter.', 'group' => 'homepage', 'is_public' => true],
            ['key' => 'hero_subheadline', 'value' => 'From lands and homes to cars, gadgets, appliances and fairly used items — DECORUM makes buying and selling simple.', 'group' => 'homepage', 'is_public' => true],
            ['key' => 'map_embed_url', 'value' => '', 'group' => 'contact', 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}