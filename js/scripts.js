function fetchStorageSet(key, value) {
    let safe_key = escapeHtml(key);
    let safe_value = escapeHtml(value);

    sessionStorage.setItem(safe_key, safe_value);
}

function fetchStorageGet(key) {
    let data = sessionStorage.getItem(key);
    if (data === null) return null;

    return escapeHtml(data);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function query_item_api() {
    // Check for any element with [data-item-api-fetch] attribute
    const api_query_element = document.querySelector('[data-item-api-fetch]');
    if (!api_query_element) return;

    // Check for and obtain [data-api-mode]
    let api_mode = api_query_element.getAttribute('data-api-mode');
    if (api_mode === "") api_mode = null;
    if (api_mode) console.debug(`API MODE: ${api_mode}`);

    // Check for and obtain all ids listed in [data-item-api-fetch] attribute
    let api_query_ids = api_query_element.getAttribute('data-item-api-fetch');
    api_query_ids = api_query_ids.split(" ").map(x => parseInt(x)).filter(x => x !== "" && !isNaN(x));
    api_query_ids = new Set([...api_query_ids]);
    if (api_query_ids.size === 0) return console.error("Item API: No IDs provided");

    // Check browser compatibility 
    if (typeof Storage === "undefined")
        return console.error("Web Storage API not supported...");

    console.debug(`Requested item ids: [${Array.from(api_query_ids)}]\n\n`);

    // By default, we want to skip a api fetch if possible
    let do_api_fetch = false;

    for (const id of api_query_ids) {
        console.debug(`Tring to find item ${id} in memory...`);

        // Create storage name and image labels
        const storage_name_label = `ravendawn_item_api:${id}:name`;
        const storage_image_label = `ravendawn_item_api:${id}:image`;

        // Check for and obtain the item image url and name from storage
        console.debug(`\tSearching memory for ${storage_name_label}...`);
        console.debug(`\tSearching memory for ${storage_image_label}...`);
        let item_image_url = fetchStorageGet(storage_image_label);
        let item_name = fetchStorageGet(storage_name_label);

        // If data isn't found, get ready to do an api fetch
        if (item_image_url && item_name) {
            console.debug(`\tData found!!`);
        } else {
            console.debug("\tMissing item details in memory");
            console.debug("Starting api fetch...");

            do_api_fetch = true;
        }

    }

    if (do_api_fetch) {

        // Decided the API URL based on mode
        let item_api_url;
        if (api_mode === "test")
            item_api_url =
                "https://gray-insufficient-parakeet-558.mypinata.cloud/ipfs/QmXcPwWDzXjS11ek962QukmywRSfy31PKHnLrk9MmiRAsX";
        else
            item_api_url = "https://api.ravendawn.online/v1/items";

        // Fetch from the API
        console.debug("\tApi network request started...");
        fetch(item_api_url)
            .then((response) => response.json())
            .then((data) => {
                console.debug("\tApi network request received...");

                for (const id of api_query_ids) {

                    // Find item from fetched JSON via id
                    let target_data = data.filter((obj) => obj.id == id);
                    if (target_data.length === 0)
                        return console.error("Item API: No item with ID " + id);

                    // Attempt to parse data
                    console.debug("\t\tParsing data...");
                    const storage_name_value = target_data[0].name;
                    const storage_image_value = target_data[0].image;

                    // Check for successful parsing
                    if (
                        storage_name_value === undefined ||
                        storage_image_value === undefined
                    )
                        return console.error("Item API: Core JSON Scheme data missing");

                    console.debug(`\t\t\t${storage_name_value}`);
                    console.debug(`\t\t\t${storage_image_value}`);

                    // Create storage name and image labels
                    const storage_name_label = `ravendawn_item_api:${id}:name`;
                    const storage_image_label = `ravendawn_item_api:${id}:image`;

                    // Store parsed data
                    fetchStorageSet(storage_name_label, storage_name_value);
                    fetchStorageSet(storage_image_label, storage_image_value);
                }
            })
            .catch(console.error);
    }


}

query_item_api();



