function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let shutdown = false;

async function main() {
  while (!shutdown) {
    console.log(new Date());
    await sleep(1000);
  }
}

async function cleanup() {
  if (shutdown) {
    console.log("already in shutdown");
    return;
  }

  shutdown = true;
  console.log("start shutdown...");

  for (let i = 5; i > 0; i--) {
    console.log(i);
    await sleep(1000);
  }

  console.log("exit");
  process.exit(0);
}

process.on("SIGINT", () => cleanup());
process.on("SIGTERM", () => cleanup());
main();
