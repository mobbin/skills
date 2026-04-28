# Skills

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

### [mobbin-search](skills/mobbin-search/)

Search Mobbin for real app screenshots and visually analyze them before answering design questions.

**Use when:**
- Exploring how top apps handle a specific screen or flow
- Looking for design inspiration or references before building
- Comparing UI patterns across apps
- Any design question where real-world examples would help

**What it does:**
1. Searches Mobbin's library via MCP (images returned inline)
2. Visually inspects each screenshot
3. Responds directly or offers to build an HTML evidence board for deeper analysis
4. Provides grounded observations with Mobbin links for further exploration

## Installation

```bash
npx skills add mobbin/mobbin-skills
```

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

<details>
<summary>Manual installation</summary>

```bash
git clone https://github.com/mobbin/mobbin-skills.git
cp -r mobbin-skills/skills/* ~/.claude/skills/
```

On Claude.ai, add the contents of a skill's `SKILL.md` to your project knowledge.
</details>

## Contributing

To add a new skill, create a directory under `skills/` with a `SKILL.md` file following the [Agent Skills](https://agentskills.io/) format.

## License

MIT
