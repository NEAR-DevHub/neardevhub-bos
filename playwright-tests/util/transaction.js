const access_keys = [
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "social.near",
        },
      },
    },
    public_key: "ed25519:B4xZ7Behyw6kQjfohXBmvU96Drvg64KhvnoCzVEUzmyE",
  },
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "devhub.near",
        },
      },
    },
    public_key: "ed25519:GPphNAABcftyAH1tK9MCw69SprKHe5H1mTEncR6XBwL7",
  },
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "devgovgigs.near",
        },
      },
    },
    public_key: "ed25519:EQr7NpVYFu1XcVZ23Lb4Ga3KbDQgrYeTMTgBsYa26Bne",
  },
];

export function decodeResultJSON(resultArray) {
  return JSON.parse(new TextDecoder().decode(new Uint8Array(resultArray)));
}

export function encodeResultJSON(resultObj) {
  return Array.from(new TextEncoder().encode(JSON.stringify(resultObj)));
}

export async function mockTransactionSubmitRPCResponses(page, customhandler) {
  let transaction_completed = false;
  let last_receiver_id;
  let lastViewedAccessKey;
  await page.route("https://rpc.mainnet.near.org/", async (route) => {
    const request = await route.request();

    const requestPostData = request.postDataJSON();
    if (
      requestPostData.params &&
      requestPostData.params.request_type === "view_access_key_list"
    ) {
      const response = await route.fetch();
      const json = await response.json();
      json.result.keys = access_keys;

      await route.fulfill({ response, json });
    } else if (
      requestPostData.params &&
      requestPostData.params.request_type === "view_access_key"
    ) {
      const response = await route.fetch();
      const json = await response.json();

      lastViewedAccessKey = access_keys.find(
        (k) => k.public_key === requestPostData.params.public_key
      );
      json.result = lastViewedAccessKey.access_key;

      await route.fulfill({ response, json });
    } else if (requestPostData.method == "broadcast_tx_commit") {
      transaction_completed = false;
      last_receiver_id =
        lastViewedAccessKey.access_key.permission.FunctionCall.receiver_id;
      await page.waitForTimeout(1000);

      await route.fulfill({
        json: {
          jsonrpc: "2.0",
          result: {
            status: {
              SuccessValue: "",
            },
            transaction: {
              receiver_id: last_receiver_id,
            },
            transaction_outcome: {
              proof: [],
              block_hash: "9MzuZrRPW1BGpFnZJUJg6SzCrixPpJDfjsNeUobRXsLe",
              id: "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
              outcome: {
                logs: [],
                receipt_ids: ["BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"],
                gas_burnt: 223182562500,
                tokens_burnt: "22318256250000000000",
                executor_id: "sender.testnet",
                status: {
                  SuccessReceiptId:
                    "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh",
                },
              },
            },
            receipts_outcome: [],
          },
        },
      });
      transaction_completed = true;
    } else if (
      transaction_completed &&
      requestPostData.params &&
      requestPostData.params.method_name === "get_all_post_ids"
    ) {
      const response = await route.fetch();
      const json = await response.json();
      console.log(
        "modifying get_all_post_ids response to trick the posteditor to think that the post is submitted",
        json.result.result
      );
      const existing_post_ids = JSON.parse(
        new TextDecoder().decode(new Uint8Array(json.result.result))
      );
      json.result.result = Array.from(
        new TextEncoder().encode(JSON.stringify(existing_post_ids.slice(1)))
      );
      await route.fulfill({ response, json });
    } else if (
      transaction_completed &&
      requestPostData.params &&
      requestPostData.params.method_name === "get_post"
    ) {
      const response = await route.fetch();
      const json = await response.json();
      const get_post_response = JSON.parse(
        new TextDecoder().decode(new Uint8Array(json.result.result))
      );
      get_post_response.likes.push({
        author_id: "webassemblymusic.near",
        timestamp: "1709379904623715535",
      });
      json.result.result = Array.from(
        new TextEncoder().encode(JSON.stringify(get_post_response))
      );
      await route.fulfill({ response, json });
    } else if (customhandler) {
      await customhandler({
        route,
        request,
        transaction_completed,
        last_receiver_id,
        requestPostData,
      });
    } else {
      await route.continue();
    }
  });
}
