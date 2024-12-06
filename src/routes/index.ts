const express = require("express");
const sportsRoutes = require("./sport.route");
const userRoutes = require("./user.routes");


const router = express.Router({ mergeParams: true });

router.use("/sport", sportsRoutes);
router.use("/user", userRoutes);
// router.use("/training", trainingRoutes);
module.exports = router;
