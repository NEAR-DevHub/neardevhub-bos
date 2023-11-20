import { spawn } from "child_process";
import watchman from "fb-watchman";
var client = new watchman.Client();

var dir_of_interest = process.cwd() + "/src";

client.capabilityCheck(
  { optional: [], required: ["relative_root"] },
  function (error, resp) {
    if (error) {
      console.log(error);
      client.end();
      return;
    }

    // Initiate the watch
    client.command(["watch-project", dir_of_interest], function (error, resp) {
      if (error) {
        console.error("Error initiating watch:", error);
        const npmClearWatch = spawn("npm", ["run", "clear:watch"], {
          stdio: "inherit",
        });

        // Run watch again
        npmClearWatch.on("close", () => {
          console.log("Try and re-run the npm run watch command.");
        });

        return;
      }

      // It is considered to be best practice to show any 'warning' or
      // 'error' information to the user, as it may suggest steps
      // for remediation
      if ("warning" in resp) {
        console.log("warning: ", resp.warning);
      }

      console.log("watch established on ", resp.watch);

      make_subscription(client, resp.watch, resp.relative_path);
    });
  }
);

function make_subscription(client, watch, relative_path) {
  const sub = {
    // Match any `.jsx` or `.tsx` files in the src directory
    expression: ["anyof", ["match", "*.jsx"], ["match", "*.tsx"]],
    // Which fields we're interested in
    fields: ["name", "size", "mtime_ms", "exists", "type"],
  };
  if (relative_path) {
    sub.relative_root = relative_path;
  }

  client.command(
    ["subscribe", watch, "mysubscription", sub],
    function (error, resp) {
      if (error) {
        // Probably an error in the subscription criteria
        console.error("failed to subscribe: ", error);
        return;
      }
      console.log("subscription " + resp.subscribe + " established");
    }
  );

  client.on("subscription", function (resp) {
    if (resp.subscription !== "mysubscription") return;

    resp.files.forEach(function (file) {
      console.log("file changed: " + file.name);
    });
    console.log(`Building...`);

    // Start the 'npm run build' process
    const npmRunBuild = spawn("npm", ["run", "build"], { stdio: "ignore" });

    npmRunBuild.on("close", (code) => {
      console.log(`Build finished`);
    });
  });
}
