const MOOD_RULES = {
  happy: {
    categories: [
      "catering.cafe",
      "leisure.park",
      "tourism.attraction"
    ]
  },

  sad: {
    categories: [
      "leisure.park",
      "natural",
      "catering.cafe"
    ]
  },

  stressed: {
    categories: [
      "leisure.park",
      "natural",
      "catering.cafe"
    ]
  },

  romantic: {
    categories: [
      "catering.restaurant",
      "catering.cafe",
      "beach"
    ]
  },

  adventurous: {
    categories: [
      "tourism.attraction",
      "sport",
      "beach"
    ]
  },

  bored: {
    categories: [
      "leisure",
      "tourism.attraction",
      "catering.cafe"
    ]
  }
};

module.exports = MOOD_RULES;