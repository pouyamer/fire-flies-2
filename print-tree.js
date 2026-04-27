#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG = {
  exclude: [],
  respectGitIgnore: true,
  ignoreGitDirectory: true,
  outputFile: 'a.txt'
};

function loadConfig() {
  const configPath = path.join(process.cwd(), "tree.config.json");

  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return { ...DEFAULT_CONFIG, ...config };
  } catch {
    console.error("Invalid config file. Using defaults.");
    return DEFAULT_CONFIG;
  }
}

function loadGitIgnore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");

  if (!fs.existsSync(gitignorePath)) return [];

  return fs
    .readFileSync(gitignorePath, "utf8")
    .split("\n")
    .map(x => x.trim())
    .filter(x => x && !x.startsWith("#"));
}

function matchPattern(pattern, target) {
  const regex = new RegExp(
    "^" +
      pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*") +
      "$"
  );
  return regex.test(target);
}

function shouldExclude(relativePath, name, config, gitPatterns) {
  if (config.ignoreGitDirectory && name === ".git") {
    return true;
  }

  const patterns = [
    ...config.exclude,
    ...(config.respectGitIgnore ? gitPatterns : [])
  ];

  return patterns.some(pattern =>
    matchPattern(pattern, name) || matchPattern(pattern, relativePath)
  );
}

function buildTree(dir, prefix, config, gitPatterns, lines) {
  const entries = fs.readdirSync(dir).sort((a, b) => a.localeCompare(b));

  const filtered = entries.filter(entry => {
    const full = path.join(dir, entry);
    const rel = path.relative(process.cwd(), full);
    return !shouldExclude(rel, entry, config, gitPatterns);
  });

  filtered.forEach((entry, index) => {
    const full = path.join(dir, entry);

    const isLast = index === filtered.length - 1;
    const connector = isLast ? "└── " : "├── ";

    lines.push(prefix + connector + entry);

    if (fs.statSync(full).isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      buildTree(full, nextPrefix, config, gitPatterns, lines);
    }
  });
}

function main() {
  const config = loadConfig();
  const gitPatterns = loadGitIgnore();

  const rootName = path.basename(process.cwd());
  const lines = [rootName];

  buildTree(process.cwd(), "", config, gitPatterns, lines);

  const result = lines.join("\n");

  console.log(result);

  if (config.outputFile) {
    const outputPath = path.join(process.cwd(), config.outputFile);
    fs.writeFileSync(outputPath, result, "utf8");
    console.log(`\nSaved to ${config.outputFile}`);
  }
}

main();
