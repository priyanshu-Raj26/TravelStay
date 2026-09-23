const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

const getGeometry = async (location) => {
  const response = await geocodingClient
    .forwardGeocode({
      query: location,
      limit: 1,
    })
    .send();

  return response.body.features[0]?.geometry;
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  const geometry = await getGeometry(req.body.listing.location);

  if (!geometry) {
    req.flash("error", "Location could not be found.");
    return res.redirect("/listings/new");
  }

  let url = req.file.path;
  let filename = req.file.filename;

  // let { title, description, image, price, country, location } = req.body;
  const newListing = new Listing(req.body.listing); //better syntex
  newListing.owner = req.user._id; //assigning owner to the listing
  newListing.image = { url, filename };

  newListing.geometry = geometry;

  let savedListing = await newListing.save();
  // console.log(savedListing);
  req.flash("success", "New listing created!");
  res.redirect("/listings"); //run after save succeeds
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (req.body.listing.location !== listing.location) {
    const geometry = await getGeometry(req.body.listing.location);

    if (!geometry) {
      req.flash("error", "Location could not be found.");
      return res.redirect(`/listings/${id}/edit`);
    }

    listing.geometry = geometry;
  }

  Object.assign(listing, req.body.listing);

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.showLisitng = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    //populating reviews and author of the review (nested populate)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // Backfill geometry for listings created before the map field was added.
  if (!listing.geometry?.coordinates?.length && listing.location) {
    const geometry = await getGeometry(listing.location);

    if (geometry) {
      listing.geometry = geometry;
      await listing.save();
    }
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);

  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
