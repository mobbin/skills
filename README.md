# Skills

Agent skills for [Mobbin](https://mobbin.com) — the world's largest library of real app UI screenshots.

## What's included

- **Skills** in [`skills/`](skills/). They teach the agent when and how to use Mobbin.
- **The Mobbin MCP server** at `https://api.mobbin.com/mcp`. The plugin installs it for you. On first use your agent opens a browser to sign in to Mobbin. You need a Pro, Team, or Enterprise plan.

## Available Skills

### [search](skills/search/)

How to search Mobbin well. Loaded before every `search_screens`, `search_flows` or `search_sections` call.

**Covers:**
- Choosing the tool: app screens and components, marketing-site sections, or steps in a flow
- Choosing the mode: `deep` or `standard`
- Writing an effective query and pulling more results
- What to do when a search falls short

### [redesign-screen](skills/redesign-screen/)

Redesign a screen, section or component based on patterns from real apps. Share a screenshot, your code or a design file.

**Use when:**
- You want to redesign, improve, restyle or rebuild part of your UI
- You want a few directions to choose from, or specific problems fixed

**What it does:**
1. Asks about scope and what must not change
2. Searches Mobbin for how real apps handle the same screen
3. Updates the design inside your own design system
4. Returns a before and after image and a short report that cites the references

### [plain-writing](skills/plain-writing/)

Writing rules for the text a Mobbin skill hands to a person, such as a redesign report. Other Mobbin skills load it. It is not meant for writing outside them.

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
