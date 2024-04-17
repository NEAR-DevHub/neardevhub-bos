#!/bin/sh

# Define the contract and account
CONTRACT="devhub.near"
# !! Define the account that will sign the transactions
ACCOUNT="thomasguntenaar.near"

# Define the list of community handles
# !! uncomment: COMMUNITY_HANDLES="nft hot-ideas protocol contract-standards tooling wallet validators zero-knowledge akaia dao challenges build hacks keypom refi ndc owa developer-dao near-discovery component-libraries documentation harmonic devhub-platform fellowship devrel near-campus devhub-marketing near-enterprise ariz-portfolio nearukraine near-thailand onboard security webassemblymusic she-is-near data neardevnews chain-abstraction"
COMMUNITY_HANDLES="webassemblymusic"

# Iterate through each community handle
for HANDLE in $COMMUNITY_HANDLES; do
    # Fetch current community data
    COMMUNITY_DATA=$(near contract call-function as-read-only $CONTRACT get_community json-args "{\"handle\": \"$HANDLE\"}" network-config mainnet now)
    
     # Check if fetching community data was successful
    if [ $? -ne 0 ]; then
        echo "Failed to fetch data for community: $HANDLE"
        continue
    fi

    # Extract current addons from community data using jq
    CURRENT_ADDONS=$(echo $COMMUNITY_DATA | jq -c '.addons')
    
    # Prepare the list of new addons, including the required ones
    NEW_ADDONS=$(jq -c --argjson current_addons "$CURRENT_ADDONS" '[
        {
            "id": "announcements",
            "addon_id": "announcements",
            "display_name": "Announcements",
            "enabled": true,
            "parameters": "{}"
        },
        {
            "id": "discussions",
            "addon_id": "discussions",
            "display_name": "Discussions",
            "enabled": true,
            "parameters": "{}"
        },
        {
            "id": "activity",
            "addon_id": "activity",
            "display_name": "Activity",
            "enabled": true,
            "parameters": "{}"
        }
    ] + $current_addons' <<<"$CURRENT_ADDONS")

    echo $NEW_ADDONS;

    # Call the set_community_addons function with the new addons
    near contract call-function as-transaction $CONTRACT set_community_addons json-args "{\"handle\": \"$HANDLE\", \"addons\": $NEW_ADDONS}" prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' sign-as $ACCOUNT network-config mainnet sign-with-keychain send
    
    # Check the result of the transaction
    if [ $? -eq 0 ]; then
        echo "Successfully set addons for community: $HANDLE"
    else
        echo "Failed to set addons for community: $HANDLE"
    fi
done
