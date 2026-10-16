// Sends visitors who land on the preview host's root to the pest-control home page.
import { writeFileSync } from 'node:fs';

writeFileSync('dist/_redirects', '/ /pest-control/ 302\n');
