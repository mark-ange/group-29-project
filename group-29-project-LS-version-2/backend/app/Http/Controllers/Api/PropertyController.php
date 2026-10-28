<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PriceCalculationRequest;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
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
            'data' => new PropertyResource($property),
        ]);
    }

    public function calculatePrice(
        PriceCalculationRequest $request,
        Property $property,
        BookingService $bookingService
    ): JsonResponse {
        $pricing = $bookingService->calculatePrice(
            $property,
            $request->check_in,
            $request->check_out
        );

        $available = $bookingService->isAvailable(
            $property,
            $request->check_in,
            $request->check_out
        );

        return response()->json([
            'success' => true,
            'data' => array_merge($pricing, [
                'is_available' => $available,
                'property_id' => $property->id,
            ]),
        ]);
    }

    public function checkAvailability(
        Request $request,
        Property $property,
        BookingService $bookingService
    ): JsonResponse {
        $request->validate([
            'check_in' => ['required', 'date'],
            'check_out' => ['required', 'date', 'after:check_in'],
        ]);

        $isAvailable = $bookingService->isAvailable(
            $property,
            $request->check_in,
            $request->check_out
        );

        return response()->json([
            'success' => true,
            'data' => [
                'property_id' => $property->id,
                'is_available' => $isAvailable,
                'message' => $isAvailable ? 'Dates are available.' : 'Selected dates are already booked or unavailable.',
            ],
        ]);
    }
}
