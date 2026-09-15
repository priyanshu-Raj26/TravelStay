const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

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
