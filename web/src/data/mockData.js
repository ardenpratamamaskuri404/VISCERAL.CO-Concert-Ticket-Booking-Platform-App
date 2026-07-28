export const INITIAL_ARTISTS = [
  {
    id: 'art-1',
    name: 'Sheila On 7',
    bio: 'Grup musik pop rock legendaris Indonesia asal Yogyakarta yang berdiri sejak 1996.',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    headliner: true
  },
  {
    id: 'art-2',
    name: 'Hindia',
    bio: 'Proyek solo dari Baskara Putra, membawa nuansa pop alternatif dengan lirik puitis dan kritis.',
    photoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
    headliner: true
  },
  {
    id: 'art-3',
    name: '.Feast',
    bio: 'Grup musik rock asal Jakarta yang terkenal dengan narasi isu sosial dan politik yang kuat.',
    photoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    headliner: false
  },
  {
    id: 'art-4',
    name: 'Raisa Andriana',
    bio: 'Penyanyi pop R&B wanita terkemuka Indonesia dengan vokal sopran murni dan karya hits nasional.',
    photoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    headliner: false
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'VISCERAL FESTIVAL 2026: THE RESONANCE',
    description: 'Konser terbesar tahun 2026 persembahan VISCERAL.CO menghadirkan kolaborasi mahakarya musisi papan atas Indonesia dengan tata lampu obsidian-gold spektakuler dan sound system L-Acoustics K1.',
    venueName: 'Gelora Bung Karno Stadium, Jakarta',
    venueAddress: 'Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat',
    latitude: -6.2186,
    longitude: 106.8024,
    eventDate: '2026-10-15T19:00:00.000Z',
    bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    salesClosed: false,
    createdById: 'user-admin-1',
    createdAt: '2026-06-01T10:00:00.000Z',
    artists: [
      { artistId: 'art-1', isHeadliner: true },
      { artistId: 'art-2', isHeadliner: true },
      { artistId: 'art-3', isHeadliner: false }
    ],
    categories: [
      { id: 'cat-1', name: 'VIP VISCERAL EMERALD', price: 2500000, totalSeats: 50 },
      { id: 'cat-2', name: 'CAT 1 FRONT STAGE', price: 1500000, totalSeats: 100 },
      { id: 'cat-3', name: 'CAT 2 TRIBUNE A', price: 850000, totalSeats: 150 },
      { id: 'cat-4', name: 'CAT 3 TRIBUNE B', price: 500000, totalSeats: 200 }
    ]
  },
  {
    id: 'evt-2',
    title: 'HINDIA: MENARI DALAM BAYANGAN TOUR',
    description: 'Tur tunggal intim Hindia membawakan album terbaru dengan aransemen orkestra khusus dan visual immersive.',
    venueName: 'Indonesia Convention Exhibition (ICE) BSD, Tangerang',
    venueAddress: 'Jl. BSD Grand Boulevard No.1, Pagedangan, Kab. Tangerang',
    latitude: -6.3005,
    longitude: 106.6385,
    eventDate: '2026-11-20T20:00:00.000Z',
    bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    salesClosed: false,
    createdById: 'user-admin-1',
    createdAt: '2026-06-10T12:00:00.000Z',
    artists: [
      { artistId: 'art-2', isHeadliner: true }
    ],
    categories: [
      { id: 'cat-21', name: 'VIP FESTIVAL', price: 1800000, totalSeats: 60 },
      { id: 'cat-22', name: 'GENERAL ADMISSION', price: 750000, totalSeats: 120 }
    ]
  },
  {
    id: 'evt-3',
    title: 'RAISA NIGHT OF ACOUSTIC ELEGANCE',
    description: 'Malam syahdu bersama Raisa dalam konser akustik eksklusif dengan kapasitas sangat terbatas.',
    venueName: 'Taman Ismail Marzuki, Jakarta Pusat',
    venueAddress: 'Jl. Cikini Raya No.73, Menteng, Jakarta Pusat',
    latitude: -6.1901,
    longitude: 106.8384,
    eventDate: '2026-12-05T19:30:00.000Z',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    salesClosed: true, // Penjualan Ditutup contoh
    createdById: 'user-admin-1',
    createdAt: '2026-05-01T08:00:00.000Z',
    artists: [
      { artistId: 'art-4', isHeadliner: true }
    ],
    categories: [
      { id: 'cat-31', name: 'DIAMOND ROYAL', price: 3000000, totalSeats: 30 },
      { id: 'cat-32', name: 'GOLD BALCONY', price: 1200000, totalSeats: 80 }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'VSC-20261015-8842',
    customerId: 'user-cust-1',
    customerName: 'Budi Pratama',
    customerEmail: 'budi@gmail.com',
    customerPhone: '+6281234567890',
    eventId: 'evt-1',
    eventTitle: 'VISCERAL FESTIVAL 2026: THE RESONANCE',
    totalAmount: 2500000,
    status: 'PAID',
    paymentMethod: 'DOKU_VA',
    paymentChannel: 'BCA Virtual Account',
    dokuReferenceId: 'DOKU-REF-99214',
    paymentProof: null,
    expiresAt: '2026-07-28T18:00:00.000Z',
    createdAt: '2026-07-28T10:15:00.000Z',
    tickets: [
      {
        id: 'tkt-1',
        ticketCode: 'VSC-TK-VIP-A12',
        seatNumber: 'VIP-A12',
        categoryName: 'VIP VISCERAL EMERALD',
        price: 2500000,
        status: 'ACTIVE'
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'VSC-20261015-9931',
    customerId: 'user-cust-2',
    customerName: 'Siti Rahmawati',
    customerEmail: 'siti.rahma@yahoo.com',
    customerPhone: '+6285678901234',
    eventId: 'evt-1',
    eventTitle: 'VISCERAL FESTIVAL 2026: THE RESONANCE',
    totalAmount: 1500000,
    status: 'PENDING',
    paymentMethod: 'MANUAL_TRANSFER',
    paymentChannel: 'Bank Mandiri (Manual)',
    dokuReferenceId: null,
    paymentProof: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    expiresAt: '2026-07-28T23:59:59.000Z',
    createdAt: '2026-07-28T15:30:00.000Z',
    tickets: [
      {
        id: 'tkt-2',
        ticketCode: 'VSC-TK-CAT1-B04',
        seatNumber: 'CAT1-B04',
        categoryName: 'CAT 1 FRONT STAGE',
        price: 1500000,
        status: 'ACTIVE'
      }
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-superadmin-1',
    fullName: 'Superadmin Visceral',
    email: 'superadmin@visceral.co',
    phoneNumber: '+628111222333',
    role: 'SUPERADMIN',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-admin-1',
    fullName: 'Admin Ops Jakarta',
    email: 'admin@visceral.co',
    phoneNumber: '+628122233344',
    role: 'ADMIN',
    createdAt: '2026-02-15T00:00:00.000Z'
  },
  {
    id: 'user-cust-1',
    fullName: 'Budi Pratama',
    email: 'budi@gmail.com',
    phoneNumber: '+6281234567890',
    role: 'CUSTOMER',
    createdAt: '2026-03-10T00:00:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    userId: 'user-admin-1',
    userName: 'Admin Ops Jakarta',
    userRole: 'ADMIN',
    action: 'APPROVE_ORDER',
    entityId: 'ord-1001',
    metadata: { orderNumber: 'VSC-20261015-8842', amount: 2500000 },
    createdAt: '2026-07-28T10:16:00.000Z'
  },
  {
    id: 'log-2',
    userId: 'user-superadmin-1',
    userName: 'Superadmin Visceral',
    userRole: 'SUPERADMIN',
    action: 'PUBLISH_EVENT',
    entityId: 'evt-1',
    metadata: { title: 'VISCERAL FESTIVAL 2026: THE RESONANCE' },
    createdAt: '2026-06-01T10:00:00.000Z'
  }
];
