import { describe, expect, it } from "vitest";
import { validateConfigObject } from "./config.js";

describe("web search provider config", () => {
  it("accepts perplexity provider and config", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "perplexity",
            perplexity: {
              apiKey: "test-key",
              baseUrl: "https://api.perplexity.ai",
              model: "perplexity/sonar-pro",
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("accepts searxng provider and config", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "searxng",
            searxng: {
              baseUrl: "https://search.example.com",
              engines: "google,duckduckgo",
              language: "en",
              safeSearch: 1,
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("accepts searxng provider with no extra config (uses defaults)", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "searxng",
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("accepts tavily provider and config", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "tavily",
            tavily: {
              apiKey: "tvly-test-key",
              searchDepth: "advanced",
              includeRawContent: false,
              includeAnswer: true,
            },
          },
        },
      },
    });

    expect(res.ok).toBe(true);
  });

  it("rejects invalid searxng safeSearch value", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "searxng",
            searxng: {
              safeSearch: 5,
            },
          },
        },
      },
    });

    expect(res.ok).toBe(false);
  });

  it("rejects invalid tavily searchDepth value", () => {
    const res = validateConfigObject({
      tools: {
        web: {
          search: {
            enabled: true,
            provider: "tavily",
            tavily: {
              searchDepth: "invalid",
            },
          },
        },
      },
    });

    expect(res.ok).toBe(false);
  });
});
