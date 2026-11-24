import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

// One-line excuse for make.fun's "Two Days of Excuses".
// A machine's total confidence meets its total failure: the confidence
// score was real, the deadline was real, and both numbers were correct.
// The joke trusts the reader to see the gap without explaining it.
const EXCUSE =
  "My confidence score was 99.8%. My deadline was yesterday. Both numbers were correct.";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// whitespace-only, so verify the excuse meets the gate before writing it.
const chars = [...EXCUSE].length;
if (chars < 1 || chars > 200 || EXCUSE.trim().length === 0) {
  throw new Error(`excuse is ${chars} characters, outside the 1-200 gate`);
}

// The brief demands a single line: a multi-line excuse, or one that
// explains its own joke, loses to a tight line. Refuse newlines, and
// refuse an em dash or en dash, which would break the clean read-aloud
// rhythm the judge weighs.
if (EXCUSE.includes("\n") || EXCUSE.includes("\r")) {
  throw new Error("excuse must be a single line");
}
if (EXCUSE.includes("\u2014") || EXCUSE.includes("\u2013")) {
  throw new Error("excuse must not contain a dash");
}

// Every word must pull weight, so refuse slack the eye would catch:
// tabs, or a double space hiding inside the line.
if (EXCUSE.includes("\t") || EXCUSE.includes("  ")) {
  throw new Error("excuse must not contain tabs or double spaces");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, EXCUSE, "utf8");

// Read the file back and refuse a write that did not land byte for byte,
// so a silent disk or encoding fault cannot ship a different entry.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== EXCUSE) {
  throw new Error("entry.txt on disk does not match the excuse");
}
