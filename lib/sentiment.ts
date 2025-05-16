// Basic sentiment analysis function
export function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral', score: number } {
  if (!text) {
    return { sentiment: 'neutral', score: 0 };
  }
  
  // Simple keyword-based sentiment analysis
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'best', 'perfect',
    'wonderful', 'fantastic', 'outstanding', 'brilliant', 'exceptional', 'superb',
    'happy', 'excited', 'impressive', 'recommend', 'favorable', 'positive'
  ];
  
  const negativeWords = [
    'bad', 'poor', 'terrible', 'awful', 'horrible', 'hate', 'worst', 'disappointing',
    'mediocre', 'useless', 'failure', 'waste', 'annoying', 'negative', 'problem',
    'fail', 'broken', 'sad', 'angry', 'unfavorable', 'buggy', 'flawed'
  ];
  
  // Normalize text for analysis
  const normalizedText = text.toLowerCase();
  
  // Count occurrences of positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  });
  
  // Calculate sentiment score (-1 to 1)
  const total = positiveCount + negativeCount;
  let score = 0;
  
  if (total > 0) {
    score = (positiveCount - negativeCount) / total;
  }
  
  // Determine sentiment based on score
  let sentiment: 'positive' | 'negative' | 'neutral';
  
  if (score > 0.1) {
    sentiment = 'positive';
  } else if (score < -0.1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  return { sentiment, score };
}

// Apply sentiment analysis to trend items
export function applySentimentAnalysis(items: any[]): any[] {
  return items.map(item => {
    // Use title and content for analysis
    const textToAnalyze = `${item.title} ${item.content}`.trim();
    const { sentiment } = analyzeSentiment(textToAnalyze);
    
    return {
      ...item,
      sentiment
    };
  });
}