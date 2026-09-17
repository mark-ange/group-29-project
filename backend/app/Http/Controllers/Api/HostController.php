<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\PropertyResource;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostController extends Controller
{
    private function resolveHost(Request $request): User
    {
        $user = $request->user();

        if (! $user) {
            // Default host user for demo session
            $user = User::where('role', 'host')->first();
        }

        if (! $user || ! $user->isHost()) {
            abort(403, 'Access denied. Only authorized hosts can access this section.');
        }

        return $user;
    }

    public function dashboard(Request $request, BookingService $bookingService): JsonResponse
    {
        $host = $this->resolveHost($request);
        $metrics = $bookingService->getHostMetrics();

        $recentBookings = Booking::with(['property', 'user'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        $properties = Property::orderBy('id', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'metrics' => $metrics,
                'bookings' => BookingResource::collection($recentBookings),
                'properties' => PropertyResource::collection($properties),
                'host' => [
                    'id' => $host->id,
                    'name' => $host->name,
                    'email' => $host->email,
                    'role' => $host->role,
                ],
            ],
        ]);
    }

    public function bookings(Request $request): JsonResponse
    {
        $this->resolveHost($request);

        $query = Booking::with(['property', 'user'])->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $bookings = $query->get();

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings),
        ]);
    }

    public function approve(Booking $booking, Request $request, BookingService $bookingService): JsonResponse
    {
        $host = $this->resolveHost($request);

        $updatedBooking = $bookingService->approveBooking($booking, $host);
        $metrics = $bookingService->getHostMetrics();

        return response()->json([
            'success' => true,
            'message' => "Booking #{$booking->id} has been approved.",
            'data' => [
                'booking' => new BookingResource($updatedBooking),
                'metrics' => $metrics,
            ],
        ]);
    }

    public function decline(Booking $booking, Request $request, BookingService $bookingService): JsonResponse
    {
        $host = $this->resolveHost($request);

        $updatedBooking = $bookingService->declineBooking($booking, $host);
        $metrics = $bookingService->getHostMetrics();

        return response()->json([
            'success' => true,
            'message' => "Booking #{$booking->id} has been declined.",
            'data' => [
                'booking' => new BookingResource($updatedBooking),
                'metrics' => $metrics,
            ],
        ]);
    }

    public function toggleAvailability(Property $property, Request $request): JsonResponse
    {
        $this->resolveHost($request);

        $request->validate([
            'is_available' => ['nullable', 'boolean'],
        ]);

        if ($request->has('is_available')) {
            $property->is_available = $request->boolean('is_available');
        } else {
            $property->is_available = ! $property->is_available;
        }

        $property->save();

        return response()->json([
            'success' => true,
            'message' => "Property '{$property->title}' availability updated to " . ($property->is_available ? 'Available' : 'Unavailable') . '.',
            'data' => new PropertyResource($property),
        ]);
    }
}
