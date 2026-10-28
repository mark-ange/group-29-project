<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\User;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // If authenticated, get their bookings; otherwise if guest demo, retrieve guest bookings
        $query = Booking::with(['property', 'user'])->orderBy('created_at', 'desc');

        if ($user && ! $user->isHost()) {
            $query->where('user_id', $user->id);
        }

        $bookings = $query->get();

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings),
        ]);
    }

    public function show(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user && $user->id !== $booking->user_id && ! $user->isHost()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this booking.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new BookingResource($booking->load(['property', 'user'])),
        ]);
    }

    public function store(CreateBookingRequest $request, BookingService $bookingService): JsonResponse
    {
        $user = $request->user();

        // If no user provided in token, fallback to default guest user
        if (! $user) {
            $user = User::where('role', 'guest')->first() ?? User::first();
        }

        $booking = $bookingService->createBooking($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Reservation request submitted successfully. Pending host confirmation.',
            'data' => new BookingResource($booking->load(['property', 'user'])),
        ], 201);
    }

    public function cancel(Booking $booking, Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user && $user->id !== $booking->user_id && ! $user->isHost()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to cancel this booking.',
            ], 403);
        }

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json([
                'success' => false,
                'message' => 'Booking is already cancelled.',
            ], 422);
        }

        $booking->status = Booking::STATUS_CANCELLED;
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking cancelled successfully.',
            'data' => new BookingResource($booking->load(['property', 'user'])),
        ]);
    }
}
