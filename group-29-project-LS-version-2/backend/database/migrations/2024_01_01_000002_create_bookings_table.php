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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedInteger('nights');
            $table->decimal('nightly_rate', 12, 2);
            $table->decimal('service_fee', 12, 2);
            $table->decimal('total_price', 12, 2);
            $table->unsignedInteger('guests_count')->default(1);
            $table->string('status')->default('pending')->index(); // 'pending', 'approved', 'declined', 'cancelled'
            $table->text('notes')->nullable();
            $table->timestamps();

            // Compound index for lightning availability queries and conflict detection
            $table->index(['property_id', 'status', 'check_in', 'check_out']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
