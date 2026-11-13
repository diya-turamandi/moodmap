
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// =====================================
// INITIAL SETUP
// =====================================

console.log(
  "Geoapify API Key Loaded:",
  !!process.env.GEOAPIFY_API_KEY
);

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// 1. MOOD → PLACE CATEGORY MAPPING
// =====================================

const MOOD_RULES = {
  happy: {
    categories: [
      "catering.cafe",
      "leisure.park",
      "tourism.attraction"
    ],
    suggestion:
      "Enjoy your happiness with fun places and outdoor experiences! ☀️"
  },

  sad: {
    categories: [
      "leisure.park",
      "natural",
      "catering.cafe"
    ],
    suggestion:
      "A peaceful environment and some fresh air might help. 🌿"
  },

  stressed: {
    categories: [
      "leisure.park",
      "natural",
      "catering.cafe"
    ],
    suggestion:
      "Take a break and enjoy some peaceful surroundings. 🌸"
  },

  romantic: {
    categories: [
      "catering.restaurant",
      "catering.cafe",
      "tourism.attraction"
    ],
    suggestion:
      "Find a beautiful place to spend quality time together. 💕"
  },

  adventurous: {
    categories: [
      "tourism.attraction",
      "sport",
      "natural"
    ],
    suggestion:
      "Explore somewhere new and exciting! 🏕️"
  },

  bored: {
    categories: [
      "entertainment",
      "tourism.attraction",
      "catering.cafe"
    ],
    suggestion:
      "Discover something fun and interesting to do! 🎯"
  },

  energetic: {
    categories: [
      "sport",
      "tourism.attraction",
      "leisure.park"
    ],
    suggestion:
      "Use your energy for an exciting experience! ⚡"
  },

  calm: {
    categories: [
      "natural",
      "leisure.park",
      "catering.cafe"
    ],
    suggestion:
      "Enjoy a calm and relaxing experience. 🍃"
  }
};

// =====================================
// 2. ESTIMATED COST AND VISIT DURATION
// =====================================

// All costs are illustrative estimates in INR.

const COST_RULES = [
  {
    category: "leisure.park",
    minCost: 0,
    maxCost: 100,
    duration: 60
  },
  {
    category: "natural",
    minCost: 0,
    maxCost: 150,
    duration: 90
  },
  {
    category: "catering.cafe",
    minCost: 150,
    maxCost: 500,
    duration: 60
  },
  {
    category: "catering.restaurant",
    minCost: 250,
    maxCost: 800,
    duration: 90
  },
  {
    category: "tourism.attraction",
    minCost: 100,
    maxCost: 500,
    duration: 120
  },
  {
    category: "sport",
    minCost: 100,
    maxCost: 500,
    duration: 90
  },
  {
    category: "entertainment",
    minCost: 150,
    maxCost: 600,
    duration: 120
  }
];

// =====================================
// 3. CATEGORY MATCHING
// =====================================

function categoryMatches(placeCategories, targetCategory) {
  return placeCategories.some(category =>
    category === targetCategory ||
    category.startsWith(targetCategory + ".")
  );
}

// =====================================
// 4. ESTIMATE PLACE COST
// =====================================

function estimatePlace(place) {
  const categories = place.categories || [];

  const rule = COST_RULES.find(item =>
    categoryMatches(categories, item.category)
  );

  return rule || {
    minCost: 0,
    maxCost: 500,
    duration: 60
  };
}

// =====================================
// 5. DISTANCE CALCULATION
// =====================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const toRad = value => value * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

// =====================================
// 6. RECOMMENDATION ENGINE
// =====================================

function recommendPlaces({
  places,
  moodCategories,
  budget,
  availableTime
}) {

  const scoredPlaces = places.map(place => {

    const estimate = estimatePlace(place);

    const moodMatch = moodCategories.some(category =>
      categoryMatches(place.categories || [], category)
    );

    const budgetFit = estimate.minCost <= budget;

    const affordable =
      estimate.maxCost <= budget;

    const timeFit =
      estimate.duration <= availableTime;

    const distanceKm = place.distance / 1000;

    const distanceScore = Math.max(
      0,
      10 - distanceKm * 2
    );

    let score = 0;

    score += moodMatch ? 50 : 0;
    score += affordable ? 25 : budgetFit ? 12 : 0;
    score += timeFit ? 15 : 0;
    score += distanceScore;

    return {
      ...place,

      estimatedCost: {
        min: estimate.minCost,
        max: estimate.maxCost,
        currency: "INR"
      },

      estimatedVisitTime: estimate.duration,

      moodMatch,
      budgetFit,
      affordable,
      timeFit,

      score: Math.round(score)
    };
  });

  // Filter places according to budget

  const budgetMatches = scoredPlaces.filter(
    place => place.budgetFit
  );

  // Prefer places that fit available time

  const timeMatches = budgetMatches.filter(
    place => place.timeFit
  );

  const finalPlaces = timeMatches.length > 0
    ? timeMatches
    : budgetMatches;

  return finalPlaces.sort(
    (a, b) => b.score - a.score
  );
}

// =====================================
// 7. MAIN MOOD ANALYSIS API
// =====================================

app.post("/api/analyze-mood", async (req, res) => {

  try {

    const {
      mood,
      location,
      budget,
      availableTime,
      latitude: userLatitude,
      longitude: userLongitude
    } = req.body;

    // Validate input

    if (
      !mood ||
      !location ||
      budget === undefined ||
      availableTime === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Mood, location, budget and available time are required."
      });
    }

    const selectedMood = String(mood)
      .toLowerCase()
      .trim();

    const userBudget = Number(budget);
    const userTime = Number(availableTime);

    if (
      !Number.isFinite(userBudget) ||
      userBudget < 0 ||
      !Number.isFinite(userTime) ||
      userTime <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid budget and available time."
      });
    }

    if (!process.env.GEOAPIFY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Geoapify API key is missing. Check your .env file."
      });
    }

    // STEP 1: Detect mood

    const moodConfig =
      MOOD_RULES[selectedMood] || MOOD_RULES.happy;

    const categories = moodConfig.categories;

    console.log("Mood:", selectedMood);
    console.log("Categories:", categories);

    // STEP 2: Get exact coordinates

    let latitude;
    let longitude;

    const hasLatitude =
      userLatitude !== undefined && userLatitude !== null;

    const hasLongitude =
      userLongitude !== undefined && userLongitude !== null;

    // Both coordinates must be provided together.
    if (hasLatitude !== hasLongitude) {
      return res.status(400).json({
        success: false,
        error: "Both latitude and longitude are required."
      });
    }

    if (hasLatitude && hasLongitude) {

      latitude = Number(userLatitude);
      longitude = Number(userLongitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid location coordinates."
        });
      }

      console.log(
        "Using exact browser coordinates:",
        latitude,
        longitude
      );

    } else {

      // If the user manually entered a location,
      // convert that location into coordinates.

      const geoResponse = await axios.get(
        "https://api.geoapify.com/v1/geocode/search",
        {
          params: {
            text: `${location}, Karnataka, India`,
            format: "json",
            limit: 1,
            apiKey: process.env.GEOAPIFY_API_KEY
          },
          timeout: 15000
        }
      );

      const coordinates = geoResponse.data.results?.[0];

      if (!coordinates) {
        return res.status(404).json({
          success: false,
          error: "Location not found. Please enter a valid location."
        });
      }

      latitude = coordinates.lat;
      longitude = coordinates.lon;

      console.log(
        "Coordinates from manual location:",
        latitude,
        longitude
      );
    }

    // STEP 3: Fetch real nearby places

    const placesResponse = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: categories.join(","),
          filter: `circle:${longitude},${latitude},5000`,
          bias: `proximity:${longitude},${latitude}`,
          limit: 50,
          lang: "en",
          apiKey: process.env.GEOAPIFY_API_KEY
        },
        timeout: 20000
      }
    );

    // STEP 4: Format places

    const places = (
      placesResponse.data.features || []
    ).map(feature => {

      const p = feature.properties;

      const placeLat =
        p.lat ?? feature.geometry.coordinates[1];

      const placeLon =
        p.lon ?? feature.geometry.coordinates[0];

      const distance = p.distance ??
        calculateDistance(
          latitude,
          longitude,
          placeLat,
          placeLon
        );

      return {
        id: p.place_id || `${placeLat}-${placeLon}`,

        name:
          p.name ||
          p.address_line1 ||
          "Unnamed place",

        address:
          p.formatted ||
          p.address_line1 ||
          "Address unavailable",

        latitude: placeLat,
        longitude: placeLon,

        distance,

        categories: p.categories || [],

        mapUrl:
          `https://www.openstreetmap.org/?mlat=${placeLat}&mlon=${placeLon}#map=16/${placeLat}/${placeLon}`
      };

    }).filter(place =>
      Number.isFinite(place.latitude) &&
      Number.isFinite(place.longitude)
    );

    console.log("Places found:", places.length);

    // STEP 5: Apply recommendation engine

    const recommendations = recommendPlaces({
      places,
      moodCategories: categories,
      budget: userBudget,
      availableTime: userTime * 60
    });

    // STEP 6: Return final recommendations

    res.json({

      success: true,

      detectedMood: selectedMood,

      location,

      coordinates: {
        latitude,
        longitude
      },

      category: categories,

      suggestion: moodConfig.suggestion,

      budget: userBudget,

      availableTime: userTime,

      totalPlaces: recommendations.length,

      recommendations,

      places: recommendations,

      message: recommendations.length
        ? "Recommendations generated successfully."
        : "No places match your budget. Try increasing your budget or changing your location."

    });

  } catch (error) {

    console.error(
      "MOODMAP ERROR:",
      error.response?.data || error.message
    );

    const apiMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message;

    res.status(500).json({
      success: false,
      error: apiMessage || "Unable to generate recommendations."
    });

  }

});

// =====================================
// 8. GET CURRENT LOCATION ADDRESS
// =====================================

app.post("/api/reverse-geocode", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      return res.status(400).json({
        success: false,
        error: "Valid latitude and longitude are required."
      });
    }

    if (!process.env.GEOAPIFY_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "Geoapify API key is missing."
      });
    }

    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat: Number(latitude),
          lon: Number(longitude),
          format: "json",
          apiKey: process.env.GEOAPIFY_API_KEY
        },
        timeout: 15000
      }
    );

    const place = response.data.results?.[0];

    if (!place) {
      return res.status(404).json({
        success: false,
        error: "Could not identify your current location."
      });
    }

    // Prefer Geoapify's complete formatted address.
    // Build a detailed fallback if it is unavailable.
    const addressParts = [
      place.housenumber,
      place.street,
      place.name,
      place.suburb,
      place.neighbourhood,
      place.district,
      place.city || place.town || place.village,
      place.state,
      place.postcode,
      place.country
    ];

    const detailedAddress = [
      ...new Set(addressParts.filter(Boolean))
    ].join(", ");

    const formattedAddress =
      place.formatted || detailedAddress;

    console.log("Detailed location:", formattedAddress);

    res.json({
      success: true,
      location: formattedAddress,
      formattedAddress,
      latitude: Number(latitude),
      longitude: Number(longitude)
    });

  } catch (error) {
    console.error(
      "REVERSE GEOCODING ERROR:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to detect your location."
    });
  }
});

// =====================================
// 9. SERVER HEALTH CHECK
// =====================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "MoodMap backend is running!"
  });

});

// =====================================
// 10. START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `MoodMap backend running on port ${PORT}`
  );

});
