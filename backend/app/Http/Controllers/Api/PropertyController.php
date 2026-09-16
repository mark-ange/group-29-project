<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PriceCalculationRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'architectural_style' => ['required', 'string', 'max:255'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'bedrooms' => ['required', 'integer', 'min:1'],
            'bathrooms' => ['required', 'integer', 'min:1'],
            'max_guests' => ['required', 'integer', 'min:1'],
            'sqft' => ['required', 'integer', 'min:1'],
            'description' => ['required', 'string'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['url'],
            'amenities' => ['nullable', 'array'],
            'has_3d_tour' => ['boolean'],
        ]);

        $data['slug'] = Str::slug($data['title']) . '-' . Str::lower(Str::random(6));
        $data['category'] = 'all';
        $data['rating'] = 0;
        $data['reviews_count'] = 0;
        $data['is_available'] = true;
        $data['virtual_tour_rooms'] = [];
        $data['host_name'] = $request->user()->name;
        $data['host_avatar'] = $request->user()->avatar;
        $data['host_user_id'] = $request->user()->getKey();

        $property = Property::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Property published successfully.',
            'data' => PropertyResource::make($property),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Property::query();

        // Category filter
        if ($request->filled('category') && $request->category !== 'all' && $request->category !== 'trending') {
            if ($request->category === '3d-tours') {
                $query->where('has_3d_tour', true);
            } else {
                $query->where('category', $request->category);
            }
        }

        // 3D tours only
        if ($request->boolean('only_3d') || $request->boolean('has_3d_tour')) {
            $query->where('has_3d_tour', true);
        }

        // Available only by default for public browsing
        if (! $request->boolean('include_unavailable')) {
            $query->where('is_available', true);
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', (float) $request->max_price);
        }

        // Bedrooms
        if ($request->filled('bedrooms') && $request->bedrooms !== 'any') {
            $query->where('bedrooms', '>=', (int) $request->bedrooms);
        }

        // Search query (location, title, country)
        if ($request->filled('q')) {
            $search = '%' . strtolower($request->q) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(location) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(title) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(country) LIKE ?', [$search]);
            });
        }

        $properties = $query->orderBy('rating', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => PropertyResource::collection($properties),
        ]);
    }

    public function show(Property $property): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => PropertyResource::make($property),
        ]);
    }

    public function calculatePrice(
        PriceCalculationRequest $request,
        Property $property,
        BookingService $bookingService
    ): JsonResponse {
        $validated = $request->validated();
        $pricing = $bookingService->calculatePrice(
            $property,
            $validated['check_in'],
            $validated['check_out']
        );

        $available = $bookingService->isAvailable(
            $property,
            $validated['check_in'],
            $validated['check_out']
        );

        return response()->json([
            'success' => true,
            'data' => array_merge($pricing, [
                'is_available' => $available,
                'property_id' => $property->getKey(),
            ]),
        ]);
    }

    public function checkAvailability(
        Request $request,
        Property $property,
        BookingService $bookingService
    ): JsonResponse {
        $validated = $request->validate([
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        $isAvailable = $bookingService->isAvailable(
            $property,
            $validated['check_in'],
            $validated['check_out']
        );

        return response()->json([
            'success' => true,
            'data' => [
                'property_id' => $property->getKey(),
                'is_available' => $isAvailable,
                'message' => $isAvailable ? 'Dates are available.' : 'Selected dates are already booked or unavailable.',
            ],
        ]);
    }
}
