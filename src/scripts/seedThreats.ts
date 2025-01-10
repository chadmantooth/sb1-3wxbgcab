import { seedThreats } from '../lib/security/threatSeeder';

async function main() {
  try {
    await seedThreats();
    console.log('Successfully seeded threat data');
  } catch (error) {
    console.error('Failed to seed threats:', error);
    process.exit(1);
  }
}

main();