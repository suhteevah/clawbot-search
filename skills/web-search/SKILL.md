---
name: web-search
description: Search the web using free and paid providers (SearXNG, Tavily, Brave, Perplexity, Grok).
homepage: https://docs.openclaw.ai/tools/web
metadata: { "openclaw": { "emoji": "🔍" } }
---

# Web Search

Built-in `web_search` tool with multiple provider backends.

## Providers

### SearXNG (free, no API key)

Metasearch engine aggregating results from Google, DuckDuckGo, Bing, and more.
No API key required. Uses public instances by default, or self-host your own.

Config:

```yaml
tools:
  web:
    search:
      enabled: true
      provider: searxng
      searxng:
        baseUrl: https://search.inetol.net   # or your own instance
        engines: google,duckduckgo,bing       # optional
        language: en                          # optional
        safeSearch: 1                         # 0=off, 1=moderate, 2=strict
```

Env fallback: `SEARXNG_BASE_URL`

### Tavily (AI-optimized, 1k free queries/month)

AI-native search returning ranked results with relevance scores and optional
AI-generated answer summaries.

Config:

```yaml
tools:
  web:
    search:
      enabled: true
      provider: tavily
      tavily:
        apiKey: tvly-...
        searchDepth: basic       # or "advanced"
        includeAnswer: true
        includeRawContent: false
```

Env fallback: `TAVILY_API_KEY`

Get a free key: https://app.tavily.com

### Brave Search (requires API key)

Traditional web search with region/language support and freshness filters.

Config:

```yaml
tools:
  web:
    search:
      enabled: true
      provider: brave
      apiKey: BSA...
```

Env fallback: `BRAVE_API_KEY`

### Perplexity Sonar (requires API key)

AI-synthesized answers with citations, via Perplexity direct or OpenRouter.

Config:

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

Config:

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

## Quick test

```bash
# SearXNG (no key needed)
curl -s "https://search.inetol.net/search?q=openclaw&format=json" | jq '.results[:3]'

# Tavily (needs TAVILY_API_KEY)
curl -s -X POST https://api.tavily.com/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TAVILY_API_KEY" \
  -d '{"query":"openclaw","max_results":3}' | jq '.results[:3]'
```
