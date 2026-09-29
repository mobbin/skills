# Contributing

This repository is Mobbin's agent plugin: the skills in `skills/` plus Mobbin's hosted MCP server, packaged for each agent host that installs plugins.

## Repository layout

```text
skills/
├── skills/<name>/SKILL.md          # Skills (Agent Skills format)
├── plugin.json                     # Agent Plugins 1.0.0 manifest
├── mcp.json                        # Agent Plugins 1.0.0 MCP config
├── .claude-plugin/
│   ├── plugin.json                 # Claude Code plugin manifest
│   └── marketplace.json            # Claude Code marketplace catalog
├── .mcp.json                       # Claude Code MCP config
├── schemas/1.0.0/                  # Agent Plugins JSON schemas, used by the validator
├── scripts/validate.mjs            # Schema and cross-manifest checks
└── .github/workflows/validate.yml  # Runs the validator on every push and PR
```

## What each file is for

| File | Read by | What it does |
| --- | --- | --- |
| `skills/<name>/SKILL.md` | Every host, and `npx skills add` | The skills. Every host looks for them in `skills/`, so no manifest lists them. |
| `plugin.json` | VS Code / GitHub Copilot, Codex, and other [Agent Plugins](https://agent-plugins.org) clients | The vendor-neutral manifest. Hosts recognise it by its `$schema`. The schema is closed, so only the fields listed in `schemas/1.0.0/plugin.schema.json` are allowed. |
| `mcp.json` | Agent Plugins clients, Cursor | Connects the host to `https://api.mobbin.com/mcp` using `"type": "streamable-http"`. |
| `.claude-plugin/plugin.json` | Claude Code | Makes the repo a Claude Code plugin. `mcpServers` points at `.mcp.json`, so installing the plugin also installs the MCP server. Skill names get the plugin name as a prefix, as in `mobbin:mobbin-search`. |
| `.claude-plugin/marketplace.json` | Claude Code | Makes the repo a marketplace, so users can run `/plugin marketplace add mobbin/skills` and `/plugin install mobbin@mobbin`. `mobbin@mobbin` is the entry name, then `@`, then the marketplace name. |
| `.mcp.json` | Claude Code | The same MCP server as `mcp.json`, written in Claude's format (`"type": "http"`). Claude Code also reads this file as the project MCP config, so opening this repo in Claude Code asks you to approve the `mobbin` server. |

Claude Code doesn't read the Agent Plugins format, and Agent Plugins doesn't allow Claude's fields. That's why there are two manifests and two MCP configs.

### Rules that keep the manifests in sync

`npm run validate` checks the following:

- `name`, `version`, `description` and `license` are the same in `plugin.json` and `.claude-plugin/plugin.json`.
- The entry in `.claude-plugin/marketplace.json` has the same `name` as the plugin and no `version`. Claude Code takes the version from `plugin.json`, and a second copy would only drift from it.
- `mcp.json` and `.mcp.json` list the same servers and URLs.

Don't rename the plugin. `mobbin` is the install ID and the skill prefix, and changing it breaks existing installs. To change the name users see, add a display name instead.

## Testing a change

### 1. Validate

```bash
npm ci
npm run validate          # Agent Plugins schemas and cross-manifest checks (also runs in CI)
claude plugin validate .  # Claude Code's own check of marketplace.json and .claude-plugin/plugin.json
```

Both commands should end with `Validation passed`.

### 2. Install in Claude Code

To avoid touching your own Claude Code setup, install into a throwaway config directory:

```bash
export CLAUDE_CONFIG_DIR="$(mktemp -d)"
claude plugin marketplace add ./
claude plugin install mobbin@mobbin
claude plugin details mobbin   # lists the skills and the mobbin MCP server
claude mcp list                # plugin:mobbin:mobbin should show "Needs authentication"
```

`Needs authentication` means the server is reachable and waiting for OAuth. To go further, run `claude` with the same `CLAUDE_CONFIG_DIR`, sign in through `/mcp`, and ask a design question such as "how do top apps design onboarding?". The `mobbin-search` skill should load and call `search_screens`.

To try an edit without reinstalling, run `claude --plugin-dir .`.

### 3. Install in VS Code

Turn on `chat.plugins.enabled`, then either run **Chat: Install Plugin From Source** with the path to your checkout or add it to `chat.pluginLocations`. Check that the skills and the `mobbin` MCP server appear in the chat customization views.

## Releasing

1. Bump `version` in both `plugin.json` and `.claude-plugin/plugin.json`.
2. Run `npm run validate`.
3. Merge to `main`.

Claude Code users only get the new files when `version` changes. If you push without a bump, installed copies stay on the old version.
