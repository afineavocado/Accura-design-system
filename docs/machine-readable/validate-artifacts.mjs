import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const artifacts = path.join(root, "artifacts");
const componentsDir = path.join(artifacts, "components");
const schemaPath = path.join(artifacts, "schema", "component-meta.schema.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const required = schema.required;
const allowedStatuses = new Set(schema.properties.meta.properties.artifactStatus.enum);
const errors = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${filePath}: invalid JSON (${error.message})`);
    return null;
  }
}

for (const fileName of fs.readdirSync(componentsDir).filter((file) => file.endsWith(".meta.json"))) {
  const filePath = path.join(componentsDir, fileName);
  const data = readJson(filePath);
  if (!data) continue;

  // Required fields
  for (const key of required) {
    if (!(key in data)) errors.push(`${fileName}: missing required field "${key}"`);
  }

  // Name format
  if (!/^[a-z][a-z0-9-]*$/.test(data.name ?? "")) {
    errors.push(`${fileName}: name must be kebab-case`);
  }

  // Artifact status
  if (!allowedStatuses.has(data.meta?.artifactStatus)) {
    errors.push(`${fileName}: invalid meta.artifactStatus "${data.meta?.artifactStatus}"`);
  }

  // Variants
  for (const [variantName, variant] of Object.entries(data.variants ?? {})) {
    if (!variant.type || !Array.isArray(variant.values) || !("default" in variant)) {
      errors.push(`${fileName}: variant "${variantName}" must include type, values, and default`);
    }
  }

  // Storybook file reference (v3) — agentic-ui is a sibling of "Machine Readable" under the repo root
  if (data.storybook?.file) {
    const storyPath = path.join(root, "..", "..", "accura-ui", data.storybook.file);
    if (!fs.existsSync(storyPath)) {
      errors.push(`${fileName}: storybook.file not found at ${data.storybook.file}`);
    }
  }

  // Warn if old examples field still present
  if (data.examples) {
    errors.push(`${fileName}: stale "examples" field — remove it (examples.tsx deleted, stories are the examples now)`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Artifact validation passed.");
