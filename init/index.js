if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" }); //must be first line
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

main()
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Review.deleteMany({});
  const listings = await Promise.all(
    initData.data.map(async (obj) => {
      const response = await geocodingClient
        .forwardGeocode({ query: obj.location, limit: 1 })
        .send();

      return {
        ...obj,
        owner: "6aab8bff5b66aeb4126e7fa0",
        geometry: response.body.features[0]?.geometry,
      };
    }),
  );
  await Listing.insertMany(listings);
  console.log("data was initialized");
};

initDB();
