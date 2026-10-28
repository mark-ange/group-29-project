<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'location' => $this->location,
            'country' => $this->country,
            'category' => $this->category,
            'architectural_style' => $this->architectural_style,
            'price_per_night' => (float) $this->price_per_night,
            'formatted_price' => 'Mex$' . number_format((float) $this->price_per_night, 0),
            'rating' => (float) $this->rating,
            'reviews_count' => (int) $this->reviews_count,
            'bedrooms' => (int) $this->bedrooms,
            'bathrooms' => (int) $this->bathrooms,
            'max_guests' => (int) $this->max_guests,
            'sqft' => (int) $this->sqft,
            'has_3d_tour' => (bool) $this->has_3d_tour,
            'is_available' => (bool) $this->is_available,
            'description' => $this->description,
            'images' => $this->images ?? [],
            'amenities' => $this->amenities ?? [],
            'virtual_tour_rooms' => $this->virtual_tour_rooms ?? [],
            'host' => [
                'name' => $this->host_name,
                'avatar' => $this->host_avatar,
                'response_rate' => $this->host_response_rate,
                'is_superhost' => (bool) $this->host_is_superhost,
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
