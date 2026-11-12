
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
    maxCost: 100,
    duration: 90
  },
  {
    category: "beach",
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
  }
];

function categoryMatches(categories, target) {
  return categories.some(category =>
    category === target ||
    category.startsWith(target + ".")
  );
}

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

function recommendPlaces({
  places,
  moodCategories,
  budget,
  availableTime
}) {
  return places
    .map(place => {
      const estimate = estimatePlace(place);
      const categories = place.categories || [];

      // Mood relevance
      const moodMatch = moodCategories.some(target =>
        categoryMatches(categories, target)
      );

      // Budget suitability
      const budgetFit = estimate.minCost <= budget;
      const comfortablyAffordable =
        estimate.maxCost <= budget;

      // Time suitability
      const timeFit = estimate.duration <= availableTime;

      // Distance suitability
      const distance = place.distance ?? 10000;
      const distanceScore = Math.max(
        0,
        10 - (distance / 1000) * 2
      );

      // Calculate recommendation score
      let score = 0;

      score += moodMatch ? 50 : 0;
      score += comfortablyAffordable ? 25 :
        budgetFit ? 12 : 0;
      score += timeFit ? 15 : 0;
      score += distanceScore;

      return {
        ...place,
        estimatedCost: {
          min: estimate.minCost,
          max: estimate.maxCost
        },
        estimatedVisitTime: estimate.duration,
        budgetFit,
        timeFit,
        score: Math.round(score)
      };
    })
    // Remove places outside the user's budget
    .filter(place => place.budgetFit)
    // Prioritize places that fit available time
    .sort((a, b) => {
      if (a.timeFit !== b.timeFit) {
        return Number(b.timeFit) - Number(a.timeFit);
      }

      return b.score - a.score;
    });
}

module.exports = { recommendPlaces };
