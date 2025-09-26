// import { PrismaClient } from '@prisma/client';

// // Inicializa o Prisma Client
// const prisma = new PrismaClient();

// async function main() {
//   console.log('Iniciando o processo de seeding...');

//   //================================================================================
//   // 1. DADOS BÁSICOS (Tipos de Solo e Irrigação)
//   //================================================================================
//   await prisma.soilType.createMany({
//     data: [
//       { name: 'Argiloso', description: 'Solo com alta capacidade de retenção de água.' },
//       { name: 'Arenoso', description: 'Solo com boa drenagem e aeração.' },
//       { name: 'Humífero', description: 'Solo rico em matéria orgânica, muito fértil.' },
//     ],
//     skipDuplicates: true,
//   });
//   console.log('Tipos de solo inseridos.');

//   await prisma.irrigationType.createMany({
//     data: [
//       { name: 'Aspersão', description: 'Simula chuva artificial sobre a cultura.' },
//       { name: 'Gotejamento', description: 'Aplica água diretamente na raiz das plantas.' },
//       { name: 'Pivô Central', description: 'Estrutura suspensa que gira em torno de um ponto central.' },
//     ],
//     skipDuplicates: true,
//   });
//   console.log('Tipos de irrigação inseridos.');

//   //================================================================================
//   // 2. PRODUTOS DE HORTIFRUTI E VARIEDADES
//   //================================================================================
//   const tomate = await prisma.product.upsert({
//     where: { name: 'Tomate' },
//     update: {},
//     create: {
//       name: 'Tomate',
//       varieties: {
//         create: [{ name: 'Tomate Cereja' }, { name: 'Tomate Italiano' }, { name: 'Tomate Débora' }],
//       },
//     },
//     include: { varieties: true },
//   });

//   const alface = await prisma.product.upsert({
//     where: { name: 'Alface' },
//     update: {},
//     create: {
//       name: 'Alface',
//       varieties: {
//         create: [{ name: 'Alface Crespa' }, { name: 'Alface Americana' }, { name: 'Alface Roxa' }],
//       },
//     },
//     include: { varieties: true },
//   });

//   const maca = await prisma.product.upsert({
//     where: { name: 'Maçã' },
//     update: {},
//     create: {
//       name: 'Maçã',
//       varieties: {
//         create: [{ name: 'Maçã Gala' }, { name: 'Maçã Fuji' }],
//       },
//     },
//     include: { varieties: true },
//   });

//   const batata = await prisma.product.upsert({
//     where: { name: 'Batata' },
//     update: {},
//     create: {
//       name: 'Batata',
//       varieties: {
//         create: [{ name: 'Batata Inglesa' }, { name: 'Batata Doce' }],
//       },
//     },
//     include: { varieties: true },
//   });
//   console.log('Produtos de hortifrúti e suas variedades inseridos.');

//   //================================================================================
//   // 3. PRODUTORES
//   //================================================================================
//   const producer1 = await prisma.producer.upsert({
//     where: { document: '123.456.789-01' },
//     update: {},
//     create: {
//       name: 'João da Silva', document: '123.456.789-01', phone: '(51) 99999-1111',
//       email: 'joao.silva@email.com', zipCode: '90000-000', city: 'Porto Alegre',
//       street: 'Rua das Flores', number: '123',
//     },
//   });

//   const producer2 = await prisma.producer.upsert({
//     where: { document: '987.654.321-09' },
//     update: {},
//     create: {
//       name: 'Maria Oliveira', document: '987.654.321-09', phone: '(51) 98888-2222',
//       email: 'maria.oliveira@email.com', zipCode: '92000-000', city: 'Canoas',
//       street: 'Avenida das Árvores', number: '456',
//     },
//   });

//   const producer3 = await prisma.producer.upsert({
//     where: { document: '111.222.333-44' },
//     update: {},
//     create: {
//       name: 'Carlos Pereira', document: '111.222.333-44', phone: '(51) 97777-3333',
//       email: 'carlos.pereira@email.com', zipCode: '93000-000', city: 'São Leopoldo',
//       street: 'Travessa dos Pinheiros', number: '789',
//     },
//   });
//   console.log('Produtores inseridos.');

// //   //================================================================================
// //   // 4. ÁREAS DOS PRODUTORES (com Geometria)
// //   //================================================================================
// //   const humiferoId = (await prisma.soilType.findFirst({ where: { name: 'Humífero' } }))!.id;
// //   const argilosoId = (await prisma.soilType.findFirst({ where: { name: 'Argiloso' } }))!.id;
// //   const gotejamentoId = (await prisma.irrigationType.findFirst({ where: { name: 'Gotejamento' } }))!.id;
// //   const aspersaoId = (await prisma.irrigationType.findFirst({ where: { name: 'Aspersão' } }))!.id;
  
// //   const polygon1WKT = 'POLYGON((-51.22 -30.05, -51.22 -30.02, -51.19 -30.02, -51.19 -30.05, -51.22 -30.05))';
// //   const polygon2WKT = 'POLYGON((-51.18 -30.01, -51.18 -29.98, -51.15 -29.98, -51.15 -30.01, -51.18 -30.01))';

// //   await prisma.$executeRawUnsafe(`INSERT INTO "public"."areas" (name, polygon, "producerId", "soilTypeId", "irrigationTypeId", "updatedAt") VALUES ('Horta Principal', ST_GeomFromText($1, 4326), $2, $3, $4, NOW()) ON CONFLICT DO NOTHING;`, polygon1WKT, producer1.id, humiferoId, gotejamentoId);
// //   await prisma.$executeRawUnsafe(`INSERT INTO "public"."areas" (name, polygon, "producerId", "soilTypeId", "irrigationTypeId", "updatedAt") VALUES ('Campo Leste', ST_GeomFromText($1, 4326), $2, $3, $4, NOW()) ON CONFLICT DO NOTHING;`, polygon2WKT, producer1.id, argilosoId, aspersaoId);
// //   await prisma.$executeRawUnsafe(`INSERT INTO "public"."areas" (name, polygon, "producerId", "soilTypeId", "irrigationTypeId", "updatedAt") VALUES ('Pomar Norte', ST_GeomFromText($1, 4326), $2, $3, $4, NOW()) ON CONFLICT DO NOTHING;`, polygon1WKT, producer2.id, humiferoId, gotejamentoId);
// //   await prisma.$executeRawUnsafe(`INSERT INTO "public"."areas" (name, polygon, "producerId", "soilTypeId", "irrigationTypeId", "updatedAt") VALUES ('Estufa de Hortaliças', ST_GeomFromText($1, 4326), $2, $3, $4, NOW()) ON CONFLICT DO NOTHING;`, polygon2WKT, producer3.id, humiferoId, gotejamentoId);
  
// //   console.log('Áreas dos produtores inseridas.');

// //   //================================================================================
// //   // 5. SAFRAS
// //   //================================================================================
// //   await prisma.harvest.createMany({
// //     data: [
// //       { name: 'Safra de Verão 2025', startDate: new Date('2025-09-22T00:00:00Z'), endDate: new Date('2025-12-20T23:59:59Z'), status: 'Finalizada', cycle: 'Verão', producerId: producer1.id },
// //       { name: 'Safra de Outono 2025', startDate: new Date('2025-03-20T00:00:00Z'), endDate: new Date('2025-06-21T23:59:59Z'), status: 'Ativa', cycle: 'Outono', producerId: producer2.id },
// //       { name: 'Safra de Inverno 2025', startDate: new Date('2025-06-21T00:00:00Z'), endDate: new Date('2025-09-22T23:59:59Z'), status: 'Planejada', cycle: 'Inverno', producerId: producer3.id },
// //     ],
// //     skipDuplicates: true,
// //   });
// //   console.log('Safras inseridas.');

// //   //================================================================================
// //   // 6. PLANTIOS (Conectando tudo)
// //   //================================================================================
// //   const areaHorta = await prisma.area.findFirst({ where: { name: 'Horta Principal' } });
// //   const areaPomar = await prisma.area.findFirst({ where: { name: 'Pomar Norte' } });
// //   const areaEstufa = await prisma.area.findFirst({ where: { name: 'Estufa de Hortaliças' } });
  
// //   const safraVerao = await prisma.harvest.findFirst({ where: { name: 'Safra de Verão 2025' } });
// //   const safraOutono = await prisma.harvest.findFirst({ where: { name: 'Safra de Outono 2025' } });

// //   if (areaHorta && safraVerao) {
// //     await prisma.planting.createMany({
// //       data: [
// //         { plantingDate: new Date('2025-09-25T00:00:00Z'), harvestForecast: new Date('2025-12-15T00:00:00Z'), harvestDate: new Date('2025-12-10T00:00:00Z'), quantityPlanted: 500.0, quantityHarvested: 480.5, areaId: areaHorta.id, harvestId: safraVerao.id, productId: tomate.id, varietyId: tomate.varieties[0].id }, // Tomate Cereja
// //         { plantingDate: new Date('2025-10-01T00:00:00Z'), harvestForecast: new Date('2025-11-20T00:00:00Z'), harvestDate: new Date('2025-11-18T00:00:00Z'), quantityPlanted: 1200.0, quantityHarvested: 1150.0, areaId: areaHorta.id, harvestId: safraVerao.id, productId: alface.id, varietyId: alface.varieties[0].id }, // Alface Crespa
// //       ],
// //       skipDuplicates: true,
// //     });
// //   }

// //   if (areaPomar && safraOutono) {
// //     await prisma.planting.createMany({
// //       data: [
// //         { plantingDate: new Date('2025-03-25T00:00:00Z'), harvestForecast: new Date('2025-06-10T00:00:00Z'), quantityPlanted: 150.0, areaId: areaPomar.id, harvestId: safraOutono.id, productId: maca.id, varietyId: maca.varieties[0].id }, // Maçã Gala
// //       ],
// //       skipDuplicates: true,
// //     });
// //   }

// //   if (areaEstufa && safraOutono) {
// //     await prisma.planting.createMany({
// //       data: [
// //         { plantingDate: new Date('2025-04-05T00:00:00Z'), harvestForecast: new Date('2025-06-20T00:00:00Z'), quantityPlanted: 2000.0, areaId: areaEstufa.id, harvestId: safraOutono.id, productId: batata.id, varietyId: batata.varieties[1].id }, // Batata Doce
// //       ],
// //       skipDuplicates: true,
// //     });
// //   }

// //   console.log('Plantios inseridos.');
// //   console.log('Seeding concluído com sucesso!');
// // }

// // Executa a função main e garante que a conexão com o banco seja fechada
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });