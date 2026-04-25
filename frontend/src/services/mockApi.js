import { getSession } from './storage';

const MOCK_DB_KEY = 'controllusion_mock_db_v1';
const MOCK_DELAY_MS = 140;
const TEMP_PASSWORD = 'Welcome@123';

function daysAgo(value) {
  return new Date(Date.now() - value * 24 * 60 * 60 * 1000).toISOString();
}

const SEED_USERS = [
  {
    id: '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
    fullName: 'Admin One',
    email: 'admin@controllusion.com',
    password: 'Admin@123',
    role: 'Admin',
    isActive: true,
    title: 'CRM Administrator',
    phone: '+1 555 010 001',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(4),
  },
  {
    id: '8b348114-f0d8-4524-87dd-c64b5304a6c0',
    fullName: 'Sara Kim',
    email: 'sara@controllusion.com',
    password: 'User@1234',
    role: 'User',
    isActive: true,
    title: 'Account Executive',
    phone: '+1 555 010 002',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: daysAgo(21),
    updatedAt: daysAgo(3),
  },
  {
    id: 'b4da1f6f-a70b-4c94-8b4d-9aa1a40cc201',
    fullName: 'Ethan Cole',
    email: 'ethan@controllusion.com',
    password: 'User@1234',
    role: 'User',
    isActive: true,
    title: 'Sales Development Rep',
    phone: '+1 555 010 003',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: daysAgo(17),
    updatedAt: daysAgo(2),
  },
  {
    id: 'fa01870c-9bc7-4f14-9f6d-6a2f9fa40c11',
    fullName: 'Olivia Hart',
    email: 'olivia@controllusion.com',
    password: 'User@1234',
    role: 'User',
    isActive: false,
    title: 'Customer Success Manager',
    phone: '+1 555 010 004',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(8),
  },
  {
    id: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Ariana Vale',
    email: 'showcase@controllusion.com',
    password: 'Showcase@123',
    role: 'User',
    isActive: true,
    title: 'Revenue Strategist',
    phone: '+1 555 010 005',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(1),
  },
];

const DEMO_LOGIN_ALIASES = {
  admin: 'admin@controllusion.com',
  showcase: 'showcase@controllusion.com',
  demo: 'showcase@controllusion.com',
};

const SEED_CUSTOMERS = [
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a001',
    ownerId: '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
    fullName: 'Ava Collins',
    email: 'ava@northline.io',
    phone: '+1 555 201 001',
    company: 'Northline Studio',
    jobTitle: 'Revenue Director',
    status: 'Active',
    stage: 'Negotiation',
    dealValue: 24000,
    notes: 'Requested a tailored reporting demo for the executive team.',
    location: 'Austin, TX',
    industry: 'Software',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(2),
    lastContactedAt: daysAgo(2),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a002',
    ownerId: '8b348114-f0d8-4524-87dd-c64b5304a6c0',
    fullName: 'Jordan Blake',
    email: 'jordan@silverpeak.co',
    phone: '+1 555 201 002',
    company: 'Silver Peak Co',
    jobTitle: 'Operations Lead',
    status: 'New',
    stage: 'Lead',
    dealValue: 9800,
    notes: 'New inbound lead from the product landing page.',
    location: 'Denver, CO',
    industry: 'Manufacturing',
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
    lastContactedAt: daysAgo(1),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a003',
    ownerId: '8b348114-f0d8-4524-87dd-c64b5304a6c0',
    fullName: 'Mina Patel',
    email: 'mina@blueharbor.com',
    phone: '+1 555 201 003',
    company: 'Blue Harbor',
    jobTitle: 'Customer Success Manager',
    status: 'VIP',
    stage: 'Won',
    dealValue: 61000,
    notes: 'Signed annual expansion focused on analytics and forecasting.',
    location: 'Seattle, WA',
    industry: 'Fintech',
    createdAt: daysAgo(25),
    updatedAt: daysAgo(4),
    lastContactedAt: daysAgo(4),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a004',
    ownerId: '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
    fullName: 'Carlos Vega',
    email: 'carlos@orbitworks.ai',
    phone: '+1 555 201 004',
    company: 'Orbit Works',
    jobTitle: 'Founder',
    status: 'Active',
    stage: 'Proposal',
    dealValue: 17500,
    notes: 'Waiting on procurement feedback after sending the proposal.',
    location: 'San Francisco, CA',
    industry: 'AI',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(3),
    lastContactedAt: daysAgo(3),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a005',
    ownerId: '8b348114-f0d8-4524-87dd-c64b5304a6c0',
    fullName: 'Leah Summers',
    email: 'leah@campfirelabs.dev',
    phone: '+1 555 201 005',
    company: 'Campfire Labs',
    jobTitle: 'Growth Manager',
    status: 'Active',
    stage: 'Qualified',
    dealValue: 13200,
    notes: 'Interested in moving from spreadsheets to a shared CRM workflow.',
    location: 'Portland, OR',
    industry: 'SaaS',
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
    lastContactedAt: daysAgo(5),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a006',
    ownerId: '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
    fullName: 'Victor Chen',
    email: 'victor@latticehub.com',
    phone: '+1 555 201 006',
    company: 'Lattice Hub',
    jobTitle: 'Revenue Ops Analyst',
    status: 'Inactive',
    stage: 'Lost',
    dealValue: 8900,
    notes: 'Budget was reassigned to another tool this quarter.',
    location: 'Chicago, IL',
    industry: 'Logistics',
    createdAt: daysAgo(40),
    updatedAt: daysAgo(15),
    lastContactedAt: daysAgo(15),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a007',
    ownerId: '8b348114-f0d8-4524-87dd-c64b5304a6c0',
    fullName: 'Noah Reed',
    email: 'noah@atlasretail.com',
    phone: '+1 555 201 007',
    company: 'Atlas Retail',
    jobTitle: 'Regional Director',
    status: 'Active',
    stage: 'Negotiation',
    dealValue: 28500,
    notes: 'Comparing rollout timeline and onboarding support package.',
    location: 'New York, NY',
    industry: 'Retail',
    createdAt: daysAgo(16),
    updatedAt: daysAgo(1),
    lastContactedAt: daysAgo(1),
  },
  {
    id: '57e1c8d4-52ef-4bf4-bd72-cf1f9d33a008',
    ownerId: '36f7c225-5cf0-4f12-84ad-bd6c936f4f01',
    fullName: 'Emma Torres',
    email: 'emma@ridgehealth.org',
    phone: '+1 555 201 008',
    company: 'Ridge Health',
    jobTitle: 'Program Manager',
    status: 'Active',
    stage: 'Qualified',
    dealValue: 15400,
    notes: 'Needs a cleaner follow-up process for partnership outreach.',
    location: 'Phoenix, AZ',
    industry: 'Healthcare',
    createdAt: daysAgo(20),
    updatedAt: daysAgo(6),
    lastContactedAt: daysAgo(6),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4701',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Iris Bennett',
    email: 'iris@northstarcommerce.com',
    phone: '+1 555 310 001',
    company: 'Northstar Commerce',
    jobTitle: 'VP Revenue',
    status: 'VIP',
    stage: 'Negotiation',
    dealValue: 84500,
    notes: 'Final package review is scheduled with the CFO and operations lead.',
    location: 'Los Angeles, CA',
    industry: 'Retail',
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
    lastContactedAt: daysAgo(1),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4702',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Leo Grant',
    email: 'leo@heliofreight.com',
    phone: '+1 555 310 002',
    company: 'Helio Freight',
    jobTitle: 'Operations Director',
    status: 'Active',
    stage: 'Proposal',
    dealValue: 41200,
    notes: 'Proposal sent with phased rollout and warehouse onboarding package.',
    location: 'Dallas, TX',
    industry: 'Logistics',
    createdAt: daysAgo(14),
    updatedAt: daysAgo(5),
    lastContactedAt: daysAgo(5),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4703',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Mina Torres',
    email: 'mina@pillarhealth.io',
    phone: '+1 555 310 003',
    company: 'Pillar Health',
    jobTitle: 'Head of Partnerships',
    status: 'Active',
    stage: 'Qualified',
    dealValue: 26800,
    notes: 'Qualified after pilot review. Waiting on procurement contact handoff.',
    location: 'Boston, MA',
    industry: 'Healthcare',
    createdAt: daysAgo(18),
    updatedAt: daysAgo(9),
    lastContactedAt: daysAgo(9),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4704',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Owen Clarke',
    email: 'owen@harborstack.com',
    phone: '+1 555 310 004',
    company: 'HarborStack',
    jobTitle: 'COO',
    status: 'VIP',
    stage: 'Won',
    dealValue: 97300,
    notes: 'Annual contract signed with executive onboarding and analytics bundle.',
    location: 'Miami, FL',
    industry: 'SaaS',
    createdAt: daysAgo(38),
    updatedAt: daysAgo(16),
    lastContactedAt: daysAgo(16),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4705',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Nadia Rahim',
    email: 'nadia@auroralabs.ai',
    phone: '+1 555 310 005',
    company: 'Aurora Labs',
    jobTitle: 'Chief of Staff',
    status: 'Active',
    stage: 'Won',
    dealValue: 65400,
    notes: 'Expansion deal closed after data room review and leadership alignment.',
    location: 'Seattle, WA',
    industry: 'AI',
    createdAt: daysAgo(57),
    updatedAt: daysAgo(43),
    lastContactedAt: daysAgo(43),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4706',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Theo Park',
    email: 'theo@summitgrid.com',
    phone: '+1 555 310 006',
    company: 'Summit Grid',
    jobTitle: 'Solutions Lead',
    status: 'New',
    stage: 'Lead',
    dealValue: 18700,
    notes: 'Fresh inbound lead from the enterprise solutions landing page.',
    location: 'Denver, CO',
    industry: 'Energy',
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
    lastContactedAt: daysAgo(3),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4707',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Clara Wells',
    email: 'clara@bluecurrent.co',
    phone: '+1 555 310 007',
    company: 'Blue Current',
    jobTitle: 'Finance Director',
    status: 'Inactive',
    stage: 'Lost',
    dealValue: 12900,
    notes: 'Opportunity paused after budget was reallocated to internal tooling.',
    location: 'Atlanta, GA',
    industry: 'Finance',
    createdAt: daysAgo(73),
    updatedAt: daysAgo(62),
    lastContactedAt: daysAgo(62),
  },
  {
    id: 'a621bdd0-4d50-4f4a-a832-91bf98ba4708',
    ownerId: 'd2a92b8c-0d0e-4f3a-a16a-923c19baf501',
    fullName: 'Evan Brooks',
    email: 'evan@meridiancloud.com',
    phone: '+1 555 310 008',
    company: 'Meridian Cloud',
    jobTitle: 'General Manager',
    status: 'Active',
    stage: 'Won',
    dealValue: 52800,
    notes: 'Signed multi-team rollout with reporting and forecasting add-ons.',
    location: 'Chicago, IL',
    industry: 'Cloud Infrastructure',
    createdAt: daysAgo(109),
    updatedAt: daysAgo(94),
    lastContactedAt: daysAgo(94),
  },
];

function buildSeedDatabase() {
  return {
    users: SEED_USERS.map((item) => ({ ...item })),
    customers: SEED_CUSTOMERS.map((item) => ({ ...item })),
  };
}

function shouldUseMockApi() {
  return import.meta.env.VITE_USE_MOCK_API !== 'false';
}

function wait(value, delay = MOCK_DELAY_MS) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay);
  });
}

function createApiError(message, status = 400) {
  const error = new Error(message);
  error.response = {
    status,
    data: {
      message,
    },
  };
  return error;
}

function mergeSeedCollection(items, seedItems) {
  const currentItems = Array.isArray(items) ? items : [];
  const existingIds = new Set(currentItems.map((item) => item.id));
  return [
    ...currentItems,
    ...seedItems.filter((item) => !existingIds.has(item.id)).map((item) => ({ ...item })),
  ];
}

function normalizeStoredEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function mergeSeedUsers(items, seedUsers) {
  const currentUsers = Array.isArray(items) ? items.map((item) => ({ ...item })) : [];
  const seedEmails = new Set(seedUsers.map((item) => normalizeStoredEmail(item.email)));
  const usedIndexes = new Set();
  const mergedSeeds = seedUsers.map((seedUser) => {
    const seedEmail = normalizeStoredEmail(seedUser.email);
    const existingIndex = currentUsers.findIndex(
      (user, index) =>
        !usedIndexes.has(index) &&
        (user.id === seedUser.id || normalizeStoredEmail(user.email) === seedEmail),
    );

    if (existingIndex === -1) {
      return { ...seedUser };
    }

    usedIndexes.add(existingIndex);
    return {
      ...currentUsers[existingIndex],
      ...seedUser,
      password: seedUser.password,
      email: seedUser.email,
      role: seedUser.role,
      isActive: seedUser.isActive,
    };
  });

  const customUsers = currentUsers.filter(
    (user, index) => !usedIndexes.has(index) && !seedEmails.has(normalizeStoredEmail(user.email)),
  );

  return [...mergedSeeds, ...customUsers];
}

function upgradeDatabase(database) {
  const previousUsers = JSON.stringify(Array.isArray(database?.users) ? database.users : []);
  const previousCustomers = JSON.stringify(Array.isArray(database?.customers) ? database.customers : []);
  const nextDatabase = {
    users: mergeSeedUsers(database?.users, SEED_USERS),
    customers: mergeSeedCollection(database?.customers, SEED_CUSTOMERS),
  };

  const usersChanged = JSON.stringify(nextDatabase.users) !== previousUsers;
  const customersChanged = JSON.stringify(nextDatabase.customers) !== previousCustomers;

  if (usersChanged || customersChanged) {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(nextDatabase));
  }

  return nextDatabase;
}

function getDatabase() {
  try {
    const stored = localStorage.getItem(MOCK_DB_KEY);
    if (!stored) {
      const seed = buildSeedDatabase();
      localStorage.setItem(MOCK_DB_KEY, JSON.stringify(seed));
      return seed;
    }

    return upgradeDatabase(JSON.parse(stored));
  } catch (error) {
    const seed = buildSeedDatabase();
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveDatabase(database) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(database));
  return database;
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `mock_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function normalizeEmail(email) {
  return normalizeStoredEmail(email);
}

function normalizeLoginIdentifier(identifier) {
  const normalized = normalizeStoredEmail(identifier);
  return DEMO_LOGIN_ALIASES[normalized] || normalized;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.isActive),
    title: user.title || '',
    phone: user.phone || '',
    themePreference: user.themePreference || 'light',
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function getVisibleCustomers(database, user) {
  if (user.role === 'Admin') {
    return database.customers;
  }

  return database.customers.filter((customer) => customer.ownerId === user.id);
}

function getUserBySession(database = getDatabase()) {
  const session = getSession();
  if (!session?.userId) {
    throw createApiError('Authentication is required.', 401);
  }

  const user = database.users.find((item) => item.id === session.userId);
  if (!user) {
    throw createApiError('Authentication is required.', 401);
  }

  if (!user.isActive) {
    throw createApiError('This account is disabled. Contact an administrator.', 403);
  }

  return user;
}

function ensureAdmin(database = getDatabase()) {
  const user = getUserBySession(database);
  if (user.role !== 'Admin') {
    throw createApiError('You do not have permission to access this resource.', 403);
  }

  return user;
}

function buildCustomerTimeline(customer) {
  const timeline = [
    {
      id: `${customer.id}:created`,
      type: 'Create',
      title: 'Customer record created',
      description: `${customer.fullName} was added to the CRM.`,
      date: customer.createdAt,
    },
  ];

  if (customer.updatedAt && customer.updatedAt !== customer.createdAt) {
    timeline.push({
      id: `${customer.id}:updated`,
      type: 'Update',
      title: 'Customer record updated',
      description: 'Account profile, status, or commercial data changed.',
      date: customer.updatedAt,
    });
  }

  if (customer.lastContactedAt) {
    timeline.push({
      id: `${customer.id}:contact`,
      type: 'Follow-up',
      title: 'Customer touchpoint logged',
      description: 'Most recent outreach or follow-up checkpoint.',
      date: customer.lastContactedAt,
    });
  }

  return timeline.sort((left, right) => new Date(right.date) - new Date(left.date));
}

function buildCustomerDeals(customer) {
  const closeDate = new Date(customer.updatedAt || customer.createdAt);
  closeDate.setDate(closeDate.getDate() + 14);

  return [
    {
      id: `${customer.id}:deal`,
      title: `${customer.company} opportunity`,
      amount: Number(customer.dealValue || 0),
      stage: customer.stage,
      closeDate: closeDate.toISOString(),
    },
  ];
}

function buildCustomerNotes(customer, author) {
  if (!customer.notes?.trim()) {
    return [];
  }

  return [
    {
      id: `${customer.id}:note`,
      author,
      body: customer.notes,
      date: customer.updatedAt || customer.createdAt,
    },
  ];
}

function mapCustomer(customer, database) {
  const owner = database.users.find((item) => item.id === customer.ownerId);

  return {
    id: customer.id,
    fullName: customer.fullName,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    jobTitle: customer.jobTitle || '',
    status: customer.status,
    stage: customer.stage,
    dealValue: Number(customer.dealValue || 0),
    notes: customer.notes || '',
    location: customer.location || '',
    industry: customer.industry || '',
    lastContactedAt: customer.lastContactedAt,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    timeline: buildCustomerTimeline(customer),
    deals: buildCustomerDeals(customer),
    noteEntries: buildCustomerNotes(customer, owner?.fullName || 'Controllusion'),
  };
}

function assertUniqueUserEmail(database, email, excludedUserId = null) {
  const normalized = normalizeEmail(email);
  const exists = database.users.some((user) => user.email === normalized && user.id !== excludedUserId);
  if (exists) {
    throw createApiError('An account with this email already exists.', 409);
  }
}

function assertUniqueCustomerEmail(database, email, excludedCustomerId = null) {
  const normalized = normalizeEmail(email);
  const exists = database.customers.some((customer) => customer.email === normalized && customer.id !== excludedCustomerId);
  if (exists) {
    throw createApiError('A customer with this email already exists.', 409);
  }
}

async function login(credentials) {
  const database = getDatabase();
  const email = normalizeLoginIdentifier(credentials.email || '');
  const password = String(credentials.password || '').trim();
  const user = database.users.find((item) => normalizeEmail(item.email) === email);

  if (!user || user.password !== password) {
    throw createApiError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw createApiError('Your account is disabled. Contact an administrator.', 403);
  }

  return wait({
    token: `mock-token-${user.id}-${Date.now()}`,
    user: sanitizeUser(user),
  });
}

async function register(payload) {
  if (payload.password !== payload.confirmPassword) {
    throw createApiError('Passwords do not match.', 400);
  }

  const database = getDatabase();
  assertUniqueUserEmail(database, payload.email);

  const now = new Date().toISOString();
  const user = {
    id: createId(),
    fullName: payload.fullName.trim(),
    email: normalizeEmail(payload.email),
    password: payload.password,
    role: 'User',
    isActive: true,
    title: '',
    phone: '',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
  };

  database.users.unshift(user);
  saveDatabase(database);

  return wait({
    token: `mock-token-${user.id}-${Date.now()}`,
    user: sanitizeUser(user),
  });
}

async function requestPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email || '');
  if (!normalizedEmail) {
    throw createApiError('Enter your email address first.', 400);
  }

  const database = getDatabase();
  const user = database.users.find((item) => item.email === normalizedEmail);

  if (!user) {
    throw createApiError('No account exists with this email.', 404);
  }

  user.password = TEMP_PASSWORD;
  user.updatedAt = new Date().toISOString();
  saveDatabase(database);

  return wait({
    success: true,
    message: `Password reset complete. Use temporary password: ${TEMP_PASSWORD}`,
    temporaryPassword: TEMP_PASSWORD,
  });
}

async function getProfile() {
  const database = getDatabase();
  const user = getUserBySession(database);
  return wait(sanitizeUser(user));
}

async function updateProfile(payload) {
  const database = getDatabase();
  const user = getUserBySession(database);
  assertUniqueUserEmail(database, payload.email, user.id);

  user.fullName = payload.fullName.trim();
  user.email = normalizeEmail(payload.email);
  user.phone = payload.phone?.trim() || '';
  user.title = payload.title?.trim() || '';
  user.themePreference = payload.themePreference?.trim() || 'light';
  user.avatarUrl = payload.avatarUrl || null;
  user.updatedAt = new Date().toISOString();

  saveDatabase(database);
  return wait(sanitizeUser(user));
}

async function changePassword(payload) {
  const database = getDatabase();
  const user = getUserBySession(database);

  if (user.password !== payload.currentPassword) {
    throw createApiError('Current password is incorrect.', 400);
  }

  if (payload.newPassword !== payload.confirmNewPassword) {
    throw createApiError('Passwords do not match.', 400);
  }

  user.password = payload.newPassword;
  user.updatedAt = new Date().toISOString();
  saveDatabase(database);

  return wait({
    success: true,
    message: 'Password updated successfully.',
  });
}

async function logout() {
  return wait({
    success: true,
    message: 'Logged out successfully.',
  });
}

async function getUsers() {
  const database = getDatabase();
  ensureAdmin(database);

  return wait(
    database.users
      .slice()
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map(sanitizeUser),
  );
}

async function inviteUser(payload) {
  const database = getDatabase();
  ensureAdmin(database);
  assertUniqueUserEmail(database, payload.email);

  const now = new Date().toISOString();
  const user = {
    id: createId(),
    fullName: payload.fullName.trim(),
    email: normalizeEmail(payload.email),
    password: TEMP_PASSWORD,
    role: payload.role || 'User',
    isActive: true,
    title: payload.title?.trim() || '',
    phone: '',
    themePreference: 'light',
    avatarUrl: null,
    createdAt: now,
    updatedAt: now,
  };

  database.users.unshift(user);
  saveDatabase(database);

  return wait(sanitizeUser(user));
}

async function updateUser(userId, payload) {
  const database = getDatabase();
  const currentUser = ensureAdmin(database);
  const user = database.users.find((item) => item.id === userId);

  if (!user) {
    throw createApiError('User not found.', 404);
  }

  if (payload.email?.trim()) {
    assertUniqueUserEmail(database, payload.email, user.id);
    user.email = normalizeEmail(payload.email);
  }

  if (payload.fullName?.trim()) {
    user.fullName = payload.fullName.trim();
  }

  if (payload.role?.trim()) {
    user.role = payload.role;
  }

  if (typeof payload.isActive === 'boolean') {
    if (currentUser.id === user.id && payload.isActive === false) {
      throw createApiError('You cannot disable your own current account.', 400);
    }
    user.isActive = payload.isActive;
  }

  if (typeof payload.title === 'string') {
    user.title = payload.title.trim();
  }

  if (typeof payload.phone === 'string') {
    user.phone = payload.phone.trim();
  }

  if (typeof payload.avatarUrl === 'string') {
    user.avatarUrl = payload.avatarUrl || null;
  }

  user.updatedAt = new Date().toISOString();
  saveDatabase(database);

  return wait(sanitizeUser(user));
}

async function getCustomers() {
  const database = getDatabase();
  const user = getUserBySession(database);

  return wait(
    getVisibleCustomers(database, user)
      .slice()
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map((customer) => mapCustomer(customer, database)),
  );
}

async function getCustomerById(id) {
  const database = getDatabase();
  const user = getUserBySession(database);
  const customer = getVisibleCustomers(database, user).find((item) => item.id === id);

  if (!customer) {
    throw createApiError('Customer not found.', 404);
  }

  return wait(mapCustomer(customer, database));
}

async function createCustomer(payload) {
  const database = getDatabase();
  const user = getUserBySession(database);
  assertUniqueCustomerEmail(database, payload.email);

  const now = new Date().toISOString();
  const customer = {
    id: createId(),
    ownerId: user.id,
    fullName: payload.fullName.trim(),
    email: normalizeEmail(payload.email),
    phone: payload.phone.trim(),
    company: payload.company.trim(),
    jobTitle: payload.jobTitle?.trim() || '',
    status: payload.status,
    stage: payload.stage,
    dealValue: Number(payload.dealValue || 0),
    notes: payload.notes?.trim() || '',
    location: payload.location?.trim() || '',
    industry: payload.industry?.trim() || '',
    createdAt: now,
    updatedAt: now,
    lastContactedAt: now,
  };

  database.customers.unshift(customer);
  saveDatabase(database);
  return wait(mapCustomer(customer, database));
}

async function updateCustomer(id, payload) {
  const database = getDatabase();
  const user = getUserBySession(database);
  const customer = getVisibleCustomers(database, user).find((item) => item.id === id);

  if (!customer) {
    throw createApiError('Customer not found.', 404);
  }

  assertUniqueCustomerEmail(database, payload.email, id);

  customer.fullName = payload.fullName.trim();
  customer.email = normalizeEmail(payload.email);
  customer.phone = payload.phone.trim();
  customer.company = payload.company.trim();
  customer.jobTitle = payload.jobTitle?.trim() || '';
  customer.status = payload.status;
  customer.stage = payload.stage;
  customer.dealValue = Number(payload.dealValue || 0);
  customer.notes = payload.notes?.trim() || '';
  customer.location = payload.location?.trim() || '';
  customer.industry = payload.industry?.trim() || '';
  customer.updatedAt = new Date().toISOString();
  customer.lastContactedAt = customer.updatedAt;

  saveDatabase(database);
  return wait(mapCustomer(customer, database));
}

async function deleteCustomer(id) {
  const database = getDatabase();
  const user = getUserBySession(database);
  const visibleIds = new Set(getVisibleCustomers(database, user).map((item) => item.id));
  const index = database.customers.findIndex((item) => item.id === id && visibleIds.has(item.id));

  if (index === -1) {
    throw createApiError('Customer not found.', 404);
  }

  database.customers.splice(index, 1);
  saveDatabase(database);

  return wait({
    success: true,
    message: 'Customer deleted successfully.',
  });
}

function getMonthName(dateValue) {
  return new Date(dateValue).toLocaleString('en-US', { month: 'short' });
}

async function getDashboardSummary() {
  const database = getDatabase();
  const user = getUserBySession(database);
  const customers = getVisibleCustomers(database, user).slice();

  const activeDeals = customers.filter((item) => ['Qualified', 'Proposal', 'Negotiation'].includes(item.stage));
  const wonDeals = customers.filter((item) => item.stage === 'Won');
  const totalCustomers = customers.length;
  const pipelineValue = customers.reduce((sum, item) => sum + Number(item.dealValue || 0), 0);
  const conversionRate = totalCustomers ? Math.round((wonDeals.length / totalCustomers) * 100) : 0;

  const recentMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      name: getMonthName(date),
      revenue: 0,
      deals: 0,
    };
  });

  customers.forEach((customer) => {
    const bucketDate = new Date(customer.updatedAt || customer.createdAt);
    const key = `${bucketDate.getFullYear()}-${bucketDate.getMonth()}`;
    const bucket = recentMonths.find((item) => item.key === key);

    if (!bucket) {
      return;
    }

    bucket.deals += 1;
    if (customer.stage === 'Won') {
      bucket.revenue += Number(customer.dealValue || 0);
    }
  });

  const activity = customers
    .slice()
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt))
    .slice(0, 6)
    .map((customer) => ({
      id: `${customer.id}:activity`,
      title: 'Customer pipeline reviewed',
      description: `${customer.fullName} is currently in ${customer.stage} stage.`,
      customerId: customer.id,
      customerName: customer.fullName,
      createdAt: customer.updatedAt,
    }));

  const tasks = activeDeals
    .slice()
    .sort((left, right) => new Date(left.lastContactedAt) - new Date(right.lastContactedAt))
    .slice(0, 5)
    .map((customer) => {
      const owner = database.users.find((item) => item.id === customer.ownerId);
      const dueDate = new Date(customer.lastContactedAt || customer.updatedAt || customer.createdAt);
      dueDate.setDate(dueDate.getDate() + 3);

      return {
        id: `${customer.id}:task`,
        title: `Follow up with ${customer.fullName}`,
        description: `Move ${customer.company} toward the next pipeline step.`,
        owner: owner?.fullName || 'Sales team',
        status: 'Pending',
        dueDate: dueDate.toISOString(),
      };
    });

  return wait({
    totalCustomers,
    activeDeals: activeDeals.length,
    pipelineValue,
    conversionRate,
    revenue: recentMonths.map(({ key, ...item }) => item),
    activity,
    tasks,
  });
}

export const mockApi = {
  auth: {
    login,
    register,
    logout,
    requestPasswordReset,
    getCurrentUser: getProfile,
  },
  profile: {
    getProfile,
    updateProfile,
    changePassword,
  },
  customers: {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  },
  dashboard: {
    getDashboardSummary,
  },
  admin: {
    getUsers,
    inviteUser,
    updateUser,
  },
};

export { shouldUseMockApi };
