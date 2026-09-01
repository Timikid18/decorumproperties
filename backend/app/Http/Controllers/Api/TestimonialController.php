<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    use ApiResponse;

    public function index(): \Illuminate\Http\JsonResponse
    {
        $testimonials = Testimonial::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Testimonial $t) => [
                'id' => $t->id,
                'name' => $t->name,
                'role' => $t->role,
                'content' => $t->content,
                'rating' => $t->rating,
                'photo' => $t->photo_url,
            ]);

        return $this->success($testimonials, 'Testimonials retrieved successfully');
    }
}