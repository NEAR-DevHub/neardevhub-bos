import { MOCK_RPC_URL } from "./rpcmock.js";

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
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "events-committee.near",
        },
      },
    },
    public_key: "ed25519:9enAAsDiQ2NvKU2TsHLETp96sYeN2qkbHxhpXLjCQThS",
  },
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "infrastructure-committee.near",
        },
      },
    },
    public_key: "ed25519:H8bRwTywvrCYbGuJtBuCAaZLjBBgAPKPAZKrWjA8Pj17",
  },
  {
    access_key: {
      nonce: 109629226000005,
      permission: {
        FunctionCall: {
          allowance: "241917078840755500000000",
          method_names: [],
          receiver_id: "infrastructure-committee.near",
        },
      },
    },
    public_key: "ed25519:G6PXTFq5xNvyYL4LttWVvHo7srmfGuTumX5W7JyXV21P",
  },
];

export function decodeResultJSON(resultArray) {
  return JSON.parse(new TextDecoder().decode(new Uint8Array(resultArray)));
}

export function encodeResultJSON(resultObj) {
  return Array.from(new TextEncoder().encode(JSON.stringify(resultObj)));
}

export async function mockTransactionSubmitRPCResponses(page, customhandler) {
  const status = {
    transaction_completed: false,
    last_receiver_id: undefined,
    lastViewedAccessKey: undefined,
    last_transaction: undefined,
  };

  await page.route(
    (url) =>
      url.origin === "https://rpc.mainnet.near.org" ||
      url.toString().startsWith(MOCK_RPC_URL),
    async (route) => {
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

        status.lastViewedAccessKey = access_keys.find(
          (k) => k.public_key === requestPostData.params.public_key
        );
        json.result = status.lastViewedAccessKey.access_key;
        delete json.error;

        await route.fulfill({ response, json });
      } else if (
        requestPostData.params &&
        requestPostData.params.request_type === "call_function" &&
        requestPostData.params.method_name === "get_account_storage"
      ) {
        const response = await route.fetch();
        const json = await response.json();

        const storage = { used_bytes: 221234, available_bytes: 1337643 };
        json.result.result = Array.from(
          new TextEncoder().encode(JSON.stringify(storage))
        );

        await route.fulfill({ response, json });
      } else if (requestPostData.method == "broadcast_tx_commit") {
        status.transaction_completed = false;
        status.last_receiver_id =
          status.lastViewedAccessKey.access_key.permission.FunctionCall.receiver_id;
        status.last_transaction = requestPostData;

        await page.waitForTimeout(1000);

        await route.fulfill({
          json: {
            jsonrpc: "2.0",
            result: {
              status: {
                SuccessValue: "",
              },
              transaction: {
                receiver_id: status.last_receiver_id,
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
        status.transaction_completed = true;
      } else if (
        status.transaction_completed &&
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
        status.transaction_completed &&
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
          transaction_completed: status.transaction_completed,
          last_receiver_id: status.last_receiver_id,
          last_transaction: status.last_transaction,
          requestPostData,
        });
      } else {
        await route.continue();
      }
    }
  );
  return status;
}
