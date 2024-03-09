export async function mockTransactionSubmitRPCResponses(page, receiver_id) {
    await page.route("https://rpc.mainnet.near.org/", async (route) => {
      const request = await route.request();

      const requestPostData = request.postDataJSON();
      if (
        requestPostData.params &&
        requestPostData.params.request_type === "view_access_key_list"
      ) {

        const response = await route.fetch();
        const json = await response.json();
        json.result.keys = [{
          "access_key": {
            "nonce": 109629226000005, "permission": {
              "FunctionCall": {
                "allowance": "241917078840755500000000", "method_names": [],
                receiver_id
              }
            }
          },
          "public_key": "ed25519:EQr7NpVYFu1XcVZ23Lb4Ga3KbDQgrYeTMTgBsYa26Bne"
        }];

        console.log("Replacing RPC response when listing access keys", JSON.stringify(json));
        await route.fulfill({ response, json });
      } else if (requestPostData.params &&
        requestPostData.params.request_type === "view_access_key") {
        const response = await route.fetch();
        const json = await response.json();

        json.result = {
          "nonce": 85,
          "permission": {
            "FunctionCall": {
              "allowance": "241917078840755500000000",
              receiver_id,
              "method_names": []
            }
          },
          "block_height": 19884918,
          "block_hash": "GGJQ8yjmo7aEoj8ZpAhGehnq9BSWFx4xswHYzDwwAP2n"
        };

        console.log("Replacing RPC response when viewing access key", JSON.stringify(json));
        await route.fulfill({ response, json });
      } else if (requestPostData.method == 'broadcast_tx_commit') {
        console.log("Replacing RPC response when broadcasting tx", JSON.stringify(requestPostData));
        await route.fulfill({
          json: {
            "jsonrpc": "2.0",
            "result": {
              "status": {
                "SuccessValue": ""
              },
              "transaction": {
                receiver_id
              },
              "transaction_outcome": {
                "proof": [],
                "block_hash": "9MzuZrRPW1BGpFnZJUJg6SzCrixPpJDfjsNeUobRXsLe",
                "id": "ASS7oYwGiem9HaNwJe6vS2kznx2CxueKDvU9BAYJRjNR",
                "outcome": {
                  "logs": [],
                  "receipt_ids": ["BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"],
                  "gas_burnt": 223182562500,
                  "tokens_burnt": "22318256250000000000",
                  "executor_id": "sender.testnet",
                  "status": {
                    "SuccessReceiptId": "BLV2q6p8DX7pVgXRtGtBkyUNrnqkNyU7iSksXG7BjVZh"
                  }
                }
              },
              "receipts_outcome": [

              ]
            }
          }
        });
      } else {
        console.log('unmodified', JSON.stringify(requestPostData));
        await route.continue();
      }
    });
}