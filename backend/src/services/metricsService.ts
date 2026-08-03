import { prisma } from '../lib/db.js';

export interface PeriodQuery {
  month: number;
  year: number;
}

function getMonthRange(month: number, year: number) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  return { start, end };
}

function getPreviousMonthRange(month: number, year: number) {
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  return getMonthRange(prevMonth, prevYear);
}

export async function getActiveClients(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);
  const prev = getPreviousMonthRange(query.month, query.year);

  const [current, previous] = await Promise.all([
    prisma.client.count({
      where: {
        status: 'active',
        OR: [
          { lastVisit: { gte: start, lte: end } },
          {
            subscriptions: {
              some: {
                status: 'active',
                startDate: { lte: end },
                OR: [{ endDate: null }, { endDate: { gte: start } }],
              },
            },
          },
        ],
      },
    }),
    prisma.client.count({
      where: {
        status: 'active',
        OR: [
          { lastVisit: { gte: prev.start, lte: prev.end } },
          {
            subscriptions: {
              some: {
                status: 'active',
                startDate: { lte: prev.end },
                OR: [{ endDate: null }, { endDate: { gte: prev.start } }],
              },
            },
          },
        ],
      },
    }),
  ]);

  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  return { value: current, previous, growth, trend: growth > 0.5 ? 'up' : growth < -0.5 ? 'down' : 'flat' } as const;
}

export async function getRevenue(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);
  const prev = getPreviousMonthRange(query.month, query.year);

  const [currentPayments, previousPayments] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: 'paid', paidAt: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: { status: 'paid', paidAt: { gte: prev.start, lte: prev.end } },
      _sum: { amount: true },
    }),
  ]);

  const current = currentPayments._sum.amount ?? 0;
  const previous = previousPayments._sum.amount ?? 0;
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return { value: current, previous, growth, trend: growth > 0.5 ? 'up' : growth < -0.5 ? 'down' : 'flat' } as const;
}

export async function getExpenses(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);
  const prev = getPreviousMonthRange(query.month, query.year);

  const [currentExpenses, previousExpenses] = await Promise.all([
    prisma.expense.aggregate({
      where: { status: 'paid', paidAt: { gte: start, lte: end } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { status: 'paid', paidAt: { gte: prev.start, lte: prev.end } },
      _sum: { amount: true },
    }),
  ]);

  const current = currentExpenses._sum.amount ?? 0;
  const previous = previousExpenses._sum.amount ?? 0;
  const growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return { value: current, previous, growth, trend: growth > 0.5 ? 'up' : growth < -0.5 ? 'down' : 'flat' } as const;
}

export async function getPendingPayments(query: PeriodQuery) {
  const { end } = getMonthRange(query.month, query.year);

  const result = await prisma.payment.aggregate({
    where: { status: 'pending', dueDate: { lte: end } },
    _sum: { amount: true },
    _count: true,
  });

  return { value: result._sum.amount ?? 0, count: result._count };
}

export async function getPendingExpenses(query: PeriodQuery) {
  const { end } = getMonthRange(query.month, query.year);

  const result = await prisma.expense.aggregate({
    where: { status: 'pending', dueDate: { lte: end } },
    _sum: { amount: true },
    _count: true,
  });

  return { value: result._sum.amount ?? 0, count: result._count };
}

export async function getRevenueByService(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);

  const attendances = await prisma.attendance.groupBy({
    by: ['serviceId'],
    where: { date: { gte: start, lte: end } },
    _count: { id: true },
  });

  const services = await prisma.service.findMany();

  return Promise.all(
    services.map(async (service) => {
      const sessions = attendances.find((a) => a.serviceId === service.id)?._count.id ?? 0;
      const revenue = sessions * service.price;

      const clients = await prisma.client.count({
        where: {
          attendances: {
            some: { serviceId: service.id, date: { gte: start, lte: end } },
          },
        },
      });

      return { service: service.name, revenue, sessions, clients };
    }),
  );
}

export async function getClientsBreakdown() {
  const [active, inactive] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.client.count({ where: { status: 'inactive' } }),
  ]);

  const total = active + inactive;
  return {
    active,
    inactive,
    total,
    activePercent: total > 0 ? Number(((active / total) * 100).toFixed(1)) : 0,
    inactivePercent: total > 0 ? Number(((inactive / total) * 100).toFixed(1)) : 0,
  };
}

export async function getNewClients(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);
  const prev = getPreviousMonthRange(query.month, query.year);

  const [current, previous] = await Promise.all([
    prisma.client.count({ where: { joinedAt: { gte: start, lte: end } } }),
    prisma.client.count({ where: { joinedAt: { gte: prev.start, lte: prev.end } } }),
  ]);

  const growthRate = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  return { count: current, previous, growthRate: Number(growthRate.toFixed(1)) };
}

export async function getExpensesByCategory(query: PeriodQuery) {
  const { start, end } = getMonthRange(query.month, query.year);

  const expenses = await prisma.expense.groupBy({
    by: ['category'],
    where: { status: 'paid', paidAt: { gte: start, lte: end } },
    _sum: { amount: true },
  });

  const total = expenses.reduce((sum, e) => sum + (e._sum.amount ?? 0), 0);

  return expenses
    .map((e) => ({
      category: e.category,
      value: e._sum.amount ?? 0,
      percent: total > 0 ? Number((((e._sum.amount ?? 0) / total) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}
