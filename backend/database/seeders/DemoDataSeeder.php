<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        if (! Listing::where('is_demo', true)->exists() || app()->environment('local')) {
            $owner = User::where('email', 'admin@decorumproperties.ng')->first();

            $cat = fn (string $slug): ?int => Category::where('slug', $slug)->value('id');

            $demoListings = [
                [
                    'title' => '55-inch Samsung Smart TV (Fairly Used)',
                    'category' => 'tvs',
                    'listing_type' => 'electronics',
                    'price' => 450000,
                    'location' => 'Abeokuta',
                    'condition' => 'Fairly Used',
                    'status' => 'available',
                    'is_featured' => true,
                    'short_description' => 'Crisp 4K picture with smart features. Fully tested and working.',
                    'description' => 'A well-maintained Samsung Smart TV in excellent working condition. Perfect for the living room or lounge. Comes with remote control and power cable. Fully tested before delivery.',
                    'features' => ['4K Ultra HD', 'Smart TV', 'Remote Included', 'Elegant slim design'],
                    'specifications' => [
                        ['label' => 'Screen size', 'value' => '55 inches'],
                        ['label' => 'Resolution', 'value' => '4K Ultra HD'],
                        ['label' => 'Condition', 'value' => 'Fairly Used'],
                    ],
                ],
                [
                    'title' => 'Fairly Used Refrigerator – Double Door',
                    'category' => 'refrigerators',
                    'listing_type' => 'appliance',
                    'price' => 320000,
                    'location' => 'Abeokuta',
                    'condition' => 'Fairly Used',
                    'status' => 'available',
                    'short_description' => 'Energy-efficient double-door fridge, keeps items perfectly cold.',
                    'description' => 'A sturdy double-door refrigerator that has been serviced and is ready for the kitchen. Spacious interior with adjustable shelves and a reliable compressor.',
                    'features' => ['Double door', 'Energy efficient', 'Adjustable shelves', 'Serviced'],
                    'specifications' => [
                        ['label' => 'Type', 'value' => 'Double door'],
                        ['label' => 'Capacity', 'value' => '200+ litres'],
                    ],
                ],
                [
                    'title' => 'PlayStation 5 Console (PS5)',
                    'category' => 'playstations',
                    'listing_type' => 'gadget',
                    'price' => 520000,
                    'location' => 'Abeokuta',
                    'condition' => 'Like New',
                    'status' => 'available',
                    'is_featured' => true,
                    'short_description' => 'PS5 console with controller and cables. Few hours of usage.',
                    'description' => 'A near-new PlayStation 5 that has had very light use. Includes one DualSense controller, HDMI cable and power cable. Great for the gamer in your home.',
                    'features' => ['DualSense controller', '4K gaming', 'Light usage', 'All cables included'],
                ],
                [
                    'title' => 'iPhone 12 Pro Max 256GB',
                    'category' => 'phones',
                    'listing_type' => 'gadget',
                    'price' => 590000,
                    'location' => 'Abeokuta',
                    'condition' => 'Good',
                    'status' => 'available',
                    'short_description' => '256GB storage, good battery health, Face ID working.',
                    'description' => 'An iPhone 12 Pro Max with 256GB of storage. Good battery health, Face ID and all cameras working. Screens and body in clean condition.',
                    'features' => ['256GB storage', 'Face ID', 'Graphene Blue', 'Unlocked'],
                    'specifications' => [
                        ['label' => 'Storage', 'value' => '256GB'],
                        ['label' => 'Colour', 'value' => 'Graphite'],
                    ],
                ],
                [
                    'title' => 'Front-Load Washing Machine (7kg)',
                    'category' => 'washing-machines',
                    'listing_type' => 'appliance',
                    'price' => 210000,
                    'location' => 'Abeokuta',
                    'condition' => 'Good',
                    'status' => 'available',
                    'short_description' => '7kg capacity front-loader with spin and quick wash functions.',
                    'description' => 'A reliable front-load washing machine with multiple wash modes, quick wash and spin dry. In good working order and ready for daily use.',
                    'features' => ['7kg capacity', 'Multiple modes', 'Quick wash', 'Spin dry'],
                ],
                [
                    'title' => 'King-Size Bed Frame (Wooden)',
                    'category' => 'bed-frames',
                    'listing_type' => 'furniture',
                    'price' => 185000,
                    'location' => 'Abeokuta',
                    'condition' => 'Good',
                    'status' => 'available',
                    'short_description' => 'Sturdy wooden bed frame, classic finish, easy to assemble.',
                    'description' => 'A solid, well-built wooden bed frame with beautiful finish. Features a strong base and headboard. Easy to assemble.',
                    'features' => ['Solid wood', 'Headboard included', 'Easy assembly'],
                ],
                [
                    'title' => 'Wooden TV Console Stand',
                    'category' => 'tv-consoles',
                    'listing_type' => 'furniture',
                    'price' => 95000,
                    'location' => 'Abeokuta',
                    'condition' => 'Fairly Used',
                    'status' => 'available',
                    'short_description' => 'Spacious TV console with shelf storage for entertainment units.',
                    'description' => 'A neat wooden TV console with ample shelf space for your TV, decoders, sound systems and decor pieces.',
                    'features' => ['Shelf storage', 'Sturdy build'],
                ],
                [
                    'title' => '4-Door Wardrobe (Large)',
                    'category' => 'wardrobes',
                    'listing_type' => 'furniture',
                    'price' => 260000,
                    'location' => 'Abeokuta',
                    'condition' => 'Good',
                    'status' => 'available',
                    'short_description' => 'Large wardrobe with drawers and hanging space. In great condition.',
                    'description' => 'A spacious four-door wardrobe offering generous hanging space and drawers. Ideal for a master bedroom.',
                    'features' => ['4 doors', 'Drawers', 'Hanging rails'],
                ],
                [
                    'title' => 'Toyota Camry 2015 (Clean, Well-Maintained)',
                    'category' => 'cars',
                    'listing_type' => 'automobile',
                    'price' => 12500000,
                    'location' => 'Abeokuta',
                    'condition' => 'Excellent',
                    'status' => 'available',
                    'is_featured' => true,
                    'short_description' => '2015 Toyota Camry, automatic, low mileage, foreign used.',
                    'description' => 'A clean and well-maintained Toyota Camry with automatic transmission. Very smooth engine, comfortable leather interior and all papers available.',
                    'automobile' => [
                        'make' => 'Toyota',
                        'model' => 'Camry',
                        'year' => 2015,
                        'mileage' => 85000,
                        'transmission' => 'Automatic',
                        'fuel_type' => 'Petrol',
                        'body_type' => 'Saloon',
                        'color' => 'Black',
                        'doors' => 4,
                        'seats' => 5,
                        'engine_size' => '2.5L',
                    ],
                    'features' => ['Automatic', 'Leather interior', 'Reverse camera', 'Well maintained'],
                ],
                [
                    'title' => 'Residential Land – Accord Estate, Abeokuta',
                    'category' => 'lands',
                    'listing_type' => 'land',
                    'price' => 2500000,
                    'location' => 'Accord Estate, Abeokuta',
                    'state' => 'Ogun State',
                    'status' => 'available',
                    'is_featured' => true,
                    'is_price_negotiable' => true,
                    'property' => [
                        'property_type' => 'land',
                        'land_size' => 500,
                        'land_size_unit' => 'sqm',
                        'purpose' => 'residential',
                        'documents' => ['Survey Plan', 'Deed of Assignment'],
                    ],
                    'short_description' => 'Prime residential plot in Accord Estate with proper documentation.',
                    'description' => 'A clean, accessible residential plot located in Accord Estate within FUNAAB Abeokuta road. Suitable for building your family home. Documentation: Survey Plan and Deed of Assignment.',
                    'features' => ['Accessible road', 'Fenced community', 'Survey plan available'],
                ],
                [
                    'title' => '4-Bedroom Duplex for Sale – Abeokuta',
                    'category' => 'houses',
                    'listing_type' => 'property',
                    'price' => 65000000,
                    'location' => 'Abeokuta',
                    'state' => 'Ogun State',
                    'status' => 'available',
                    'is_featured' => true,
                    'property' => [
                        'property_type' => 'house',
                        'bedrooms' => 4,
                        'bathrooms' => 4,
                        'parking_spaces' => 2,
                        'year_built' => 2018,
                        'purpose' => 'residential',
                        'furnishing' => 'semi-furnished',
                        'documents' => ['Certificate of Occupancy', 'Survey Plan'],
                    ],
                    'short_description' => 'Spacious 4-bedroom duplex in a serene neighbourhood.',
                    'description' => 'A beautiful 4-bedroom duplex in a quiet, secure neighbourhood in Abeokuta. Features a well-appointed kitchen, ensuite bathrooms, parking space for two cars and a good ceiling height for the Nigerian climate.',
                    'features' => ['Ensuite bathrooms', 'Pop ceiling', 'Kitchen cabinets', 'Serene estate'],
                ],
                [
                    'title' => 'Commercial Shop Space – Abeokuta',
                    'category' => 'commercial-properties',
                    'listing_type' => 'property',
                    'price' => 18000000,
                    'location' => 'Abeokuta',
                    'state' => 'Ogun State',
                    'status' => 'reserved',
                    'property' => [
                        'property_type' => 'commercial',
                        'land_size' => 150,
                        'land_size_unit' => 'sqm',
                        'purpose' => 'commercial',
                    ],
                    'short_description' => 'Prime commercial space with high visibility for your business.',
                    'description' => 'A prime commercial shop space located along a busy Abeokuta road with excellent visibility and foot traffic. Ideal for retail, offices or a showroom.',
                    'features' => ['High visibility', 'Road frontage', 'Secure area'],
                ],
            ];

            foreach ($demoListings as $data) {
                $categoryId = $cat($data['category']);

                $listing = Listing::create([
                    'user_id' => $owner?->id,
                    'category_id' => $categoryId,
                    'listing_type' => $data['listing_type'],
                    'title' => $data['title'],
                    'slug' => Str::slug($data['title']).'-'.Str::lower(Str::random(4)),
                    'short_description' => $data['short_description'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'currency' => 'NGN',
                    'is_price_negotiable' => $data['is_price_negotiable'] ?? false,
                    'location' => $data['location'],
                    'state' => $data['state'] ?? 'Ogun State',
                    'country' => 'Nigeria',
                    'condition' => $data['condition'] ?? null,
                    'status' => $data['status'],
                    'is_published' => true,
                    'is_featured' => $data['is_featured'] ?? false,
                    'is_demo' => true,
                    'views' => random_int(50, 400),
                    'published_at' => now()->subHours(random_int(1, 300)),
                ]);

                foreach ($data['features'] ?? [] as $index => $feature) {
                    $listing->features()->create(['name' => $feature, 'position' => $index]);
                }

                foreach ($data['specifications'] ?? [] as $index => $spec) {
                    $listing->specifications()->create([
                        'label' => $spec['label'],
                        'value' => $spec['value'],
                        'position' => $index,
                    ]);
                }

                if (isset($data['property'])) {
                    $listing->property()->create($data['property']);
                }

                if (isset($data['automobile'])) {
                    $listing->automobile()->create($data['automobile']);
                }
            }
        }
    }
}