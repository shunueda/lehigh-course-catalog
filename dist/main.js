import { existsSync, readFileSync, writeFileSync } from 'fs';
import _ from "lodash";
const THREADS = 2;
const BROWSER_RESTART = 8;
const CHECKPOINT_FILE = 'checkpoint';
const COURSE_NUMBER_LIMIT = 499;
const checkpoint = existsSync(CHECKPOINT_FILE) ? parseInt(readFileSync(CHECKPOINT_FILE).toString()) : 0;
const browser_chunks = _.chunk([...new Array(COURSE_NUMBER_LIMIT + 1).keys()], COURSE_NUMBER_LIMIT / BROWSER_RESTART + 1);
const chunks = browser_chunks.map(browser_chunk => _.chunk(browser_chunk, browser_chunk.length / THREADS + 1));
const browsers = [];
// Increment checkpoint
writeFileSync(CHECKPOINT_FILE, (checkpoint + 1).toString());
//# sourceMappingURL=main.js.map