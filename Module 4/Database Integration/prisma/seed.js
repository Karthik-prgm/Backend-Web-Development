require('dotenv').config();
const prisma = require('../src/db/prisma');

async function main() {
  const author = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: { name: 'Community Demo User' },
    create: { name: 'Community Demo User', email: 'demo@example.com' },
  });

  await prisma.post.upsert({
    where: { id: 1 },
    update: { title: 'First post', body: 'The contract survives storage changes.', authorId: author.id },
    create: { id: 1, title: 'First post', body: 'The contract survives storage changes.', authorId: author.id },
  });
  await prisma.post.upsert({
    where: { id: 2 },
    update: { title: 'Second post', body: 'Migrations record database design.', authorId: author.id },
    create: { id: 2, title: 'Second post', body: 'Migrations record database design.', authorId: author.id },
  });

  // Explicit demo IDs must not leave SERIAL sequences behind the inserted rows.
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"User"', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM "User"), 1), true)`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Post"', 'id'), GREATEST((SELECT COALESCE(MAX(id), 1) FROM "Post"), 1), true)`
  );
  console.log('Seed completed safely (demo user and posts upserted).');
}

main()
  .catch(() => {
    console.error('Seed failed. Check DATABASE_URL and migration status.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
