// Validates the plugin manifests in this repo.
//
// The same plugin is described once per host (Agent Plugins, Claude Code, Cursor, Grok).
// These checks make sure each file is valid and that the copies don't drift apart.
//
// Usage: npm run validate

import Ajv from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Every host shares one MCP config, in the Agent Plugins format.
const MCP_CONFIG = "./mcp.json";

// Host-specific manifests that must mirror the root plugin.json.
const HOST_MANIFESTS = [".claude-plugin/plugin.json", ".cursor-plugin/plugin.json", ".grok-plugin/plugin.json"];

// Fields that every manifest copy must share with plugin.json.
const SHARED_FIELDS = ["name", "version", "description", "license"];

const CHECKS = [
  {
    title: "plugin.json matches the Agent Plugins schema",
    run: () => schemaProblems("plugin.json", "schemas/1.0.0/plugin.schema.json"),
  },
  {
    title: "mcp.json matches the Agent Plugins schema",
    run: () => schemaProblems("mcp.json", "schemas/1.0.0/mcp.schema.json"),
  },
  {
    title: "Host manifests match plugin.json",
    run: hostManifestProblems,
  },
  {
    title: "Claude marketplace lists the plugin without its own version",
    run: marketplaceProblems,
  },
];

// Each check returns a list of problems; an empty list means it passed.

function schemaProblems(file, schemaFile) {
  const ajv = new Ajv({ allErrors: true, strict: true });
  if (ajv.validate(readJson(schemaFile), readJson(file))) return [];
  return ajv.errors.map((error) => {
    const extra = error.params?.additionalProperty;
    return `${file}: ${error.instancePath || "/"} ${error.message}${extra ? ` ("${extra}")` : ""}`;
  });
}

function hostManifestProblems() {
  const plugin = readJson("plugin.json");
  return HOST_MANIFESTS.flatMap((file) => {
    const manifest = readJson(file);
    const problems = SHARED_FIELDS.filter((field) => manifest[field] !== plugin[field]).map(
      (field) => `${file}: ${field} is "${manifest[field]}", but plugin.json has "${plugin[field]}"`,
    );
    if ("mcpServers" in manifest && manifest.mcpServers !== MCP_CONFIG) {
      problems.push(`${file}: mcpServers must be "${MCP_CONFIG}"`);
    }
    return problems;
  });
}

function marketplaceProblems() {
  const file = ".claude-plugin/marketplace.json";
  const { name } = readJson("plugin.json");
  const entry = readJson(file).plugins?.find((plugin) => plugin.name === name);
  if (!entry) return [`${file}: no plugin entry named "${name}"`];
  // Claude Code reads the version from plugin.json first, so a second copy can only drift.
  if ("version" in entry) return [`${file}: remove "version" from the "${name}" entry`];
  return [];
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, file), "utf8"));
  } catch (error) {
    throw new Error(`${file}: ${error.message}`);
  }
}

// Runs every check, even after one fails, and prints a line per check.
function main() {
  let failed = 0;
  for (const { title, run } of CHECKS) {
    let problems;
    try {
      problems = run();
    } catch (error) {
      problems = [error.message];
    }
    console.log(`${problems.length === 0 ? "PASS" : "FAIL"}: ${title}`);
    for (const problem of problems) console.log(`  - ${problem}`);
    if (problems.length > 0) failed += 1;
  }

  if (failed > 0) {
    console.error(`\n${failed} of ${CHECKS.length} checks failed.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll checks passed.");
  }
}

main();
