import { TextStats } from '../types/textConfig.types';

/**
 * Calculate text statistics
 */
export function calculateTextStats(text: string, html: string): TextStats {
  const plainText = text.trim();
  
  // Characters
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, '').length;
  
  // Words
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
  
  // Sentences (approximate)
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Paragraphs
  const paragraphs = html.split(/<\/?p>/gi).filter(p => p.trim().length > 0).length;
  
  // Reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);
  
  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    readingTime,
  };
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
return text;
}
  return `${text.substring(0, maxLength)  }...`;
}

/**
 * Convert text to title case
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Count specific character
 */
export function countCharacter(text: string, char: string): number {
  return (text.match(new RegExp(char, 'g')) || []).length;
}

/**
 * Get word frequency
 */
export function getWordFrequency(text: string): Record<string, number> {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const frequency: Record<string, number> = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return frequency;
}

/**
 * Estimate reading level (Flesch-Kincaid)
 */
export function estimateReadingLevel(text: string): number {
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const syllables = estimateSyllables(text);
  
  if (words === 0 || sentences === 0) {
return 0;
}
  
  const score = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(0, Math.round(score));
}

/**
 * Estimate syllable count
 */
function estimateSyllables(text: string): number {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let count = 0;
  
  words.forEach(word => {
    const syllables = word.match(/[aeiouy]+/g);
    count += syllables ? syllables.length : 1;
  });
  
  return count;
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
return 'Less than a minute';
}
  if (minutes === 1) {
return '1 minute';
}
  return `${minutes} minutes`;
}