import { MOCK_RPC_URL } from "./rpcmock";

export const BOS_LOADER_URL = "http://localhost:3030";

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
          receiver_id: "truedove38.near",
        },
      },
    },
    public_key: "ed25519:EQr7NpVYFu1XcVZ23Lb4Ga3KbDQgrYeTMTgBsYa26Bne",
  },
];

export let transactionCompleted = false;
export let lastReceiverId;
export let lastViewedAccessKey;

export async function setupRPCResponsesForDontAskAgain(page) {
  const devComponents = (await fetch(BOS_LOADER_URL).then((r) => r.json()))
    .components;

  await page.route(MOCK_RPC_URL, async (route) => {
    const request = await route.request();

    const requestPostData = request.postDataJSON();
    if (
      requestPostData.params &&
      requestPostData.params.account_id === "social.near" &&
      requestPostData.params.method_name === "get"
    ) {
      const social_get_key = JSON.parse(
        atob(requestPostData.params.args_base64)
      ).keys[0];

      const response = await route.fetch({
        url: MOCK_RPC_URL,
      });
      const json = await response.json();

      if (devComponents[social_get_key]) {
        const social_get_key_parts = social_get_key.split("/");
        const devWidget = {};
        devWidget[social_get_key_parts[0]] = { widget: {} };
        devWidget[social_get_key_parts[0]].widget[social_get_key_parts[2]] =
          devComponents[social_get_key].code;
        json.result.result = Array.from(
          new TextEncoder().encode(JSON.stringify(devWidget))
        );
      }
      await route.fulfill({ response, json });
    } else if (
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
      transactionCompleted = false;
      lastReceiverId =
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
              receiver_id: lastReceiverId,
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
      transactionCompleted = true;
    } else {
      route.fallback();
    }
  });
}
