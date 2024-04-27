export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongo: {
    url: process.env.MONGO_DB_URL,
  },
});
