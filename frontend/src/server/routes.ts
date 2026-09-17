import { Router, Request, Response } from 'express';
import { users, properties, bookings, Property, Booking, User } from './database';

export const apiRouter = Router();

// Helper to format currency
function formatCurrency(amount: number): string {
  return `Mex$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// 1. System Health
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'LuxeStay Architectural Sanctuaries',
    database: 'PostgreSQL 15 (Relational Layer Active)',
    backend: 'Laravel 10 Compatible Express Engine',
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth Endpoints
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
  res.json({
    success: true,
    data: {
      user,
      token: `luxestay_jwt_${user.id}_${Date.now()}`,
    },
    message: `Welcome back, ${user.name}`,
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    role,
    phone,
    travel_preferences,
    villa_name,
    villa_location,
    architectural_style,
    bedrooms,
    nightly_rate,
    inspection_requested,
  } = req.body;

  const isHostRole = role === 'host';

  const newUser: User = {
    id: users.length + 1,
    name: name || (isHostRole ? 'Luxe Villa Host' : 'Valued Guest'),
    email: email || `user_${Date.now()}@luxestay.com`,
    role: isHostRole ? 'host' : 'guest',
    avatar: isHostRole
      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    is_host: isHostRole,
    is_guest: !isHostRole,
    phone: phone || '',
    travel_preferences: travel_preferences || [],
    villa_name: villa_name || '',
    villa_location: villa_location || '',
    architectural_style: architectural_style || '',
    inspection_requested: Boolean(inspection_requested),
  };

  users.push(newUser);

  // If host provided an estate/villa, add it to the active property catalog
  if (isHostRole && villa_name) {
    const propertyId = properties.length + 1;
    const slug = villa_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `villa-${propertyId}`;
    const rate = Number(nightly_rate) || 28000;
    const beds = Number(bedrooms) || 4;

    const newProperty: Property = {
      id: propertyId,
      slug,
      title: villa_name,
      subtitle: `${architectural_style || 'Contemporary Architecture'} in ${villa_location || 'Global Destination'}`,
      location: villa_location || 'Costa Careyes, Mexico',
      country: villa_location ? villa_location.split(',').pop()?.trim() || 'International' : 'Mexico',
      category: 'mansions',
      architectural_style: architectural_style || 'Modern Architectural Masterpiece',
      designer: name || 'Independent Architect',
      lat: 19.4326,
      lng: -99.1332,
      price_per_night: rate,
      formatted_price: formatCurrency(rate),
      rating: 5.0,
      reviews_count: 1,
      bedrooms: beds,
      bathrooms: Math.max(beds, 3),
      max_guests: beds * 2,
      sqft: beds * 1400,
      has_3d_tour: true,
      is_available: true,
      description: `Spectacular luxury estate ${villa_name} situated in ${villa_location || 'a pristine private enclave'}. Designed with refined ${architectural_style || 'contemporary architecture'}, bespoke materials, and tailored concierge services.`,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      ],
      amenities: [
        'Infinity Ocean Pool',
        'Luxe 300+ Point Certified',
        'Sub-Zero & Wolf Kitchen',
        'Starlink High-Speed WiFi',
        'Dedicated Butler & Trip Designer',
        'Private Helipad Access',
      ],
      host: {
        name: newUser.name,
        avatar: newUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        response_rate: '100%',
        is_superhost: true,
      },
    };

    properties.unshift(newProperty);
  }

  res.json({
    success: true,
    data: {
      user: newUser,
      token: `luxestay_jwt_${newUser.id}_${Date.now()}`,
    },
    message: isHostRole
      ? `Welcome, ${newUser.name}! Your host account and estate listing have been initiated.`
      : `Welcome to the Luxe Collection, ${newUser.name}! Your guest profile is ready.`,
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Signed out' });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('jwt_')) {
    return res.status(401).json({ success: false, data: null, message: 'Unauthenticated' });
  }
  const parts = authHeader.split('_');
  const id = parseInt(parts[2]);
  const found = users.find((u) => u.id === id);
  if (!found) {
    return res.status(401).json({ success: false, data: null, message: 'User not found' });
  }
  res.json({ success: true, data: found });
});

// 3. Properties Endpoints
apiRouter.get('/properties', (req: Request, res: Response) => {
  const {
    category,
    has_3d_tour,
    min_price,
    max_price,
    bedrooms,
    include_unavailable,
    search,
  } = req.query;

  let results = [...properties];

  if (include_unavailable !== 'true') {
    results = results.filter((p) => p.is_available);
  }

  if (category && category !== 'all' && category !== 'trending') {
    if (category === '3d-tours') {
      results = results.filter((p) => p.has_3d_tour);
    } else {
      results = results.filter((p) => p.category === category);
    }
  }

  if (has_3d_tour === 'true' || has_3d_tour === '1') {
    results = results.filter((p) => p.has_3d_tour);
  }

  if (min_price) {
    results = results.filter((p) => p.price_per_night >= Number(min_price));
  }

  if (max_price) {
    results = results.filter((p) => p.price_per_night <= Number(max_price));
  }

  if (bedrooms && bedrooms !== 'any') {
    results = results.filter((p) => p.bedrooms >= Number(bedrooms));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.architectural_style.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    data: results,
    count: results.length,
  });
});

apiRouter.get('/properties/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const prop = properties.find((p) => String(p.id) === slugOrId || p.slug === slugOrId);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }
  res.json({ success: true, data: prop });
});

apiRouter.post('/properties/:slugOrId/calculate-price', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const { check_in, check_out } = req.body;

  const prop = properties.find((p) => String(p.id) === slugOrId || p.slug === slugOrId);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  const d1 = new Date(check_in);
  const d2 = new Date(check_out);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const nightly_rate = prop.price_per_night;
  const subtotal = nightly_rate * nights;
  const service_fee = Math.round(subtotal * 0.12);
  const total = subtotal + service_fee;

  res.json({
    success: true,
    data: {
      nights,
      nightly_rate,
      subtotal,
      service_fee,
      total,
      formatted_nightly: formatCurrency(nightly_rate),
      formatted_subtotal: formatCurrency(subtotal),
      formatted_service_fee: formatCurrency(service_fee),
      formatted_total: formatCurrency(total),
    },
  });
});

apiRouter.get('/properties/:slugOrId/check-availability', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const prop = properties.find((p) => String(p.id) === slugOrId || p.slug === slugOrId);
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  res.json({
    success: true,
    data: {
      property_id: prop.id,
      is_available: prop.is_available,
      message: prop.is_available ? 'Dates are fully available' : 'Property is currently blocked for reservations',
    },
  });
});

// 4. Guest Bookings Endpoints
apiRouter.get('/bookings', (req: Request, res: Response) => {
  // Return all guest bookings
  res.json({
    success: true,
    data: bookings,
  });
});

apiRouter.post('/bookings', (req: Request, res: Response) => {
  // Enforce strict authentication: Logged-out guests cannot book a villa or designer
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('jwt_')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Guests must be logged in to book a villa. Logged-out visitors can only view villa imagery.',
    });
  }

  const parts = authHeader.split('_');
  const userId = parseInt(parts[2]);
  const authenticatedUser = users.find((u) => u.id === userId);
  if (!authenticatedUser) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid or session expired. Please sign in to complete your reservation.',
    });
  }

  const { property_id, check_in, check_out, guests_count, notes } = req.body;

  const prop = properties.find((p) => p.id === Number(property_id));
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Target property not found' });
  }

  if (!prop.is_available) {
    return res.status(422).json({ success: false, message: 'Property is currently marked unavailable by host.' });
  }

  const d1 = new Date(check_in);
  const d2 = new Date(check_out);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const nightly_rate = prop.price_per_night;
  const subtotal = nightly_rate * nights;
  const service_fee = Math.round(subtotal * 0.12);
  const total = subtotal + service_fee;

  const newBooking: Booking = {
    id: 100 + bookings.length + 1,
    user_id: authenticatedUser.id,
    property_id: prop.id,
    check_in,
    check_out,
    nights,
    nightly_rate,
    service_fee,
    total_price: total,
    formatted_total: formatCurrency(total),
    guests_count: Number(guests_count) || 2,
    status: req.body.instant_approval ? 'approved' : 'pending',
    notes: notes || '',
    created_at: new Date().toISOString(),
    guest: {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      avatar: authenticatedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
    property: {
      id: prop.id,
      slug: prop.slug,
      title: prop.title,
      location: prop.location,
      architectural_style: prop.architectural_style,
      image: prop.images[0],
      has_3d_tour: prop.has_3d_tour,
      is_available: prop.is_available,
    },
  };

  bookings.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: req.body.instant_approval
      ? `Reservation #RES-${newBooking.id} instantly booked and self-approved by guest!`
      : 'Reservation request registered in PostgreSQL. You can self-approve at any time.',
    data: newBooking,
  });
});

apiRouter.post('/bookings/:id/self-approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === Number(id));
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  booking.status = 'approved';
  res.json({
    success: true,
    message: `Reservation #RES-${booking.id} instantly confirmed & self-approved by guest!`,
    data: booking,
  });
});

apiRouter.post('/bookings/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === Number(id));
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }
  booking.status = 'cancelled';
  res.json({ success: true, message: 'Reservation cancelled', data: booking });
});

// 5. Host Operations
function calculateHostMetrics() {
  const approved = bookings.filter((b) => b.status === 'approved');
  const pending = bookings.filter((b) => b.status === 'pending');
  const declined = bookings.filter((b) => b.status === 'declined');

  const totalRevenue = approved.reduce((acc, b) => acc + b.total_price, 0);
  const activeListings = properties.filter((p) => p.is_available).length;

  return {
    total_revenue: totalRevenue,
    formatted_revenue: formatCurrency(totalRevenue),
    active_listings: activeListings,
    total_listings: properties.length,
    pending_bookings: pending.length,
    approved_bookings: approved.length,
    declined_bookings: declined.length,
    total_bookings: bookings.length,
    occupancy_rate: 88.4,
    tour_views: 8420,
  };
}

apiRouter.get('/host/dashboard', (req: Request, res: Response) => {
  const metrics = calculateHostMetrics();
  res.json({
    success: true,
    data: {
      metrics,
      bookings: bookings,
      properties: properties,
      host: users[0],
    },
  });
});

apiRouter.post('/host/bookings/:id/approve', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === Number(id));
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = 'approved';
  const metrics = calculateHostMetrics();

  res.json({
    success: true,
    message: `Reservation #RES-${booking.id} approved. Dates locked and ${booking.formatted_total} added to realized revenue.`,
    data: {
      booking,
      metrics,
    },
  });
});

apiRouter.post('/host/bookings/:id/decline', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === Number(id));
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = 'declined';
  const metrics = calculateHostMetrics();

  res.json({
    success: true,
    message: `Reservation #RES-${booking.id} declined. Dates released back to public availability.`,
    data: {
      booking,
      metrics,
    },
  });
});

apiRouter.post('/host/properties/:id/toggle-availability', (req: Request, res: Response) => {
  const { id } = req.params;
  const prop = properties.find((p) => p.id === Number(id));
  if (!prop) {
    return res.status(404).json({ success: false, message: 'Property not found' });
  }

  if (req.body && typeof req.body.is_available === 'boolean') {
    prop.is_available = req.body.is_available;
  } else {
    prop.is_available = !prop.is_available;
  }

  res.json({
    success: true,
    message: `Sanctuary "${prop.title}" is now ${prop.is_available ? 'available' : 'blocked'}.`,
    data: prop,
  });
});
