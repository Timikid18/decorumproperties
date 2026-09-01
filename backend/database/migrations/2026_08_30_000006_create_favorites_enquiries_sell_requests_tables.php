<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'listing_id']);
        });

        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 30)->nullable();
            $table->text('message');
            // new | contacted | in_progress | resolved | closed
            $table->string('status')->default('new')->index();
            // listing | contact | general
            $table->string('source')->default('listing')->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('listing_id');
        });

        Schema::create('sell_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->string('category_name')->nullable();
            $table->string('item_title');
            $table->text('description')->nullable();
            $table->string('condition')->nullable();
            $table->decimal('asking_price', 15, 2)->nullable();
            $table->string('location')->nullable();
            // property | land | automobile | gadget | appliance | furniture | electronics | other
            $table->string('listing_type')->default('other');
            $table->string('property_type')->nullable();
            $table->decimal('land_size', 14, 2)->nullable();
            $table->string('land_size_unit')->nullable();
            $table->json('documents')->nullable();
            $table->unsignedSmallInteger('bedrooms')->nullable();
            $table->unsignedSmallInteger('bathrooms')->nullable();
            $table->text('additional_info')->nullable();
            // pending | reviewing | contacted | accepted | rejected | purchased | closed
            $table->string('status')->default('pending')->index();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sell_request_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sell_request_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('original_name')->nullable();
            $table->string('mime', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->boolean('is_main')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('sell_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sell_request_images');
        Schema::dropIfExists('sell_requests');
        Schema::dropIfExists('enquiries');
        Schema::dropIfExists('favorites');
    }
};