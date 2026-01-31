import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // This loads the .env file immediately

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Using process.env ensures we get the value loaded by dotenv/config
    url: process.env.DATABASE_URL,
  },
});
