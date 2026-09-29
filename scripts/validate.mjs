import Ajv from "ajv/dist/2020.js";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const errors = [];

function fail(message) {
  errors.push(message);
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(resolve(root, path), "utf8"));
  } catch (error) {
    fail(`${path}: ${error.message}`);
    return null;
  }
}

function validateSchema(schemaPath, data, label) {
  if (data === null) return;
  const schema = require(resolve(root, schemaPath));
  const ajv = new Ajv({ allErrors: true, strict: true });
  const valid = ajv.validate(schema, data);
  if (!valid) {
    for (const error of ajv.errors ?? []) {
      fail(`${label}: ${error.instancePath || "/"} ${error.message}`);
    }
  }
}

const plugin = await readJson("plugin.json");
const mcp = await readJson("mcp.json");
validateSchema("schemas/1.0.0/plugin.schema.json", plugin, "plugin.json");
validateSchema("schemas/1.0.0/mcp.schema.json", mcp, "mcp.json");

// Every host manifest describes the same plugin, so the copies must agree.
const hostManifests = [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", ".grok-plugin/plugin.json"];
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json");

for (const path of hostManifests) {
  const manifest = await readJson(path);
  if (!plugin || !manifest) continue;
  for (const field of ["name", "version", "description", "license"]) {
    if (plugin[field] !== manifest[field]) {
      fail(`${path}: ${field} "${manifest[field]}" differs from plugin.json "${plugin[field]}"`);
    }
  }
  // mcp.json is the only MCP config; a host manifest that names one must point at it.
  if ("mcpServers" in manifest && manifest.mcpServers !== "./mcp.json") {
    fail(`${path}: mcpServers must be "./mcp.json"`);
  }
}

if (plugin && claudeMarketplace) {
  const entry = claudeMarketplace.plugins?.find((p) => p.name === plugin.name);
  if (!entry) {
    fail(`.claude-plugin/marketplace.json: no plugin entry named "${plugin.name}"`);
  } else if ("version" in entry) {
    // Claude Code reads the version from plugin.json first; a second copy only drifts.
    fail(`.claude-plugin/marketplace.json: remove "version" from the "${plugin.name}" entry`);
  }
}

if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} validation error${errors.length === 1 ? "" : "s"}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("PASS: plugin.json schema");
  console.log("PASS: mcp.json schema");
  console.log("PASS: host manifests match plugin.json and mcp.json");
  console.log("Validation passed.");
}
