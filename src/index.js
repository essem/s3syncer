const { spawnSync } = require("child_process");
const commander = require("commander");

commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .requiredOption("-s, --source <source-uri>", "Source URI")
  .requiredOption("-t, --target <target-uri>", "Target URI")
  .option(
    "-i, --sync-interval <seconds>",
    "Interval between each sync operation",
    60
  )
  .option("-d, --shutdown-delay <seconds>", "Final delay before last sync", 5)
  .parse(process.argv);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sync() {
  const cmd = `aws s3 sync ${commander.source} ${commander.target}`;
  console.log(cmd);
  const child = spawnSync(cmd, {
    stdio: "inherit",
    shell: true,
  });
}

let inShutdown = false;

async function main() {
  while (!inShutdown) {
    sync();

    console.log(`sleep for ${commander.syncInterval} seconds`);
    await sleep(commander.syncInterval * 1000);
  }
}

async function shutdown() {
  if (inShutdown) {
    console.log("already in shutdown");
    return;
  }

  inShutdown = true;
  console.log("start shutdown...");

  for (let i = commander.shutdownDelay; i > 0; i--) {
    console.log(i);
    await sleep(1000);
  }

  sync();

  console.log("goodbye");
  process.exit(0);
}

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
main();
