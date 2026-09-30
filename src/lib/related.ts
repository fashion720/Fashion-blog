// ─────────────────────────────────────────────────────────────────────────────
// AUTOMATIC INTERNAL LINKING
//
// Every time the site builds, this file looks at ALL published posts and works
// out which posts should link to which. Nothing needs to be edited by hand:
// publish a new article and, on the next build,
//   1. it gets a "You Might Also Like" block linking to its closest matches, and
//   2. other posts are guaranteed to link back TO it (so it's never an orphan).
//
// How "closest match" is decided (all deterministic — no randomness, so links
// stay stable between builds):
//   - Words from the title (x3), tags (x2) and description (x1) are weighted by
//     rarity (TF-IDF). Rare words like "speedcat" or "upcycle" count a lot,
//     generic words like "outfit" or "ideas" count almost nothing.
//   - Posts in the same category get a bonus.
// How links are spread fairly:
//   - Each post links to ~6 others, but no post may receive more than
//     MAX_INBOUND links from the greedy pass, so a few popular posts don't
//     soak up all the links.
//   - Any post that still has fewer than MIN_INBOUND links pointing at it gets
//     extra links forced in from its most similar posts.
// ─────────────────────────────────────────────────────────────────────────────
import { getAllPosts } from './keystatic-reader';

const OUTBOUND = 6;      // links shown at the bottom of each post
const MAX_INBOUND = 12;  // soft cap per post in the main pass
const MIN_INBOUND = 3;   // every post must receive at least this many links
const MAX_FORCED = 3;    // max "forced" links added to any one post

const STOP = new Set(
  ('a an and are as at be by for from how in into is it its of on or the to with your you our this that these those ' +
    'every any all best top new now vs will can need must have has try easy simple ways way ideas idea outfit outfits ' +
    'look looks style styles styling guide guides tips').split(' ')
);

function stem(w: string) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokens(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
    .map(stem)
    .filter((w) => !STOP.has(w));
}

type P = any;

function buildGraph(posts: P[]) {
  const n = posts.length;

  // 1) weighted term vectors
  const vecs: Map<string, number>[] = posts.map((p) => {
    const v = new Map<string, number>();
    const add = (text: string, weight: number) => {
      for (const t of tokens(text)) v.set(t, (v.get(t) || 0) + weight);
    };
    add(p.entry.title, 3);
    add((p.entry.tags || []).join(' '), 2);
    add(p.entry.description || '', 1);
    return v;
  });

  // 2) inverse document frequency
  const df = new Map<string, number>();
  vecs.forEach((v) => v.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const idf = (t: string) => Math.log((n + 1) / ((df.get(t) || 0) + 1)) + 0.1;

  const weighted = vecs.map((v) => {
    const w = new Map<string, number>();
    let norm = 0;
    v.forEach((tf, t) => {
      const x = tf * idf(t);
      w.set(t, x);
      norm += x * x;
    });
    return { w, norm: Math.sqrt(norm) || 1 };
  });

  // 3) similarity matrix
  const sim: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let dot = 0;
      const [small, big] = weighted[i].w.size < weighted[j].w.size ? [weighted[i], weighted[j]] : [weighted[j], weighted[i]];
      small.w.forEach((x, t) => {
        const y = big.w.get(t);
        if (y) dot += x * y;
      });
      let s = dot / (weighted[i].norm * weighted[j].norm);
      const ci: string[] = posts[i].entry.categories || [];
      const cj: string[] = posts[j].entry.categories || [];
      if (ci[0] && ci[0] === cj[0]) s += 0.12;
      else if (ci.some((c) => cj.includes(c))) s += 0.05;
      sim[i][j] = sim[j][i] = s;
    }
  }

  // 4) main pass: best pairs first, with an inbound cap
  const out: { to: number; forced: boolean }[][] = Array.from({ length: n }, () => []);
  const inc = new Array(n).fill(0);
  const has = (i: number, j: number) => out[i].some((e) => e.to === j);

  const pairs: [number, number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j) pairs.push([i, j, sim[i][j]]);
  pairs.sort((a, b) => b[2] - a[2] || posts[a[0]].slug.localeCompare(posts[b[0]].slug) || posts[a[1]].slug.localeCompare(posts[b[1]].slug));

  for (const [i, j] of pairs) {
    if (out[i].length < OUTBOUND && inc[j] < MAX_INBOUND && !has(i, j)) {
      out[i].push({ to: j, forced: false });
      inc[j]++;
    }
  }
  // anyone still short of OUTBOUND links: fill with their best remaining matches
  for (let i = 0; i < n; i++) {
    if (out[i].length >= OUTBOUND) continue;
    const cand = posts.map((_, j) => j).filter((j) => j !== i && !has(i, j)).sort((a, b) => sim[i][b] - sim[i][a]);
    for (const j of cand) {
      if (out[i].length >= OUTBOUND) break;
      out[i].push({ to: j, forced: false });
      inc[j]++;
    }
  }

  // 5) floor pass: nobody may be left (almost) orphaned
  const needy = posts.map((_, j) => j).filter((j) => inc[j] < MIN_INBOUND).sort((a, b) => inc[a] - inc[b]);
  for (const j of needy) {
    const cand = posts
      .map((_, i) => i)
      .filter((i) => i !== j && !has(i, j) && out[i].filter((e) => e.forced).length < MAX_FORCED)
      .sort((a, b) => sim[b][j] - sim[a][j]);
    for (const i of cand) {
      if (inc[j] >= MIN_INBOUND) break;
      out[i].push({ to: j, forced: true });
      inc[j]++;
    }
  }

  return { out, sim };
}

let cache: Promise<{ posts: P[]; graph: ReturnType<typeof buildGraph> }> | null = null;

async function load() {
  if (!cache) {
    cache = (async () => {
      const posts = await getAllPosts();
      return { posts, graph: buildGraph(posts) };
    })();
  }
  return cache;
}

/** Posts that `slug` should link to (forced links first, then best matches, max `limit`). */
export async function getRelatedPosts(slug: string, limit = OUTBOUND) {
  const { posts, graph } = await load();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return [];
  const edges = graph.out[i];
  const forced = edges.filter((e) => e.forced);
  const base = edges.filter((e) => !e.forced).sort((a, b) => graph.sim[i][b.to] - graph.sim[i][a.to]);
  const picked = [...forced, ...base].slice(0, limit);
  picked.sort((a, b) => graph.sim[i][b.to] - graph.sim[i][a.to]);
  return picked.map((e) => posts[e.to]);
}
