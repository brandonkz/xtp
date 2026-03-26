#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data.json');

function loadData() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function ensureArray(data, key) {
  if (!Array.isArray(data[key])) data[key] = [];
}

function addActivity(data, entry) {
  ensureArray(data, 'activityFeed');
  data.activityFeed.unshift(entry);
}

function addDecision(data, entry) {
  ensureArray(data, 'decisionsLog');
  data.decisionsLog.unshift(entry);
}

function addActionItem(data, item, owner, due) {
  ensureArray(data, 'actionItems');
  data.actionItems.unshift({ item, owner, due });
}

function usage() {
  console.log('Usage:');
  console.log('  node generate-data.js --add-activity "text"');
  console.log('  node generate-data.js --add-decision "text"');
  console.log('  node generate-data.js --add-action-item "text" --owner "Name" --due "When"');
}

function parseArgs(argv) {
  const args = { owner: 'Unassigned', due: 'TBD' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--add-activity') args.addActivity = argv[++i];
    else if (arg === '--add-decision') args.addDecision = argv[++i];
    else if (arg === '--add-action-item') args.addActionItem = argv[++i];
    else if (arg === '--owner') args.owner = argv[++i];
    else if (arg === '--due') args.due = argv[++i];
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.addActivity && !args.addDecision && !args.addActionItem) {
    usage();
    process.exit(1);
  }

  const data = loadData();

  if (args.addActivity) addActivity(data, args.addActivity);
  if (args.addDecision) addDecision(data, args.addDecision);
  if (args.addActionItem) addActionItem(data, args.addActionItem, args.owner, args.due);

  saveData(data);
  console.log('data.json updated');
}

main();
