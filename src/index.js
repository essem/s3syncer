const { spawnSync } = require("child_process");

const source = "/logs";
const target = "s3://mybucket/";
const syncInterval = 3;
const shutdownDelay = 3;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sync() {
  const cmd = `aws s3 sync ${source} ${target}`;
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

    console.log(`sleep for ${syncInterval} seconds`);
    await sleep(syncInterval * 1000);
  }
}

async function shutdown() {
  if (inShutdown) {
    console.log("already in shutdown");
    return;
  }

  inShutdown = true;
  console.log("start shutdown...");

  for (let i = shutdownDelay; i > 0; i--) {
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
