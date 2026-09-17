<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
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
            'user_id' => $this->user_id,
            'property_id' => $this->property_id,
            'check_in' => $this->check_in?->format('Y-m-d'),
            'check_out' => $this->check_out?->format('Y-m-d'),
            'nights' => (int) $this->nights,
            'nightly_rate' => (float) $this->nightly_rate,
            'service_fee' => (float) $this->service_fee,
            'total_price' => (float) $this->total_price,
            'formatted_total' => 'Mex$' . number_format((float) $this->total_price, 2),
            'guests_count' => (int) $this->guests_count,
            'status' => $this->status,
            'notes' => $this->notes,
            'guest' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'email' => $this->user?->email,
                'avatar' => $this->user?->avatar,
            ],
            'property' => [
                'id' => $this->property?->id,
                'slug' => $this->property?->slug,
                'title' => $this->property?->title,
                'location' => $this->property?->location,
                'architectural_style' => $this->property?->architectural_style,
                'image' => $this->property?->images[0] ?? null,
                'has_3d_tour' => (bool) $this->property?->has_3d_tour,
                'is_available' => (bool) $this->property?->is_available,
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
