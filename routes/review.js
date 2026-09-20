const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middlewares/middleware.js");

//Post review Route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let lising = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);

    lising.reviews.push(newreview);

    await newreview.save();
    await lising.save();
    req.flash("success", "New Review created!");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

//delete review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
