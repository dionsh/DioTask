// =============================================================================
// Public API integration.
// We use the free JSONPlaceholder "todos" endpoint to power the Dashboard's
// statistics card. No API key required.
// =============================================================================

const TODOS_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos';

/**
 * Fetch the public todos and reduce them into a small statistics summary that
 * the Dashboard card can display directly.
 *
 * @returns {Promise<{ total:number, completed:number, pending:number, completionRate:number }>}
 */
export const fetchTodoStats = async () => {
  const response = await fetch(TODOS_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const todos = await response.json();

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, pending, completionRate };
};

// =============================================================================
// "Quote of the Day" — motivational quotes from successful business leaders.
//
// We pull the public DummyJSON quotes collection and keep only the ones by
// well-known entrepreneurs / business leaders, then surface a random one. A new
// quote is returned on every call (i.e. on every refresh) — nothing is cached
// for a day.
// =============================================================================

const QUOTES_ENDPOINT = 'https://dummyjson.com/quotes?limit=0';

const BUSINESS_AUTHORS = [
  'Henry Ford', 'Walt Disney', 'Warren Buffett', 'Bill Gates', 'Steve Jobs',
  'Thomas A. Edison', 'Oprah', 'Zig Ziglar', 'Richard Branson', 'Rockefeller',
  'Carnegie', 'Jeff Bezos', 'Elon Musk', 'Sam Walton', 'Ray Kroc',
];

// DummyJSON stores quotes in Title Case ("If You Can'T..."); convert to clean
// sentence case for nicer display.
const toSentenceCase = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase())
    .replace(/\bi\b/g, 'I');

// Cache the filtered list for the session so refreshes are instant (the first
// load performs the real network request).
let businessQuotesCache = null;
let lastQuoteIndex = -1;

const loadBusinessQuotes = async () => {
  if (businessQuotesCache) return businessQuotesCache;

  const response = await fetch(QUOTES_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const quotes = Array.isArray(data?.quotes) ? data.quotes : [];

  const filtered = quotes
    .filter((q) =>
      BUSINESS_AUTHORS.some((name) =>
        q.author.toLowerCase().includes(name.toLowerCase())
      )
    )
    .map((q) => ({ content: toSentenceCase(q.quote), author: q.author }));

  if (filtered.length === 0) {
    throw new Error('No quotes available right now.');
  }

  businessQuotesCache = filtered;
  return filtered;
};

/**
 * Return a fresh random business-leader quote.
 * @returns {Promise<{ content: string, author: string }>}
 */
export const fetchBusinessQuote = async () => {
  const quotes = await loadBusinessQuotes();

  let index = Math.floor(Math.random() * quotes.length);
  // Avoid showing the same quote twice in a row.
  if (quotes.length > 1) {
    while (index === lastQuoteIndex) {
      index = Math.floor(Math.random() * quotes.length);
    }
  }
  lastQuoteIndex = index;

  return quotes[index];
};
