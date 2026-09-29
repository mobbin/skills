# Skills

Agent skills for [Mobbin](https://mobbin.com) — the world's largest library of real app UI screenshots.

## What's included

- **Skills** in [`skills/`](skills/). They teach the agent when and how to use Mobbin.
- **The Mobbin MCP server** at `https://api.mobbin.com/mcp`. The plugin installs it for you. On first use your agent opens a browser to sign in to Mobbin. You need a Pro, Team, or Enterprise plan.

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

Where your agent supports plugins, install the plugin. It sets up the skills and the MCP server together.

### Claude Code

```
/plugin marketplace add mobbin/skills
/plugin install mobbin@mobbin
```

### VS Code / GitHub Copilot

1. Turn on `chat.plugins.enabled` in VS Code settings.
2. Run **Chat: Install Plugin From Source** from the Command Palette.
3. Enter `https://github.com/mobbin/skills`.

### Cursor

Install **Mobbin** from the [Cursor Marketplace](https://cursor.com/marketplace).

### Other agents: skills only

```bash
npx skills add mobbin/skills
```

This installs only the skills, so add the MCP server to your agent's MCP config yourself:

```json
{
  "mcpServers": {
    "mobbin": {
      "url": "https://api.mobbin.com/mcp"
    }
  }
}
```

<details>
<summary>Manual installation</summary>

```bash
git clone https://github.com/mobbin/skills.git
cp -r skills/skills/* ~/.claude/skills/
```

On Claude.ai, add the contents of a skill's `SKILL.md` to your project knowledge.
</details>

The MCP server on its own, for clients without plugin support, is documented in [`mobbin/mobbin-mcp-server`](https://github.com/mobbin/mobbin-mcp-server).

## License

MIT
