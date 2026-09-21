export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER ?? 'zrp',
    password: process.env.DATABASE_PASSWORD ?? 'zrp',
    name: process.env.DATABASE_NAME ?? 'zrp',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
  rickAndMortyApiUrl:
    process.env.RICK_AND_MORTY_API_URL ?? 'https://rickandmortyapi.com/api',
});
