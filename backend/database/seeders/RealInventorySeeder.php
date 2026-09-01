<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryGroup;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RealInventorySeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('email', 'admin@decorumproperties.ng')->first();

        // Ensure the "Home Appliances" category exists (generators & appliances).
        $electronicsGroup = CategoryGroup::where('slug', 'electronics')->first();
        $homeAppliances = Category::firstOrCreate(
            ['slug' => 'home-appliances'],
            [
                'group_id' => $electronicsGroup?->id,
                'name' => 'Home Appliances',
                'icon' => 'plug-zap',
                'type' => 'appliance',
                'sort_order' => 20,
                'is_active' => true,
            ]
        );

        $cat = fn (string $slug): ?int => Category::where('slug', $slug)->value('id');

        // The site's real inventory is authoritative. Clear any previous
        // demo/placeholder listings so only genuine stock is shown.
        Listing::query()->forceDelete();

        $realListings = [
            [
                'title' => 'Toyota Camry 2009 – Firsthand, Perfect Condition',
                'category' => Category::where('slug', 'cars')->value('id'),
                'listing_type' => 'automobile',
                'price' => 6000000,
                'location' => 'Ishaga, Lagos',
                'state' => 'Lagos State',
                'condition' => 'Excellent',
                'status' => 'available',
                'is_featured' => true,
                'short_description' => 'Toyota Camry 2009, firsthand use, registered 2022. No defects, perfect engine and gear.',
                'description' => "Toyota Camry 2009 – firsthand (first user). Year of entry 2022. No defects at all. \n\nPerfect engine and gear. \n\nLocation: Ishaga.",
                'image' => 'listings/auto1.jpg',
                'original_name' => 'auto1.jpg',
                'automobile' => [
                    'make' => 'Toyota',
                    'model' => 'Camry',
                    'year' => 2009,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'Saloon',
                    'doors' => 4,
                    'seats' => 5,
                ],
                'features' => ['Firsthand use', 'No defect', 'Perfect engine', 'Perfect gear'],
            ],
            [
                'title' => 'Ford Edge 2013 – Registered, Keyless with Panoramic Roof',
                'category' => Category::where('slug', 'suvs')->value('id'),
                'listing_type' => 'automobile',
                'price' => 6500000,
                'location' => 'Ajah, Lagos',
                'state' => 'Lagos State',
                'condition' => 'Good',
                'status' => 'available',
                'is_price_negotiable' => true,
                'short_description' => 'Registered Ford Edge 2013. Keyless ignition, panoramic roof, first body, genuine documents.',
                'description' => "Registered Ford Edge 2013. Keyless ignition with panoramic roof. Well used, first body, absolutely nothing to fix, with genuine documents. \n\nLocation: Ajah. Slightly negotiable.",
                'image' => 'listings/auto2.jpg',
                'original_name' => 'auto2.jpg',
                'automobile' => [
                    'make' => 'Ford',
                    'model' => 'Edge',
                    'year' => 2013,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'SUV',
                    'doors' => 5,
                    'seats' => 5,
                ],
                'features' => ['Registered', 'Keyless ignition', 'Panoramic roof', 'First body', 'Genuine documents'],
            ],
            [
                'title' => 'Range Rover Evoque 2013 – Buy & Drive',
                'category' => Category::where('slug', 'suvs')->value('id'),
                'listing_type' => 'automobile',
                'price' => 8800000,
                'location' => 'Ajah, Lagos',
                'state' => 'Lagos State',
                'condition' => 'Good',
                'status' => 'available',
                'short_description' => 'Neat Nigeria-used Range Rover Evoque 2013 in good condition. First body, nice interior, nothing to fix.',
                'description' => "Neat Nigeria-used Range Rover Evoque 2013 in good condition. \n\nAC and gear working fine, first body with nice interior, nothing to fix – buy and drive. \n\nLocation: Ajah.",
                'image' => 'listings/auto3.jpg',
                'original_name' => 'auto3.jpg',
                'automobile' => [
                    'make' => 'Range Rover',
                    'model' => 'Evoque',
                    'year' => 2013,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'SUV',
                    'doors' => 5,
                    'seats' => 5,
                ],
                'features' => ['First body', 'Nice interior', 'AC working', 'Gear working', 'Buy and drive'],
            ],
            [
                'title' => 'Toyota Camry V6 2008 – Clean In & Out',
                'category' => Category::where('slug', 'cars')->value('id'),
                'listing_type' => 'automobile',
                'price' => 5500000,
                'location' => 'Ikorodu, Lagos',
                'state' => 'Lagos State',
                'condition' => 'Good',
                'status' => 'available',
                'short_description' => 'Toyota Camry V6 2008. Sound engine and gear, clean in and out. Buy and drive.',
                'description' => "Awoof sales! 2008 Toyota Camry V6. \n\nSound engine and gear, chilling AC. Pure first body. Clean in & out. Used by a pastor. Absolutely buy and drive. \n\nLocation: Ikorodu. Car is with me now.",
                'image' => 'listings/auto4.jpg',
                'original_name' => 'auto4.jpg',
                'automobile' => [
                    'make' => 'Toyota',
                    'model' => 'Camry',
                    'year' => 2008,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'Saloon',
                    'doors' => 4,
                    'seats' => 5,
                    'engine_size' => 'V6',
                ],
                'features' => ['Sound engine', 'Chilling AC', 'First body', 'Clean in & out'],
            ],
            [
                'title' => 'Mercedes-Benz GLA 250 2019 – Foreign Used Direct',
                'category' => Category::where('slug', 'suvs')->value('id'),
                'listing_type' => 'automobile',
                'price' => 22500000,
                'location' => 'Lagos',
                'state' => 'Lagos State',
                'condition' => 'Excellent',
                'status' => 'available',
                'is_featured' => true,
                'short_description' => '2019 direct foreign-used Mercedes-Benz GLA 250. Panoramic view, keyless entry, black on black interior.',
                'description' => "New arrival – foreign used 2019 direct Mercedes-Benz GLA 250. \n\nFull panoramic views, keyless entry, thumb start, black on black interior, turbo gasoline engine. \n\nPrice: 22.5m. Cash needed this week only.",
                'image' => 'listings/auto5.jpg',
                'original_name' => 'auto5.jpg',
                'automobile' => [
                    'make' => 'Mercedes-Benz',
                    'model' => 'GLA 250',
                    'year' => 2019,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'SUV',
                    'doors' => 5,
                    'seats' => 5,
                    'engine_size' => '2.5L Turbo',
                ],
                'features' => ['Foreign used direct', 'Panoramic view', 'Keyless entry', 'Thumb start', 'Black on black interior', 'Turbo engine'],
            ],
            [
                'title' => 'Lexus ES 330 2004 – Registered, Buy & Drive',
                'category' => Category::where('slug', 'cars')->value('id'),
                'listing_type' => 'automobile',
                'price' => 5500000,
                'location' => 'Abule Egba, Lagos',
                'state' => 'Lagos State',
                'condition' => 'Good',
                'status' => 'available',
                'short_description' => 'Registered 2004 Lexus ES 330 available for sale. Absolute buy and drive.',
                'description' => "Hot deal. Registered 2004 Lexus ES 330 available for sale. \n\nAbsolute buy and drive. \n\nLocation: Abule Egba, Lagos.",
                'image' => 'listings/auto6.jpg',
                'original_name' => 'auto6.jpg',
                'automobile' => [
                    'make' => 'Lexus',
                    'model' => 'ES 330',
                    'year' => 2004,
                    'transmission' => 'Automatic',
                    'fuel_type' => 'Petrol',
                    'body_type' => 'Saloon',
                    'doors' => 4,
                    'seats' => 5,
                ],
                'features' => ['Registered', 'Buy and drive'],
            ],
            [
                'title' => 'ELEPAQ 4.5KVA Kickstarter Generator (Few Months Used)',
                'category' => $homeAppliances->id,
                'listing_type' => 'appliance',
                'price' => null,
                'location' => 'Lagos',
                'state' => 'Lagos State',
                'condition' => 'Good',
                'status' => 'available',
                'is_price_negotiable' => true,
                'short_description' => 'Few-months-used 4.5KVA ELEPAQ kickstarter generator. Works perfectly, no defect, battery active. Price via DM.',
                'description' => "Few-months-used 4.5KVA ELEPAQ kickstarter generator, readily available for sale. \n\nWorks perfectly, no defect, no repair history, battery active, available for inspection. \n\nPrice: kindly DM / WhatsApp to negotiate.",
                'image' => 'listings/gen1.jpg',
                'original_name' => 'Gen1.jpg',
                'features' => ['Works perfectly', 'No defect', 'No repair history', 'Battery active', 'Available for inspection'],
            ],
        ];

        foreach ($realListings as $data) {
            $listing = Listing::create([
                'user_id' => $owner?->id,
                'category_id' => $data['category'],
                'listing_type' => $data['listing_type'],
                'title' => $data['title'],
                'slug' => Str::slug($data['title']).'-'.Str::lower(Str::random(4)),
                'short_description' => $data['short_description'],
                'description' => $data['description'],
                'price' => $data['price'],
                'currency' => 'NGN',
                'is_price_negotiable' => $data['is_price_negotiable'] ?? false,
                'location' => $data['location'],
                'state' => $data['state'],
                'country' => 'Nigeria',
                'condition' => $data['condition'],
                'status' => $data['status'],
                'is_published' => true,
                'is_featured' => $data['is_featured'] ?? false,
                'is_demo' => false,
                'views' => random_int(15, 120),
                'published_at' => now(),
            ]);

            $size = is_file(storage_path('app/public/'.$data['image']))
                ? filesize(storage_path('app/public/'.$data['image']))
                : 0;

            $listing->images()->create([
                'path' => $data['image'],
                'original_name' => $data['original_name'],
                'mime' => 'image/jpeg',
                'size' => $size,
                'is_main' => true,
                'sort_order' => 0,
            ]);

            foreach ($data['features'] ?? [] as $index => $feature) {
                $listing->features()->create(['name' => $feature, 'position' => $index]);
            }

            if (isset($data['automobile'])) {
                $listing->automobile()->create($data['automobile']);
            }
        }
    }
}
