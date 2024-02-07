function query_item_api() {
    const api_query_element = document.querySelector('[data-item-api-fetch]');

    if (!api_query_element) return;

    let api_mode = api_query_element.getAttribute('data-api-mode');
    if (api_mode === "") api_mode = null;

    if (api_mode) console.debug(`API MODE: ${api_mode}`);

    let api_query_ids = api_query_element.getAttribute('data-item-api-fetch');
    api_query_ids = api_query_ids.split(" ").map(x => parseInt(x)).filter(x => x !== "" && !isNaN(x));
    api_query_ids = new Set([...api_query_ids]);

    if (api_query_ids.size === 0) return console.error("Item API: No IDs provided");

    if (typeof Storage === "undefined")
        return console.error("Web Storage API not supported...");

    console.debug(`Requested item ids: [${Array.from(api_query_ids)}]\n\n`);

    let do_api_fetch = false;

    for (const id of api_query_ids) {
        console.debug(`Tring to find item ${id} in memory...`);
        const storage_name_label = "ravendawn_item_api:" + id + ":name";
        const storage_image_label = "ravendawn_item_api:" + id + ":image";

        console.debug(`\tSearching memory for ${storage_name_label}...`);
        console.debug(`\tSearching memory for ${storage_image_label}...`);
        let item_image_url = sessionStorage.getItem(storage_image_label);
        let item_name = sessionStorage.getItem(storage_name_label);

        if (item_image_url && item_name) {
            console.debug(`\tData found!!`);
        } else {
            console.debug("\tMissing item details in memory");
            console.debug("Starting api fetch...");

            do_api_fetch = true;
        }

    }

    if (do_api_fetch) {
        let item_api_url;
        if (api_mode === "test")
            item_api_url =
                "https://gray-insufficient-parakeet-558.mypinata.cloud/ipfs/QmXcPwWDzXjS11ek962QukmywRSfy31PKHnLrk9MmiRAsX";
        else
            item_api_url = "https://api.ravendawn.online/v1/items";

        console.debug("\tApi network request started...");
        fetch(item_api_url)
            .then((response) => response.json())
            .then((data) => {
                console.debug("\tApi network request received...");

                for (const id of api_query_ids) {
                    let target_data = data.filter((obj) => obj.id == id);
                    if (target_data.length === 0)
                        return console.error("Item API: No item with ID " + id);

                    console.debug("\t\tParsing data...");

                    const storage_name_value = target_data[0].name;
                    const storage_image_value = target_data[0].image;

                    if (
                        storage_name_value === undefined ||
                        storage_image_value === undefined
                    )
                        return console.error("Item API: Core JSON Scheme data missing");

                    console.debug(`\t\t\t${storage_name_value}`);
                    console.debug(`\t\t\t${storage_image_value}`);

                    const storage_name_label = "ravendawn_item_api:" + id + ":name";
                    const storage_image_label = "ravendawn_item_api:" + id + ":image";

                    sessionStorage.setItem(storage_name_label, storage_name_value);
                    sessionStorage.setItem(storage_image_label, storage_image_value);
                }
            })
            .catch(console.error);
    }


}

query_item_api();



