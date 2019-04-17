const postRoutes = require("../routes/post");
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/user");

module.exports = (app) => {
  app.use("/", postRoutes);
  app.use("/", authRoutes);
  app.use("/", userRoutes);
}