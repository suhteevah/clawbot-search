---
name: web-search
description: "Search the web using free and paid providers. Use when you need current information, facts, documentation, news, or anything not in your training data. Default: SearXNG (free, no API key)."
homepage: https://github.com/suhteevah/clawbot-search
metadata:
  {
    "openclaw":
      {
        "emoji": "🔍",
        "requires": { "config": ["tools.web.search"] },
      },
  }
---

# Web Search

Built-in `web_search` tool with five provider backends. Defaults to **SearXNG** (free, no API key required).

## Choosing a provider

| Provider | Cost | API Key | Best for |
| --- | --- | --- | --- |
| **SearXNG** | Free | None | General search, privacy, no rate limits |
| **Tavily** | Free tier (1k/mo) | Required | AI-optimized results, answer summaries |
| **Brave** | Free tier (2k/mo) | Required | Traditional ranked results |
| **Perplexity** | Paid | Required | AI-synthesized answers with citations |
| **Grok** | Paid | Required | xAI grounded answers |

**Recommendation:** Start with SearXNG (zero setup). Add Tavily as a fallback for AI-optimized results.

## Provider configs

### SearXNG (default — free, no API key)

Metasearch engine aggregating results from Google, DuckDuckGo, Bing, and more.
No API key required. Uses public instances by default, or self-host your own.

```yaml
tools:
  web:
    search:
      enabled: true
      provider: searxng
      searxng:
        baseUrl: https://search.inetol.net   # or your own instance
        engines: google,duckduckgo,bing       # optional engine filter
        language: en                          # optional
        safeSearch: 1                         # 0=off, 1=moderate, 2=strict
```

Env fallback: `SEARXNG_BASE_URL`

**Public instances:** The default instance is `https://search.inetol.net`. If it's slow or down, try another from [searx.space](https://searx.space/).

**Self-hosted:** Run your own for maximum privacy and reliability:

```bash
docker run -d -p 8080:8080 searxng/searxng
# Then set baseUrl: http://localhost:8080
```

### Tavily (AI-optimized, 1k free queries/month)

AI-native search returning ranked results with relevance scores and optional
AI-generated answer summaries. Best for when you need a direct answer, not just links.

```yaml
tools:
  web:
    search:
      enabled: true
      provider: tavily
      tavily:
        apiKey: tvly-...
        searchDepth: basic       # or "advanced" (slower, deeper)
        includeAnswer: true      # get AI-generated answer summary
        includeRawContent: false # include full page content (heavy)
```

Env fallback: `TAVILY_API_KEY`

Get a free key: https://app.tavily.com

### Brave Search (requires API key)

Traditional web search with region/language support and freshness filters.
Good general-purpose search with a generous free tier.

```yaml
tools:
  web:
    search:
      enabled: true
      provider: brave
      apiKey: BSA...
```

Env fallback: `BRAVE_API_KEY`

Get a key: https://api.search.brave.com/app/keys

### Perplexity Sonar (requires API key)

AI-synthesized answers with citations, via Perplexity direct or OpenRouter.

```yaml
tools:
  web:
    search:
      enabled: true
      provider: perplexity
      perplexity:
        apiKey: pplx-...
        model: perplexity/sonar-pro
```

Env fallback: `PERPLEXITY_API_KEY` or `OPENROUTER_API_KEY`

### xAI Grok (requires API key)

AI-synthesized answers with web search grounding.

```yaml
tools:
  web:
    search:
      enabled: true
      provider: grok
      grok:
        apiKey: xai-...
        model: grok-4-1-fast
```

Env fallback: `XAI_API_KEY`

## How to use

The `web_search` tool accepts a search query and returns results from the configured provider.

```json
{
  "query": "latest Node.js LTS version"
}
```

Results include titles, URLs, and snippets. For Tavily with `includeAnswer: true`, you also get an AI-generated answer summary.

### Multi-step research pattern

For complex research, chain multiple searches:

1. Broad search to orient: `"React state management libraries 2026"`
2. Narrow search for specifics: `"Zustand vs Jotai performance benchmarks"`
3. Targeted search for docs: `"Zustand middleware documentation"`

### Combining with other tools

- **web_search → bash**: Search for a solution, then run commands to apply it
- **web_search → read**: Search for a file format spec, then read a local file to validate
- **web_search → discord/slack**: Search for info, then share findings in a channel

## Guardrails

- **Rate limits:** SearXNG public instances may throttle heavy use. Space out rapid queries or self-host.
- **Accuracy:** Search results are not verified facts. Cross-reference important claims.
- **Freshness:** Results depend on the provider's index. For breaking news, Brave and SearXNG tend to be most current.
- **Privacy:** SearXNG does not track queries. Tavily, Brave, Perplexity, and Grok send queries to their respective APIs.
- **Caching:** Results are cached to avoid duplicate API calls for the same query within a session.

## Switching providers at runtime

Change the provider in your config file or set the environment variable. No restart needed — the provider is resolved per-search:

```bash
# Quick switch to Tavily for one session
export TAVILY_API_KEY=tvly-your-key-here
# Then update config: provider: tavily
```

## Quick test

Verify your provider is working:

```bash
# SearXNG (no key needed — should work immediately)
curl -s "https://search.inetol.net/search?q=openclaw&format=json" | jq '.results[:3]'

# Tavily (needs TAVILY_API_KEY)
curl -s -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TAVILY_API_KEY" \
  -d '{"query":"openclaw","max_results":3}' | jq '.results[:3]'
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| SearXNG returns empty results | Try a different public instance from [searx.space](https://searx.space/) |
| Tavily 401 Unauthorized | Check `TAVILY_API_KEY` or `tavily.apiKey` in config |
| Brave 429 Too Many Requests | You hit the rate limit. Switch to SearXNG (free, no limits) |
| Search results feel stale | Try Brave or SearXNG — they index more frequently |
| No results for niche topics | Try `searchDepth: advanced` with Tavily, or add more specific keywords |

## Ideas to try

- Search for error messages you encounter during debugging.
- Look up library documentation and API references.
- Research current best practices before starting a new feature.
- Fact-check dates, versions, and compatibility before recommending tools.
- Find public SearXNG instances if the default one is slow: search for "searx.space".
- Compare multiple search providers on the same query to see which gives better results for your use case.
