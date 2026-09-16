<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_DECLINED = 'declined';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'property_id',
        'check_in',
        'check_out',
        'nights',
        'nightly_rate',
        'service_fee',
        'total_price',
        'guests_count',
        'status',
        'notes',
    ];

    protected $casts = [
        'check_in' => 'date:Y-m-d',
        'check_out' => 'date:Y-m-d',
        'nights' => 'integer',
        'nightly_rate' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'guests_count' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeDeclined($query)
    {
        return $query->where('status', self::STATUS_DECLINED);
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }
}
