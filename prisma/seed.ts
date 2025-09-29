import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seeding...');

  //================================================================================
  // 1. DADOS BÁSICOS (Tipos de Solo e Irrigação)
  //================================================================================
  const soilType1 = await prisma.soilType.upsert({
    where: { name: 'Argiloso' },
    update: {},
    create: {
      name: 'Argiloso',
      description: 'Solo com alta capacidade de retenção de água.',
    },
  });
  const soilType2 = await prisma.soilType.upsert({
    where: { name: 'Arenoso' },
    update: {},
    create: {
      name: 'Arenoso',
      description: 'Solo com boa drenagem e aeração.',
    },
  });
  console.log('Tipos de solo inseridos.');

  const irrigationType1 = await prisma.irrigationType.upsert({
    where: { name: 'Aspersão' },
    update: {},
    create: {
      name: 'Aspersão',
      description: 'Simula chuva artificial sobre a cultura.',
    },
  });
  const irrigationType2 = await prisma.irrigationType.upsert({
    where: { name: 'Gotejamento' },
    update: {},
    create: {
      name: 'Gotejamento',
      description: 'Aplica água diretamente na raiz das plantas.',
    },
  });
  console.log('Tipos de irrigação inseridos.');

  //================================================================================
  // 2. PRODUTOS E VARIEDADES
  //================================================================================
  const tomate = await prisma.product.upsert({
    where: { name: 'Tomate' },
    update: {},
    create: { name: 'Tomate' },
  });

  const alface = await prisma.product.upsert({
    where: { name: 'Alface' },
    update: {},
    create: { name: 'Alface' },
  });

  // Criar variedades separadamente - usando findFirst + create para evitar conflitos
  let tomateCereja = await prisma.variety.findFirst({
    where: { name: 'Tomate Cereja', productId: tomate.id },
  });
  if (!tomateCereja) {
    tomateCereja = await prisma.variety.create({
      data: { name: 'Tomate Cereja', productId: tomate.id },
    });
  }

  let tomateItaliano = await prisma.variety.findFirst({
    where: { name: 'Tomate Italiano', productId: tomate.id },
  });
  if (!tomateItaliano) {
    tomateItaliano = await prisma.variety.create({
      data: { name: 'Tomate Italiano', productId: tomate.id },
    });
  }

  let alfaceCrespa = await prisma.variety.findFirst({
    where: { name: 'Alface Crespa', productId: alface.id },
  });
  if (!alfaceCrespa) {
    alfaceCrespa = await prisma.variety.create({
      data: { name: 'Alface Crespa', productId: alface.id },
    });
  }

  let alfaceAmericana = await prisma.variety.findFirst({
    where: { name: 'Alface Americana', productId: alface.id },
  });
  if (!alfaceAmericana) {
    alfaceAmericana = await prisma.variety.create({
      data: { name: 'Alface Americana', productId: alface.id },
    });
  }

  console.log('Produtos e variedades inseridos.');

  //================================================================================
  // 3. PRODUTORES
  //================================================================================
  const producer1 = await prisma.producer.upsert({
    where: { document: '12345678901' },
    update: {},
    create: {
      name: 'João da Silva',
      document: '12345678901',
      email: 'joao.silva@email.com',
      city: 'Porto Alegre',
      street: 'Rua das Flores',
      number: '123',
      zipCode: '90000000',
      phone: '51999991111',
    },
  });
  const producer2 = await prisma.producer.upsert({
    where: { document: '98765432109' },
    update: {},
    create: {
      name: 'Maria Oliveira',
      document: '98765432109',
      email: 'maria.oliveira@email.com',
      city: 'Canoas',
      street: 'Avenida das Árvores',
      number: '456',
      zipCode: '92000000',
      phone: '51988882222',
    },
  });
  console.log('Produtores inseridos.');

  //================================================================================
  // 4. ÁREAS DOS PRODUTORES
  //================================================================================
  console.log('Criando áreas...');

  // Verificar se as áreas já existem antes de criar
  let areaHorta = await prisma.area.findFirst({
    where: { name: 'Horta Principal' },
  });
  if (!areaHorta) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "areas" (name, color, "producerId", "soilTypeId", "irrigationTypeId", polygon, "createdAt", "updatedAt")
      VALUES 
        ('Horta Principal', '#4CAF50', ${producer1.id}, ${soilType2.id}, ${irrigationType2.id}, 
         ST_GeomFromText('POLYGON((-51.22 -30.05, -51.22 -30.02, -51.19 -30.02, -51.19 -30.05, -51.22 -30.05))', 4326), 
         NOW(), NOW());
    `);
  }

  let areaCampo = await prisma.area.findFirst({
    where: { name: 'Campo Leste' },
  });
  if (!areaCampo) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "areas" (name, color, "producerId", "soilTypeId", "irrigationTypeId", polygon, "createdAt", "updatedAt")
      VALUES 
        ('Campo Leste', '#FFC107', ${producer1.id}, ${soilType1.id}, ${irrigationType1.id}, 
         ST_GeomFromText('POLYGON((-51.18 -30.01, -51.18 -29.98, -51.15 -29.98, -51.15 -30.01, -51.18 -30.01))', 4326), 
         NOW(), NOW());
    `);
  }

  let areaPomar = await prisma.area.findFirst({
    where: { name: 'Pomar da Maria' },
  });
  if (!areaPomar) {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "areas" (name, color, "producerId", "soilTypeId", "irrigationTypeId", polygon, "createdAt", "updatedAt")
      VALUES 
        ('Pomar da Maria', '#F44336', ${producer2.id}, ${soilType2.id}, ${irrigationType2.id}, 
         ST_GeomFromText('POLYGON((-51.20 -30.03, -51.20 -30.00, -51.17 -30.00, -51.17 -30.03, -51.20 -30.03))', 4326), 
         NOW(), NOW());
    `);
  }

  // Buscar as áreas criadas para uso posterior
  areaHorta = await prisma.area.findFirst({
    where: { name: 'Horta Principal' },
  });
  areaCampo = await prisma.area.findFirst({ where: { name: 'Campo Leste' } });
  areaPomar = await prisma.area.findFirst({
    where: { name: 'Pomar da Maria' },
  });

  if (!areaHorta || !areaCampo || !areaPomar) {
    throw new Error('Erro ao criar áreas');
  }

  console.log('Áreas dos produtores inseridas.');

  //================================================================================
  // 5. SAFRAS (COM LÓGICA MANUAL)
  //================================================================================
  console.log('Criando ou buscando safras...');
  let safraVerao = await prisma.harvest.findFirst({
    where: { name: 'Safra de Verão 2025' },
  });
  if (!safraVerao) {
    safraVerao = await prisma.harvest.create({
      data: {
        name: 'Safra de Verão 2025',
        startDate: new Date('2025-09-22T00:00:00Z'),
        status: 'Finalizada',
        cycle: 'Verão',
        producerId: producer1.id,
        areas: { connect: [{ id: areaHorta.id }, { id: areaCampo.id }] },
      },
    });
  }

  let safraOutono = await prisma.harvest.findFirst({
    where: { name: 'Safra de Outono 2025' },
  });
  if (!safraOutono) {
    safraOutono = await prisma.harvest.create({
      data: {
        name: 'Safra de Outono 2025',
        startDate: new Date('2025-03-20T00:00:00Z'),
        status: 'Ativa',
        cycle: 'Outono',
        producerId: producer2.id,
        areas: { connect: [{ id: areaPomar.id }] },
      },
    });
  }
  console.log('Safras inseridas.');

  //================================================================================
  // 6. PLANTIOS (COM LÓGICA MANUAL)
  //================================================================================
  console.log('Criando ou buscando plantios...');
  let planting1 = await prisma.planting.findFirst({
    where: { name: 'Plantio de Tomate Cereja - Verão 2025' },
  });
  if (!planting1) {
    planting1 = await prisma.planting.create({
      data: {
        name: 'Plantio de Tomate Cereja - Verão 2025',
        plantingDate: new Date('2025-09-25T00:00:00Z'),
        quantityPlanted: 500.0,
        harvestId: safraVerao.id,
        productId: tomate.id,
        varietyId: tomateCereja.id,
        areas: { connect: [{ id: areaHorta.id }, { id: areaCampo.id }] },
      },
    });
  }

  let planting2 = await prisma.planting.findFirst({
    where: { name: 'Plantio de Alface Crespa - Verão 2025' },
  });
  if (!planting2) {
    planting2 = await prisma.planting.create({
      data: {
        name: 'Plantio de Alface Crespa - Verão 2025',
        plantingDate: new Date('2025-10-01T00:00:00Z'),
        quantityPlanted: 1200.0,
        harvestId: safraVerao.id,
        productId: alface.id,
        varietyId: alfaceCrespa.id,
        areas: { connect: [{ id: areaHorta.id }] },
      },
    });
  }

  let planting3 = await prisma.planting.findFirst({
    where: { name: 'Plantio de Tomate Italiano - Outono 2025' },
  });
  if (!planting3) {
    planting3 = await prisma.planting.create({
      data: {
        name: 'Plantio de Tomate Italiano - Outono 2025',
        plantingDate: new Date('2025-03-25T00:00:00Z'),
        expectedHarvestDate: new Date('2025-06-25T00:00:00Z'),
        quantityPlanted: 300.0,
        harvestId: safraOutono.id,
        productId: tomate.id,
        varietyId: tomateItaliano.id,
        areas: { connect: [{ id: areaPomar.id }] },
      },
    });
  }
  console.log('Plantios inseridos.');

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
