const express = require("express");
const router = express.Router();

const controller = require("../controllers/tournamentsController");
const { authenticate, authorize } = require('../utils/authMiddleware');

router.get("/", controller.getTournaments);

router.post("/", authenticate, authorize('admin'), controller.createTournament);

router.put("/:id", authenticate, authorize('admin'), controller.updateTournament);

router.post("/register", authenticate, controller.registerTournament);

router.get("/my-registrations/:user_id", authenticate, controller.getMyTournaments);

router.put("/:id/status", authenticate, authorize('admin'), controller.updateTournamentStatus);

module.exports = router;
