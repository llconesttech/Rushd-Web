
const TAJWEED_RULES = {
    'h': { label: 'Hamzat ul Wasl', css: 'ham_wasl' },
};

const parseTajweed = (text) => {
    if (!text) return "";
    return text.replace(/\[([a-z])(?::\d+)?\[([^\]]+)\]/g, (match, type, content) => {
        console.log(`Matched: ${match}, Type: ${type}, Content: ${content}`);
        const rule = TAJWEED_RULES[type];
        const className = rule ? rule.css : `tj-${type}`;
        return `<span class="${className} tajweed-char">${content}</span>`;
    });
};

const examples = [
    '[h[ٱ]]لْحَمْدُ',
    '[h[ٱ]لْحَمْدُ',
];

examples.forEach(ex => {
    console.log(`Input: ${ex}`);
    console.log(`Output: ${parseTajweed(ex)}`);
    console.log('---');
});
