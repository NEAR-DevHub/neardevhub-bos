export async function findKeysInCache(page, searchFor) {
  await page.evaluate(async (searchFor) => {
    const dbName = "cacheDb";
    const storeName = "cache-v1";

    return await new Promise((resolve) => {
      // Opening the database
      request = indexedDB.open(dbName);

      request.onerror = function (event) {
        console.error("Database error: ", event.target.error);
      };

      request.onsuccess = function (event) {
        const db = event.target.result;

        // Opening a transaction and getting the object store
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);

        // Opening a cursor to iterate over all items in the store
        const cursorRequest = objectStore.openCursor();

        cursorRequest.onerror = function (event) {
          console.error("Cursor opening error: ", event.target.error);
        };

        const foundEntries = [];
        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor) {
            // Convert the cursor key to a string and search for the partial string
            const keyAsString = JSON.stringify(cursor.key);
            if (keyAsString.includes(searchFor)) {
              console.log("Found key", cursor.key);
              console.log("Found entry with matching key: ", cursor.value);
              foundEntries.push({ key: cursor.key, value: cursor.value });
            }
            cursor.continue(); // Move to the next item in the store
          } else {
            // No more entries
            resolve(foundEntries);
            console.log("Finished searching the object store.");
          }
        };
      };
    });
  }, searchFor);
}

export async function setDontAskAgainCacheValues(page, widgetSrc, methodname) {
  await page.evaluate(
    async (args) => {
      const { widgetSrc, methodname } = args;
      await new Promise((resolve) => {
        const dbName = "cacheDb";
        const storeName = "cache-v1";
        const key = JSON.stringify({
          action: "LocalStorage",
          domain: {
            page: "confirm_transactions",
          },
          key: {
            widgetSrc,
            contractId: "devgovgigs.near",
            type: "send_transaction_without_confirmation",
          },
        });
        const newValue = {};
        newValue[methodname] = true;

        const request = indexedDB.open(dbName);

        request.onerror = function (event) {
          console.error("Database error: ", event.target.error);
        };

        request.onsuccess = function (event) {
          const db = event.target.result;

          const transaction = db.transaction([storeName], "readwrite");
          const objectStore = transaction.objectStore(storeName);

          const updateRequest = objectStore.put(newValue, key);

          updateRequest.onerror = function (event) {
            console.error("Error updating data: ", event.target.error);
          };

          updateRequest.onsuccess = function (event) {
            console.log("Data updated for key:", key);
            resolve();
          };
        };
      });
    },
    { widgetSrc, methodname }
  );
}

export async function getDontAskAgainCacheValues(page, widgetSrc) {
  const storedData = await page.evaluate(async (widgetSrc) => {
    return await new Promise((resolve) => {
      const dbName = "cacheDb";
      const storeName = "cache-v1";
      const key = JSON.stringify({
        action: "LocalStorage",
        domain: { page: "confirm_transactions" },
        key: {
          widgetSrc,
          contractId: "devgovgigs.near",
          type: "send_transaction_without_confirmation",
        },
      });

      // Opening the database
      const request = indexedDB.open(dbName);

      request.onerror = function (event) {
        console.error("Database error: ", event.target.error);
      };

      request.onsuccess = function (event) {
        const db = event.target.result;

        // Opening a transaction and getting the object store
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);

        // Getting the data by key
        const dataRequest = objectStore.get(key);

        dataRequest.onerror = function (event) {
          console.error("Error fetching data: ", event.target.error);
        };

        dataRequest.onsuccess = function (event) {
          if (dataRequest.result) {
            console.log("Found data: ", dataRequest.result);
            resolve(dataRequest.result);
          } else {
            console.log("No data found for key:", key);
          }
        };
      };
    });
  }, widgetSrc);
  return storedData;
}
