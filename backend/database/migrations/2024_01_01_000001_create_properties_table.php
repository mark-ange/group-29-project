<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('location');
            $table->string('country');
            $table->string('category')->index(); // 'trending', 'beachfront', 'mansions', etc.
            $table->string('architectural_style');
            $table->decimal('price_per_night', 12, 2);
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('bedrooms');
            $table->unsignedInteger('bathrooms');
            $table->unsignedInteger('max_guests');
            $table->unsignedInteger('sqft');
            $table->boolean('has_3d_tour')->default(true);
            $table->boolean('is_available')->default(true)->index();
            $table->text('description');
            $table->jsonb('images')->default('[]');
            $table->jsonb('amenities')->default('[]');
            $table->jsonb('virtual_tour_rooms')->nullable();
            $table->string('host_name');
            $table->string('host_avatar')->nullable();
            $table->string('host_response_rate')->default('100% within an hour');
            $table->boolean('host_is_superhost')->default(true);
            $table->foreignId('host_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
