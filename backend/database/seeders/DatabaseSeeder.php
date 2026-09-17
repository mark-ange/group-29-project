<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Users
        $hostUser = User::create([
            'name' => 'Alex Montgomery',
            'email' => 'host@luxestay.com',
            'password' => Hash::make('password'),
            'role' => 'host',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        ]);

        $guestUser = User::create([
            'name' => 'Marcus Vance',
            'email' => 'guest@luxestay.com',
            'password' => Hash::make('password'),
            'role' => 'guest',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        ]);

        $guestUser2 = User::create([
            'name' => 'Sophia Lin',
            'email' => 'sophia@luxestay.com',
            'password' => Hash::make('password'),
            'role' => 'guest',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        ]);

        // 2. Curated Luxury Properties
        $villas = [
            [
                'slug' => 'villa-kinkaku',
                'title' => 'Villa Kinkaku & Reflection Pool',
                'subtitle' => 'Cantilevered Teak Pavilion & Hinoki Spa Sanctuary',
                'location' => 'Kyoto, Kansai',
                'country' => 'Japan',
                'category' => 'trending',
                'architectural_style' => 'Organic Modernism',
                'price_per_night' => 2450.00,
                'rating' => 4.98,
                'reviews_count' => 84,
                'bedrooms' => 4,
                'bathrooms' => 5,
                'max_guests' => 8,
                'sqft' => 6400,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'Suspended gracefully above an emerald koi basin and manicured cedar groves, Villa Kinkaku balances ancient Japanese joinery with bold cantilevered titanium and low-iron glass facades. Designed by Pritzker laureates, it features private natural onsen baths fed by subterranean thermal springs.',
                'images' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Thermal Onsen & Hinoki Cedar Spa',
                    'Heated Infinity Reflection Pool',
                    'Private Tea Ceremony Master',
                    'Acoustic Listening Lounge & Vinyl Vault',
                    'Michelin-Trained Private Chef Service',
                    'Sub-Zero Wine Cellar & Sake Gallery',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'pool', 'name' => 'Cantilever Pool Deck', 'description' => 'Zero-edge pool with optic fiber lighting mirroring Kyoto constellations.'],
                    ['id' => 'living', 'name' => 'Main Glass Pavilion', 'description' => 'Double-height volume wrapped in frameless floor-to-ceiling motorized glazing.'],
                    ['id' => 'master', 'name' => 'Cantilever Master Suite', 'description' => 'Floating bedroom with uninterrupted panorama of the bamboo forest.'],
                    ['id' => 'onsen', 'name' => 'Private Hinoki Spa', 'description' => 'Deep soaking tub sculpted from 300-year-old salvaged Japanese cypress.'],
                ],
                'host_name' => 'Kenji & Elena Sato',
                'host_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '100% within 15 minutes',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
            [
                'slug' => 'malibu-sunset',
                'title' => 'The Malibu Cantilever Crest',
                'subtitle' => 'Brutalist Concrete & Sunset Ocean Cantilever',
                'location' => 'Malibu, California',
                'country' => 'United States',
                'category' => 'beachfront',
                'architectural_style' => 'Warm Brutalism',
                'price_per_night' => 3800.00,
                'rating' => 4.99,
                'reviews_count' => 112,
                'bedrooms' => 5,
                'bathrooms' => 6,
                'max_guests' => 10,
                'sqft' => 8200,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'Perched dramatically over the Pacific surf, this warm board-formed architectural monolith features an extraordinary 42-foot cantilevered living wing. Frameless glass pocket doors disappear to unite indoor fire features with the ocean horizon.',
                'images' => [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Private Funicular to Secluded Cove',
                    'Cantilevered Infinity Spa Over Surf',
                    'Dolby Atmos Screening Pavilion',
                    'Tesla Solar Roof & Ultra-Fast Charging',
                    'Dedicated Butler & Chauffeur Fleet',
                    'Commercial Grade Outdoor Kitchen',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'pool', 'name' => 'Pacific Infinity Deck', 'description' => 'Sweeping cantilever deck suspended 180 feet above crashing waves.'],
                    ['id' => 'living', 'name' => 'Great Ocean Hall', 'description' => 'Continuous board-formed concrete and travertine fireplaces.'],
                    ['id' => 'master', 'name' => 'Skyline Suite', 'description' => 'Floor-to-ceiling glass wrapping the coastal mountain contours.'],
                ],
                'host_name' => 'Alex Montgomery',
                'host_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '99% within 20 minutes',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
            [
                'slug' => 'the-glass-horizon',
                'title' => 'The Glass Horizon at Lake Como',
                'subtitle' => 'Floating Lakeside Pavilion with Private Berth',
                'location' => 'Bellagio, Lake Como',
                'country' => 'Italy',
                'category' => 'mansions',
                'architectural_style' => 'Rationalist Minimalist',
                'price_per_night' => 4200.00,
                'rating' => 5.00,
                'reviews_count' => 67,
                'bedrooms' => 6,
                'bathrooms' => 7,
                'max_guests' => 12,
                'sqft' => 9500,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'A neoclassical stone foundation re-envisioned through ultra-slender Swiss engineered steel and anti-reflective glass. Boasts direct lake access, a Riva boat house, and terraced Italian gardens planted with centuries-old olive and cypress trees.',
                'images' => [
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Private Riva Aquarama Yacht Dock',
                    'Heated Lake-Level Pool with Submerged Glass',
                    'Historic Wine Grotto & Tasting Vault',
                    'Helipad Access (10 min from Milan)',
                    'Full Concierge & Sommelier Staff',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'dock', 'name' => 'Lakeside Jetty & Boathouse', 'description' => 'Hand-cut Moltrasio stone pier with mooring for vintage watercraft.'],
                    ['id' => 'pavilion', 'name' => 'Central Glass Gallery', 'description' => '360-degree panorama of the Como mountain ridges.'],
                ],
                'host_name' => 'Contessa Beatrice Visconti',
                'host_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '100% within 1 hour',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
            [
                'slug' => 'villa-mirage',
                'title' => 'Villa Mirage Palm Springs',
                'subtitle' => 'Desert Modernism with Cantilever Terrazzo',
                'location' => 'Palm Springs, California',
                'country' => 'United States',
                'category' => 'desert',
                'architectural_style' => 'Mid-Century Futurism',
                'price_per_night' => 1950.00,
                'rating' => 4.96,
                'reviews_count' => 93,
                'bedrooms' => 3,
                'bathrooms' => 4,
                'max_guests' => 6,
                'sqft' => 4800,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'Tucked into the San Jacinto granite foothills, Villa Mirage reinterprets desert modernism with cast terrazzo floors, floating shade planes, and a sunken conversation pit framing twilight desert colors.',
                'images' => [
                    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Olympic Length Saline Lap Pool',
                    'Sunken Fire Pit with Mountain Vista',
                    'Solar Geo-Thermal Climate Envelope',
                    'Stargazing Observatory Deck',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'pool', 'name' => 'Desert Reflection Deck', 'description' => 'Mirrored water surface framing the dry palm silhouettes.'],
                    ['id' => 'lounge', 'name' => 'Sunken Fire Pavilion', 'description' => 'Integrated desert stone seating with panoramic glass.'],
                ],
                'host_name' => 'David Sterling',
                'host_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '98% within 30 minutes',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
            [
                'slug' => 'alpine-monolith',
                'title' => 'The Alpine Monolith Zermatt',
                'subtitle' => 'Carved Granite Sanctuary with Matterhorn Alignment',
                'location' => 'Zermatt, Valais',
                'country' => 'Switzerland',
                'category' => 'ski',
                'architectural_style' => 'Alpine Brutalism',
                'price_per_night' => 3100.00,
                'rating' => 4.97,
                'reviews_count' => 49,
                'bedrooms' => 4,
                'bathrooms' => 5,
                'max_guests' => 8,
                'sqft' => 5600,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'Carved directly into the schist rock of the Swiss Alps, this monolithic timber and stone chalet aligns perfectly with the jagged geometry of the Matterhorn. Includes private ski-in/ski-out elevator.',
                'images' => [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Ski-In / Ski-Out Private Express Tunnel',
                    'Indoor Heated Grotto Pool & Cryo-Chamber',
                    'Open Fireplace with Smoked Oak Hearth',
                    'Matterhorn Stargazing Telescope Suite',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'grotto', 'name' => 'Subterranean Stone Spa', 'description' => 'Heated spring water carved directly inside Swiss granite.'],
                    ['id' => 'lounge', 'name' => 'Matterhorn Great Room', 'description' => 'Direct unobstructed axis to the alpine summit.'],
                ],
                'host_name' => 'Hanspeter & Heidi Meyer',
                'host_avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '100% within 10 minutes',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
            [
                'slug' => 'cycladic-haven',
                'title' => 'The Cycladic Haven Oia',
                'subtitle' => 'Sculpted Caldera Cliff Villa with Infinity Plunge',
                'location' => 'Oia, Santorini',
                'country' => 'Greece',
                'category' => 'beachfront',
                'architectural_style' => 'Neo-Cycladic Minimal',
                'price_per_night' => 2850.00,
                'rating' => 4.95,
                'reviews_count' => 120,
                'bedrooms' => 3,
                'bathrooms' => 4,
                'max_guests' => 6,
                'sqft' => 4100,
                'has_3d_tour' => true,
                'is_available' => true,
                'description' => 'Hand-plastered white lime walls cascading 300 meters down the volcanic caldera. Featuring curved monolithic archways, zero-edge heated cliff pools, and private sunset terraces overlooking the Aegean Sea.',
                'images' => [
                    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1800&q=85',
                    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
                ],
                'amenities' => [
                    'Caldera Edge Infinity Plunge Pool',
                    'Cave Wine Cellar with Assyrtiko Vintages',
                    'Daily Champagne Breakfast on Private Terrace',
                    'Dedicated Porter & Yacht Charter Service',
                ],
                'virtual_tour_rooms' => [
                    ['id' => 'pool', 'name' => 'Aegean Cliff Edge', 'description' => 'Floating water boundary merging into the caldera crater.'],
                    ['id' => 'cave', 'name' => 'Sculpted White Master Cave', 'description' => 'Curvilinear bedroom formed from natural volcanic rock.'],
                ],
                'host_name' => 'Nikos & Eleni Karras',
                'host_avatar' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
                'host_response_rate' => '100% within 15 minutes',
                'host_is_superhost' => true,
                'host_user_id' => $hostUser->id,
            ],
        ];

        $createdProperties = [];
        foreach ($villas as $villa) {
            $createdProperties[] = Property::create($villa);
        }

        // 3. Seed Realistic Bookings with proper price calculation
        $kinkaku = $createdProperties[0];
        $malibu = $createdProperties[1];
        $como = $createdProperties[2];

        // Approved booking for Sophia Lin on Villa Kinkaku
        $nights1 = 5;
        $nightly1 = (float) $kinkaku->price_per_night;
        $subtotal1 = $nightly1 * $nights1;
        $service1 = $subtotal1 * 0.12;
        $total1 = $subtotal1 + $service1;

        Booking::create([
            'user_id' => $guestUser2->id,
            'property_id' => $kinkaku->id,
            'check_in' => Carbon::now()->addDays(20)->format('Y-m-d'),
            'check_out' => Carbon::now()->addDays(25)->format('Y-m-d'),
            'nights' => $nights1,
            'nightly_rate' => $nightly1,
            'service_fee' => $service1,
            'total_price' => $total1,
            'guests_count' => 4,
            'status' => Booking::STATUS_APPROVED,
            'notes' => 'Looking forward to the tea ceremony and Hinoki spa experience.',
        ]);

        // Pending booking for Marcus Vance on Malibu Cantilever (allows user to test Approve/Decline in Host mode!)
        $nights2 = 4;
        $nightly2 = (float) $malibu->price_per_night;
        $subtotal2 = $nightly2 * $nights2;
        $service2 = $subtotal2 * 0.12;
        $total2 = $subtotal2 + $service2;

        Booking::create([
            'user_id' => $guestUser->id,
            'property_id' => $malibu->id,
            'check_in' => Carbon::now()->addDays(10)->format('Y-m-d'),
            'check_out' => Carbon::now()->addDays(14)->format('Y-m-d'),
            'nights' => $nights2,
            'nightly_rate' => $nightly2,
            'service_fee' => $service2,
            'total_price' => $total2,
            'guests_count' => 2,
            'status' => Booking::STATUS_PENDING,
            'notes' => 'Special anniversary celebration trip. Requesting early funicular check-in.',
        ]);

        // Approved booking on Glass Horizon (contributes to host revenue & occupancy)
        $nights3 = 7;
        $nightly3 = (float) $como->price_per_night;
        $subtotal3 = $nightly3 * $nights3;
        $service3 = $subtotal3 * 0.12;
        $total3 = $subtotal3 + $service3;

        Booking::create([
            'user_id' => $guestUser2->id,
            'property_id' => $como->id,
            'check_in' => Carbon::now()->subDays(10)->format('Y-m-d'),
            'check_out' => Carbon::now()->subDays(3)->format('Y-m-d'),
            'nights' => $nights3,
            'nightly_rate' => $nightly3,
            'service_fee' => $service3,
            'total_price' => $total3,
            'guests_count' => 6,
            'status' => Booking::STATUS_APPROVED,
            'notes' => 'Private boat charter requested for Lake Como cruise.',
        ]);
    }
}
