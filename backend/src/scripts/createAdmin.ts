import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Criando utilizador administrador...\n');

    // Dados do admin
    const adminData = {
      email: 'admin@refit.pt',
      password: 'Admin@2026',
      name: 'Administrador REFIT',
      role: 'admin',
    };

    // Verificar se já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin já existe!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Nome: ${existingAdmin.name}`);
      console.log('\n💡 Para alterar a senha, elimine o utilizador primeiro.\n');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name,
        role: adminData.role,
      },
    });

    console.log('✅ Administrador criado com sucesso!\n');
    console.log('📋 CREDENCIAIS DE ACESSO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminData.email}`);
    console.log(`🔑 Senha:    ${adminData.password}`);
    console.log(`👤 Nome:     ${admin.name}`);
    console.log(`🆔 ID:       ${admin.id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');
    console.log('🌐 Acesse: http://localhost:5173\n');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
