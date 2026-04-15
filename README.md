# Mobbin Skills

Agent skills for [Mobbin](https://mobbin.com) — the world's largest library of real app UI screenshots.

## Prerequisites

- **Mobbin MCP Server** — these skills require the Mobbin MCP server (`api.mobbin.com/mcp`) to be configured in your AI coding agent. Add it to your MCP client config:
  ```json
  {
    "mcpServers": {
      "mobbin": {
        "url": "https://api.mobbin.com/mcp"
      }
    }
  }
  ```

## Available Skills

### [mobbin-design-reference](skills/mobbin-design-reference/)

Search Mobbin for real app screenshots, download them locally, and visually analyze them before answering design questions.

**Use when:**
- Exploring how top apps handle a specific screen or flow
- Looking for design inspiration or references before building
- Comparing UI patterns across apps
- Any design question where real-world examples would help

**What it does:**
1. Searches Mobbin's library via MCP
2. Downloads screenshots locally so the agent can actually view them
3. Visually inspects each image (not just metadata)
4. Provides grounded analysis with Mobbin links for further exploration

## Installation

### Claude Code

```bash
# Clone the repo
git clone https://github.com/mobbin/mobbin-skills.git

# Copy skills to your Claude skills directory
cp -r mobbin-skills/skills/* ~/.claude/skills/
```

Or install a single skill:

```bash
cp -r mobbin-skills/skills/mobbin-design-reference ~/.claude/skills/
```

### Claude.ai

Add the contents of a skill's `SKILL.md` to your project knowledge.

## Contributing

To add a new skill, create a directory under `skills/` with a `SKILL.md` file following the [Agent Skills](https://agentskills.io/) format.

## License

MIT
