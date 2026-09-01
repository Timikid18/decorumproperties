<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->unique()->constrained()->cascadeOnDelete();
            // land | house | apartment | commercial
            $table->string('property_type')->index();
            $table->decimal('land_size', 14, 2)->nullable();
            // plots | sqm | acres | hectares
            $table->string('land_size_unit')->nullable();
            $table->unsignedSmallInteger('bedrooms')->nullable();
            $table->unsignedSmallInteger('bathrooms')->nullable();
            $table->unsignedSmallInteger('parking_spaces')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            // residential | commercial | agricultural | mixed
            $table->string('purpose')->nullable();
            // unfurnished | semi-furnished | furnished
            $table->string('furnishing')->nullable();
            // e.g. ["Deed of Assignment","Survey Plan","Gazette","Certificate of Occupancy","Excision","Other"]
            $table->json('documents')->nullable();
            $table->timestamps();
        });

        Schema::create('automobiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('make')->nullable();
            $table->string('model')->nullable();
            $table->unsignedSmallInteger('year')->nullable()->index();
            $table->unsignedBigInteger('mileage')->nullable();
            // manual | automatic
            $table->string('transmission')->nullable();
            // petrol | diesel | hybrid | electric | gas | other
            $table->string('fuel_type')->nullable();
            $table->string('body_type')->nullable();
            $table->string('color')->nullable();
            $table->unsignedTinyInteger('doors')->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->string('engine_size')->nullable();
            $table->string('registration_number')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('automobiles');
        Schema::dropIfExists('properties');
    }
};