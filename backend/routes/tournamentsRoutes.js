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

router.get("/:id/registrations", authenticate, authorize('admin'), controller.getTournamentRegistrations);

router.delete("/:tournamentId/registrations/:userId", authenticate, authorize('admin'), controller.removeRegistration);

router.get("/:id/results", controller.getTournamentResults);

module.exports = router;
