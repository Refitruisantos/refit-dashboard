import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding services...');

  // Criar serviços iniciais
  const services = [
    {
      name: 'Pilates',
      description: 'Aulas de Pilates em grupo ou individual',
      price: 15.00,
      duration: 60,
      active: true,
    },
    {
      name: 'Hybrid',
      description: 'Treino funcional combinado com exercícios de força',
      price: 20.00,
      duration: 60,
      active: true,
    },
    {
      name: 'Treino Personalizado',
      description: 'Sessões individuais de treino personalizado',
      price: 35.00,
      duration: 60,
      active: true,
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findUnique({
      where: { name: service.name },
    });

    if (!existing) {
      await prisma.service.create({
        data: service,
      });
      console.log(`✅ Created service: ${service.name}`);
    } else {
      console.log(`⏭️  Service already exists: ${service.name}`);
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
