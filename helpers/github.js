const { execSync } = require('child_process');
execSync("git add .");
execSync("git commit -m \"" + process.argv[2] + "\"");
execSync("git push");
