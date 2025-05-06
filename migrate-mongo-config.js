module.exports = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017",
    databaseName: process.env.DB_NAME || "TrainTribe",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: "migrations",
  changelogCollectionName: "migrations_changelog",
};