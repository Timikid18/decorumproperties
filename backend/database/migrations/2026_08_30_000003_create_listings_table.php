<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            // property | land | automobile | gadget | appliance | furniture | electronics | other
            $table->string('listing_type')->default('other')->index();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('short_description')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2)->nullable()->index();
            $table->string('currency', 8)->default('NGN');
            $table->boolean('is_price_negotiable')->default(false);
            $table->string('location')->nullable()->index();
            $table->string('state')->nullable();
            $table->string('country')->default('Nigeria');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            // Brand New | Like New | Excellent | Good | Fairly Used | Used
            $table->string('condition')->nullable();
            // available | reserved | sold | unavailable
            $table->string('status')->default('available')->index();
            $table->boolean('is_published')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_demo')->default(false)->index();
            $table->unsignedBigInteger('views')->default(0);
            $table->string('video_url')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['listing_type', 'status']);
            $table->index(['is_published', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};