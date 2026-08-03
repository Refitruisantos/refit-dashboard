import { prisma } from './lib/db.js';
import bcrypt from 'bcryptjs';

const SERVICES = [
  { name: 'Personal Training', price: 45, duration: 60 },
  { name: 'Pilates', price: 35, duration: 50 },
  { name: 'Nutrição', price: 60, duration: 45 },
  { name: 'Fisioterapia', price: 50, duration: 60 },
  { name: 'Aulas', price: 25, duration: 45 },
  { name: 'Avaliações', price: 80, duration: 90 },
];

const CATEGORIES = ['Renda', 'Salários', 'Marketing', 'Internet', 'Água', 'Luz', 'Equipamentos', 'Software', 'Outros'];

async function seed() {
  console.log('🌱 Seeding database...');

  await prisma.user.create({
    data: {
      email: 'admin@refit.pt',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin REFIT',
      role: 'admin',
    },
  });

  const services = await Promise.all(
    SERVICES.map((s) =>
      prisma.service.create({
        data: { name: s.name, price: s.price, duration: s.duration, description: `Serviço de ${s.name}` },
      }),
    ),
  );

  const clients = await Promise.all(
    Array.from({ length: 150 }, (_, i) =>
      prisma.client.create({
        data: {
          name: `Cliente ${i + 1}`,
          email: `cliente${i + 1}@example.com`,
          phone: `91${String(i + 1).padStart(7, '0')}`,
          status: i < 140 ? 'active' : 'inactive',
          joinedAt: new Date(Date.UTC(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)),
          lastVisit: i < 140 ? new Date(Date.UTC(2026, 6, Math.floor(Math.random() * 30) + 1)) : undefined,
        },
      }),
    ),
  );

  for (const client of clients.slice(0, 120)) {
    const service = services[Math.floor(Math.random() * services.length)];
    await prisma.subscription.create({
      data: {
        clientId: client.id,
        serviceId: service.id,
        startDate: new Date(Date.UTC(2026, 0, 1)),
        status: 'active',
        price: service.price,
      },
    });
  }

  for (let month = 0; month < 7; month++) {
    for (const client of clients.slice(0, 130)) {
      const service = services[Math.floor(Math.random() * services.length)];
      const sessionsCount = Math.floor(Math.random() * 8) + 1;

      for (let session = 0; session < sessionsCount; session++) {
        await prisma.attendance.create({
          data: {
            clientId: client.id,
            serviceId: service.id,
            date: new Date(Date.UTC(2026, month, Math.floor(Math.random() * 28) + 1, 10 + Math.floor(Math.random() * 8))),
            duration: service.duration,
          },
        });
      }

      await prisma.payment.create({
        data: {
          clientId: client.id,
          amount: service.price * sessionsCount,
          status: Math.random() > 0.1 ? 'paid' : 'pending',
          dueDate: new Date(Date.UTC(2026, month, 5)),
          paidAt: Math.random() > 0.1 ? new Date(Date.UTC(2026, month, Math.floor(Math.random() * 20) + 1)) : undefined,
          method: 'transfer',
          description: `Pagamento ${service.name}`,
        },
      });
    }

    for (const category of CATEGORIES) {
      const amount = category === 'Renda' ? 1850 : category === 'Salários' ? 6400 : Math.random() * 1200 + 200;
      await prisma.expense.create({
        data: {
          category,
          description: `${category} - Mês ${month + 1}`,
          amount,
          status: Math.random() > 0.15 ? 'paid' : 'pending',
          dueDate: new Date(Date.UTC(2026, month, 5)),
          paidAt: Math.random() > 0.15 ? new Date(Date.UTC(2026, month, Math.floor(Math.random() * 20) + 1)) : undefined,
        },
      });
    }
  }

  await Promise.all([
    prisma.goal.create({ data: { metric: 'revenue', target: 32000, unit: 'currency', color: '#16a34a' } }),
    prisma.goal.create({ data: { metric: 'clients', target: 200, unit: 'number', color: '#2563eb' } }),
    prisma.goal.create({ data: { metric: 'profit', target: 12000, unit: 'currency', color: '#7c3aed' } }),
    prisma.goal.create({ data: { metric: 'conversion', target: 50, unit: 'percent', color: '#f97316' } }),
    prisma.goal.create({ data: { metric: 'retention', target: 95, unit: 'percent', color: '#ef4444' } }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('📧 Login: admin@refit.pt / admin123');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
