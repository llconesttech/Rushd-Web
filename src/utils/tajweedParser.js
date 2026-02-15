
import { TAJWEED_RULES } from '../data/tajweedData';

/**
 * Parses text containing Tajweed markup and returns HTML string with spans.
 * Markup format: [code[text]]
 * @param {string} text - The text to parse
 * @param {boolean} showTooltips - Whether to add data-tooltip attributes
 * @returns {string} - HTML string
 */
export const parseTajweed = (text, showTooltips = false) => {
    if (!text) return "";
    return text.replace(/\[([a-z])(?::\d+)?\[([^\]]+)\]/g, (match, type, content) => {
        const rule = TAJWEED_RULES[type];
        const className = rule ? rule.css : `tj-${type}`;
        const tooltipAttr = (showTooltips && rule) ? ` data-tooltip="${rule.label}"` : '';
        return `<span class="${className} tajweed-char"${tooltipAttr}>${content}</span>`;
    });
};
