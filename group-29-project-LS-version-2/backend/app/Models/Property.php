<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'location',
        'country',
        'category',
        'architectural_style',
        'price_per_night',
        'rating',
        'reviews_count',
        'bedrooms',
        'bathrooms',
        'max_guests',
        'sqft',
        'has_3d_tour',
        'is_available',
        'description',
        'images',
        'amenities',
        'virtual_tour_rooms',
        'host_name',
        'host_avatar',
        'host_response_rate',
        'host_is_superhost',
        'host_user_id',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'rating' => 'decimal:2',
        'reviews_count' => 'integer',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'max_guests' => 'integer',
        'sqft' => 'integer',
        'has_3d_tour' => 'boolean',
        'is_available' => 'boolean',
        'images' => 'array',
        'amenities' => 'array',
        'virtual_tour_rooms' => 'array',
        'host_is_superhost' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function hostUser()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }
}
