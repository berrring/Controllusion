import { getDatabase, getSession, saveDatabase, saveSession, clearSession } from './storage';

const NETWORK_DELAY = 280;

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function withoutPassword(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function parseBody(config) {
  if (!config.data) {
    return {};
  }

  if (typeof config.data === 'string') {
    return JSON.parse(config.data);
  }

  return config.data;
}

function response(config, status, data) {
  return {
    config,
    data,
    headers: {},
    request: {},
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
  };
}

function createError(config, status, message, extra = {}) {
  const error = new Error(message);
  error.isAxiosError = true;
  error.config = config;
  error.response = response(config, status, {
    message,
    ...extra,
  });
  return error;
}

function getPath(url = '/', baseURL = '') {
  const pathname = new URL(url, `http://localhost${baseURL}`).pathname;
  if (pathname === '/api') {
    return '/';
  }

  return pathname.startsWith('/api/') ? pathname.slice(4) : pathname;
}

function getAuthUser() {
  const session = getSession();
  if (!session?.userId) {
    return null;
  }

  const database = getDatabase();
  return database.users.find((user) => user.id === session.userId) || null;
}

function requireUser(config) {
  const user = getAuthUser();
  if (!user) {
    throw createError(config, 401, 'Please sign in to continue.');
  }

  if (!user.isActive) {
    throw createError(config, 403, 'This account is currently disabled.');
  }

  return user;
}

function requireAdmin(config) {
  const user = requireUser(config);
  if (user.role !== 'Admin') {
    throw createError(config, 403, 'You do not have permission to view this resource.');
  }
  return user;
}

function addCustomerActivity(customer, title, description) {
  const timeline = customer.timeline || [];
  timeline.unshift({
    id: generateId('evt'),
    type: 'Update',
    title,
    description,
    date: new Date().toISOString(),
  });
  customer.timeline = timeline;
  return customer;
}

function buildDashboardSummary(database) {
  const customers = database.customers;
  const wonCustomers = customers.filter((customer) => customer.stage === 'Won');
  const activeDeals = customers.filter((customer) => ['Negotiation', 'Proposal', 'Qualified'].includes(customer.stage));
  const pipelineValue = customers.reduce((sum, customer) => sum + Number(customer.dealValue || 0), 0);
  const conversionRate = customers.length ? Math.round((wonCustomers.length / customers.length) * 100) : 0;
  const recentActivity = [...customers]
    .flatMap((customer) =>
      (customer.timeline || []).map((item) => ({
        ...item,
        customerId: customer.id,
        customerName: customer.fullName,
      })),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenue = [48, 56, 63, 58, 71, 76].map((base, index) => ({
    name: months[index],
    revenue: base * 1000 + activeDeals.length * 180,
    deals: Math.max(5, Math.round(base / 10)),
  }));

  return {
    totalCustomers: customers.length,
    activeDeals: activeDeals.length,
    pipelineValue,
    conversionRate,
    revenue,
    activity: recentActivity,
    tasks: database.tasks,
    notifications: database.notifications,
  };
}

async function handleRequest(config) {
  const method = config.method?.toLowerCase() || 'get';
  const path = getPath(config.url, config.baseURL);
  const database = getDatabase();

  if (path === '/auth/login' && method === 'post') {
    const { email, password } = parseBody(config);
    const user = database.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      throw createError(config, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw createError(config, 403, 'Your account is disabled. Contact an administrator.');
    }

    const session = {
      token: `token_${user.id}_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    saveSession(session);

    return { status: 200, data: { token: session.token, user: withoutPassword(user) } };
  }

  if (path === '/auth/register' && method === 'post') {
    const { fullName, email, password } = parseBody(config);
    const existing = database.users.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      throw createError(config, 409, 'An account with this email already exists.');
    }

    const newUser = {
      id: generateId('usr'),
      fullName,
      email,
      password,
      role: 'User',
      isActive: true,
      title: 'Sales Representative',
      phone: '',
      themePreference: 'light',
      createdAt: new Date().toISOString(),
    };

    database.users.unshift(newUser);
    saveDatabase(database);

    const session = {
      token: `token_${newUser.id}_${Date.now()}`,
      userId: newUser.id,
      createdAt: new Date().toISOString(),
    };
    saveSession(session);

    return { status: 201, data: { token: session.token, user: withoutPassword(newUser) } };
  }

  if (path === '/auth/me' && method === 'get') {
    const user = requireUser(config);
    return { status: 200, data: withoutPassword(user) };
  }

  if (path === '/auth/profile' && method === 'patch') {
    const authUser = requireUser(config);
    const payload = parseBody(config);
    const currentUser = database.users.find((user) => user.id === authUser.id);

    const duplicate = database.users.find(
      (user) => user.id !== authUser.id && user.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (duplicate) {
      throw createError(config, 409, 'This email is already in use by another account.');
    }

    Object.assign(currentUser, {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || '',
      title: payload.title || '',
      themePreference: payload.themePreference || currentUser.themePreference || 'light',
    });
    saveDatabase(database);
    return { status: 200, data: withoutPassword(currentUser) };
  }

  if (path === '/auth/change-password' && method === 'post') {
    const authUser = requireUser(config);
    const payload = parseBody(config);
    const currentUser = database.users.find((user) => user.id === authUser.id);

    if (currentUser.password !== payload.currentPassword) {
      throw createError(config, 400, 'Current password is incorrect.');
    }

    currentUser.password = payload.newPassword;
    saveDatabase(database);
    return { status: 200, data: { message: 'Password updated successfully.' } };
  }

  if (path === '/auth/logout' && method === 'post') {
    clearSession();
    return { status: 200, data: { success: true } };
  }

  if (path === '/dashboard/summary' && method === 'get') {
    requireUser(config);
    return { status: 200, data: buildDashboardSummary(database) };
  }

  if (path === '/customers' && method === 'get') {
    requireUser(config);
    const customers = [...database.customers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { status: 200, data: customers };
  }

  if (path === '/customers' && method === 'post') {
    const authUser = requireUser(config);
    const payload = parseBody(config);

    const newCustomer = addCustomerActivity(
      {
        id: generateId('cus'),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        jobTitle: payload.jobTitle || '',
        status: payload.status,
        stage: payload.stage,
        dealValue: Number(payload.dealValue),
        notes: payload.notes || '',
        createdAt: new Date().toISOString(),
        lastContactedAt: new Date().toISOString(),
        ownerId: authUser.id,
        location: payload.location || 'Remote',
        industry: payload.industry || 'General',
        timeline: [],
        deals: [
          {
            id: generateId('deal'),
            title: `${payload.company} opportunity`,
            amount: Number(payload.dealValue),
            stage: payload.stage,
            closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        noteEntries: payload.notes
          ? [
              {
                id: generateId('note'),
                author: authUser.fullName,
                body: payload.notes,
                date: new Date().toISOString(),
              },
            ]
          : [],
      },
      'Customer record created',
      `${authUser.fullName} added ${payload.fullName} to the CRM.`,
    );

    database.customers.unshift(newCustomer);
    saveDatabase(database);
    return { status: 201, data: newCustomer };
  }

  if (path.startsWith('/customers/') && method === 'get') {
    requireUser(config);
    const customerId = path.split('/')[2];
    const customer = database.customers.find((item) => item.id === customerId);
    if (!customer) {
      throw createError(config, 404, 'Customer not found.');
    }

    return { status: 200, data: customer };
  }

  if (path.startsWith('/customers/') && method === 'patch') {
    const authUser = requireUser(config);
    const customerId = path.split('/')[2];
    const payload = parseBody(config);
    const customer = database.customers.find((item) => item.id === customerId);

    if (!customer) {
      throw createError(config, 404, 'Customer not found.');
    }

    Object.assign(customer, {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      jobTitle: payload.jobTitle || '',
      status: payload.status,
      stage: payload.stage,
      dealValue: Number(payload.dealValue),
      notes: payload.notes || '',
      location: payload.location || customer.location || 'Remote',
      industry: payload.industry || customer.industry || 'General',
      lastContactedAt: new Date().toISOString(),
    });

    customer.deals = (customer.deals || []).map((deal, index) =>
      index === 0
        ? {
            ...deal,
            amount: Number(payload.dealValue),
            stage: payload.stage,
            title: `${payload.company} opportunity`,
          }
        : deal,
    );

    if (payload.notes) {
      customer.noteEntries = [
        {
          id: generateId('note'),
          author: authUser.fullName,
          body: payload.notes,
          date: new Date().toISOString(),
        },
        ...(customer.noteEntries || []),
      ].slice(0, 5);
    }

    addCustomerActivity(
      customer,
      'Customer record updated',
      `${authUser.fullName} updated key account details and pipeline context.`,
    );

    saveDatabase(database);
    return { status: 200, data: customer };
  }

  if (path.startsWith('/customers/') && method === 'delete') {
    requireUser(config);
    const customerId = path.split('/')[2];
    const customerIndex = database.customers.findIndex((item) => item.id === customerId);

    if (customerIndex === -1) {
      throw createError(config, 404, 'Customer not found.');
    }

    database.customers.splice(customerIndex, 1);
    saveDatabase(database);
    return { status: 200, data: { success: true } };
  }

  if (path === '/users' && method === 'get') {
    requireAdmin(config);
    return { status: 200, data: database.users.map(withoutPassword) };
  }

  if (path === '/users/invite' && method === 'post') {
    requireAdmin(config);
    const payload = parseBody(config);

    const existing = database.users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      throw createError(config, 409, 'A user with this email already exists.');
    }

    const invitedUser = {
      id: generateId('usr'),
      fullName: payload.fullName,
      email: payload.email,
      password: 'Welcome@123',
      role: payload.role || 'User',
      isActive: true,
      title: payload.title || 'Team Member',
      phone: '',
      themePreference: 'light',
      createdAt: new Date().toISOString(),
    };

    database.users.unshift(invitedUser);
    saveDatabase(database);
    return {
      status: 201,
      data: {
        ...withoutPassword(invitedUser),
        temporaryPassword: 'Welcome@123',
      },
    };
  }

  if (path.startsWith('/users/') && method === 'patch') {
    requireAdmin(config);
    const userId = path.split('/')[2];
    const payload = parseBody(config);
    const targetUser = database.users.find((user) => user.id === userId);

    if (!targetUser) {
      throw createError(config, 404, 'User not found.');
    }

    Object.assign(targetUser, {
      role: payload.role ?? targetUser.role,
      isActive: payload.isActive ?? targetUser.isActive,
    });

    saveDatabase(database);
    return { status: 200, data: withoutPassword(targetUser) };
  }

  throw createError(config, 404, `No mock route found for ${method.toUpperCase()} ${path}`);
}

export function attachMockAdapter(client) {
  client.defaults.adapter = async (config) => {
    await delay(NETWORK_DELAY);

    try {
      const result = await handleRequest(config);
      return response(config, result.status, result.data);
    } catch (error) {
      throw error;
    }
  };
}
