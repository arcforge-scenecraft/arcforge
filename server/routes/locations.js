import express from "express";
import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/locationsController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getLocations).post(createLocation);

router
  .route("/:locationId")
  .get(getLocationById)
  .patch(updateLocation)
  .delete(deleteLocation);

export default router;
