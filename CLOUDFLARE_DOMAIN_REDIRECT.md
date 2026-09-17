# Cloudflare Pages domain consolidation

The production canonical domain is `https://outfitedits.com/`.

The old `https://fashion-blog.pages.dev/` hostname should redirect to the custom domain so Google sees one public host.

Cloudflare Pages `_redirects` does **not** support domain-level redirects, so this one step must be configured in the Cloudflare dashboard:

1. Open **Workers & Pages → your Pages project → Bulk Redirects**.
2. Create a redirect list with source `https://fashion-blog.pages.dev` and target `https://outfitedits.com`.
3. Use **301**, preserve query strings, enable **subpath matching / preserve path suffix**.
4. Deploy/save the rule.

After propagation, `https://fashion-blog.pages.dev/any/path` should land on the same path at `https://outfitedits.com/any/path`.

Do not create a Pages `_redirects` rule that sends all requests to `outfitedits.com`; Cloudflare documents `_redirects` as path-based and explicitly recommends Bulk Redirects for `*.pages.dev` → custom-domain consolidation.
