<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /** @var array<int, array<string, mixed>> */
    protected array $data = [
        [
            'name' => 'Real Estate',
            'icon' => 'building-2',
            'categories' => [
                ['name' => 'Lands', 'icon' => 'land-plot', 'type' => 'land'],
                ['name' => 'Houses', 'icon' => 'home', 'type' => 'property'],
                ['name' => 'Apartments', 'icon' => 'building', 'type' => 'property'],
                ['name' => 'Commercial Properties', 'icon' => 'store', 'type' => 'property'],
            ],
        ],
        [
            'name' => 'Automobiles',
            'icon' => 'car',
            'categories' => [
                ['name' => 'Cars', 'icon' => 'car', 'type' => 'automobile'],
                ['name' => 'SUVs', 'icon' => 'truck', 'type' => 'automobile'],
                ['name' => 'Other Vehicles', 'icon' => 'car-front', 'type' => 'automobile'],
            ],
        ],
        [
            'name' => 'Electronics',
            'icon' => 'tv',
            'categories' => [
                ['name' => 'TVs', 'icon' => 'tv', 'type' => 'electronics'],
                ['name' => 'Refrigerators', 'icon' => 'refrigerator', 'type' => 'appliance'],
                ['name' => 'Washing Machines', 'icon' => 'washing-machine', 'type' => 'appliance'],
                ['name' => 'Other Electronics', 'icon' => 'plug-zap', 'type' => 'electronics'],
            ],
        ],
        [
            'name' => 'Gadgets',
            'icon' => 'smartphone',
            'categories' => [
                ['name' => 'Phones', 'icon' => 'smartphone', 'type' => 'gadget'],
                ['name' => 'PlayStations', 'icon' => 'gamepad-2', 'type' => 'gadget'],
                ['name' => 'Spectranet Devices', 'icon' => 'wifi', 'type' => 'gadget'],
                ['name' => 'Other Gadgets', 'icon' => 'watch', 'type' => 'gadget'],
            ],
        ],
        [
            'name' => 'Home & Furniture',
            'icon' => 'armchair',
            'categories' => [
                ['name' => 'Bed Frames', 'icon' => 'bed-double', 'type' => 'furniture'],
                ['name' => 'Mattresses', 'icon' => 'bed-single', 'type' => 'furniture'],
                ['name' => 'TV Consoles', 'icon' => 'frame', 'type' => 'furniture'],
                ['name' => 'Wardrobes', 'icon' => 'door-closed', 'type' => 'furniture'],
                ['name' => 'Furniture', 'icon' => 'armchair', 'type' => 'furniture'],
                ['name' => 'Other Home Items', 'icon' => 'package', 'type' => 'other'],
            ],
        ],
    ];

    public function run(): void
    {
        $sort = 0;
        foreach ($this->data as $groupData) {
            $group = CategoryGroup::firstOrCreate(
                ['slug' => Str::slug($groupData['name'])],
                [
                    'name' => $groupData['name'],
                    'icon' => $groupData['icon'],
                    'sort_order' => $sort,
                    'is_active' => true,
                ]
            );
            $sort++;

            foreach ($groupData['categories'] as $index => $categoryData) {
                Category::firstOrCreate(
                    ['slug' => Str::slug($categoryData['name'])],
                    [
                        'group_id' => $group->id,
                        'name' => $categoryData['name'],
                        'icon' => $categoryData['icon'],
                        'type' => $categoryData['type'],
                        'sort_order' => $index,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}