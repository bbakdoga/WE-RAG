// Client-side product search engine
// Simulates RAG retrieval using TF-IDF-like keyword scoring

import { productFamilies, productToContentMap, applicationDomainMap } from '../data/products';

/**
 * Tokenize and normalize a search query
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\s-]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Calculate relevance score between a query and a text corpus
 */
function calculateRelevance(queryTokens, textCorpus) {
  const corpusTokens = tokenize(textCorpus);
  if (corpusTokens.length === 0) return 0;

  let matches = 0;
  let partialMatches = 0;

  for (const qt of queryTokens) {
    for (const ct of corpusTokens) {
      if (ct === qt) {
        matches += 2;
      } else if (ct.includes(qt) || qt.includes(ct)) {
        partialMatches += 1;
      }
    }
  }

  // Normalize by query length
  return (matches + partialMatches * 0.5) / queryTokens.length;
}

/**
 * Search products by query string
 * Returns ranked results with relevance scores
 */
export function searchProducts(query, userInterests = []) {
  if (!query || query.trim().length < 2) return { families: [], series: [] };

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return { families: [], series: [] };

  // Score each product family
  const familyScores = productFamilies.map(family => {
    const keywordCorpus = family.keywords.join(' ');
    const descCorpus = `${family.name} ${family.description} ${family.studentRelevance}`;

    const keywordScore = calculateRelevance(queryTokens, keywordCorpus);
    const descScore = calculateRelevance(queryTokens, descCorpus);

    // Check application domain mapping
    let domainBoost = 0;
    for (const [domain, families] of Object.entries(applicationDomainMap)) {
      const domainTokens = tokenize(domain);
      const domainMatch = queryTokens.some(qt => domainTokens.some(dt => dt.includes(qt) || qt.includes(dt)));
      if (domainMatch && families.includes(family.id)) {
        domainBoost += 2;
      }
    }

    // Boost if matches user interests
    let interestBoost = 0;
    if (userInterests.length > 0) {
      const interestCorpus = userInterests.join(' ');
      const interestTokens = tokenize(interestCorpus);
      for (const it of interestTokens) {
        if (family.keywords.some(kw => kw.includes(it) || it.includes(kw))) {
          interestBoost += 0.5;
        }
      }
    }

    const totalScore = keywordScore * 3 + descScore + domainBoost + interestBoost;

    return { ...family, score: totalScore };
  });

  // Score individual series within families
  const seriesScores = [];
  for (const family of productFamilies) {
    for (const series of family.series) {
      const seriesCorpus = `${series.name} ${series.description} ${series.applications.join(' ')} ${series.studentProjects.join(' ')}`;
      const score = calculateRelevance(queryTokens, seriesCorpus);

      if (score > 0) {
        seriesScores.push({
          ...series,
          familyId: family.id,
          familyName: family.name,
          familyColor: family.color,
          familyIcon: family.icon,
          score,
        });
      }
    }
  }

  // Sort by score
  const rankedFamilies = familyScores.filter(f => f.score > 0).sort((a, b) => b.score - a.score);
  const rankedSeries = seriesScores.sort((a, b) => b.score - a.score);

  return {
    families: rankedFamilies.slice(0, 5),
    series: rankedSeries.slice(0, 8),
  };
}

/**
 * Get related WE-Connect content for a product family
 */
export function getRelatedContent(familyId) {
  return productToContentMap[familyId] || { quizzes: [], blogs: [], opportunities: [], events: [], mentors: [] };
}

/**
 * Get product recommendations for a specific application/project description
 */
export function getProjectRecommendations(projectDescription) {
  const results = searchProducts(projectDescription);

  // Build a recommendation narrative
  const recommendations = results.families.slice(0, 3).map(family => {
    const relatedContent = getRelatedContent(family.id);
    const topSeries = results.series
      .filter(s => s.familyId === family.id)
      .slice(0, 2);

    return {
      family,
      topSeries,
      relatedContent,
    };
  });

  return recommendations;
}

/**
 * Generate AI-style product recommendation text for the chat companion
 */
export function generateProductResponse(query) {
  const results = searchProducts(query);

  if (results.families.length === 0 && results.series.length === 0) {
    return null;
  }

  let response = `I found some **Würth Elektronik products** that match your query:\n\n`;

  // Top product families
  const topFamilies = results.families.slice(0, 3);
  for (const family of topFamilies) {
    response += `${family.icon} **${family.name}**\n${family.description}\n`;

    // Add top series for this family
    const familySeries = results.series.filter(s => s.familyId === family.id).slice(0, 2);
    if (familySeries.length > 0) {
      response += `\nRecommended series:\n`;
      for (const s of familySeries) {
        response += `• **${s.name}** — ${s.description.split('.')[0]}.\n`;
        if (s.studentProjects.length > 0) {
          response += `  Student project ideas: ${s.studentProjects.slice(0, 2).join(', ')}\n`;
        }
      }
    }

    // Add related WE-Connect content
    const related = getRelatedContent(family.id);
    const relatedItems = [];
    if (related.quizzes.length > 0) relatedItems.push(`📝 Quiz: ${related.quizzes[0]}`);
    if (related.blogs.length > 0) relatedItems.push(`📖 Blog: ${related.blogs[0]}`);
    if (related.opportunities.length > 0) relatedItems.push(`💼 Opportunity: ${related.opportunities[0]}`);

    if (relatedItems.length > 0) {
      response += `\n🎓 **Related on WE-Connect:**\n${relatedItems.join('\n')}\n`;
    }

    response += `\n🔗 Browse products: ${family.weUrl}\n\n`;
  }

  response += `\n💡 **Tip:** You can request **free component samples** for your university project through the Opportunities page! Look for "Free Component Kit".`;

  return response;
}

/**
 * Check if a query is product-related
 */
export function isProductQuery(query) {
  const productKeywords = [
    'component', 'product', 'part', 'inductor', 'capacitor', 'resistor',
    'connector', 'led', 'sensor', 'transformer', 'module', 'ferrite',
    'filter', 'emc', 'emi', 'esd', 'choke', 'bead', 'diode', 'tvs',
    'power supply', 'converter', 'regulator', 'driver', 'charger',
    'buck', 'boost', 'flyback', 'pcb', 'circuit', 'design',
    'datasheet', 'specs', 'specification', 'select', 'choose', 'recommend',
    'wireless', 'antenna', 'charging', 'coil', 'winding',
    'sample', 'free component', 'prototype', 'project component',
    'what component', 'which component', 'find a', 'need a', 'looking for',
    'iot', 'automotive', 'motor', 'battery', 'solar', 'drone',
    'raspberry pi', 'arduino', 'microcontroller', 'mcu',
    'redexpert', 'we-', 'würth', 'wuerth', 'wurth',
  ];

  const lowerQuery = query.toLowerCase();
  return productKeywords.some(kw => lowerQuery.includes(kw));
}
