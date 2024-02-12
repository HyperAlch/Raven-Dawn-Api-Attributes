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

    // Check if there is more than one [data-item-api-fetch] attribute
    if (document.querySelectorAll('[data-item-api-fetch]').length > 1) return console.error("Item API: More than one [data-item-api-fetch] tag found");

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
        const storage_description_label = `ravendawn_item_api:${id}:description`;

        // Check for and obtain the item image url and name from storage
        console.debug(`\tSearching memory for ${storage_name_label}...`);
        console.debug(`\tSearching memory for ${storage_image_label}...`);
        console.debug(`\tSearching memory for ${storage_description_label}...`);
        let item_image_url = fetchStorageGet(storage_image_label);
        let item_name = fetchStorageGet(storage_name_label);
        let item_description = fetchStorageGet(storage_description_label);

        // If data isn't found, get ready to do an api fetch
        if (item_image_url && item_name && item_description) {
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
                "https://cloudflare-ipfs.com/ipfs/QmXcPwWDzXjS11ek962QukmywRSfy31PKHnLrk9MmiRAsX";
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
                    const storage_description_value = target_data[0].description ? target_data[0].description : "Item has no description...";

                    // Check for successful parsing
                    if (
                        storage_name_value === undefined ||
                        storage_image_value === undefined
                    )
                        return console.error("Item API: Core JSON Scheme data missing");

                    console.debug(`\t\t\t${storage_name_value}`);
                    console.debug(`\t\t\t${storage_image_value}`);
                    console.debug(`\t\t\t${storage_description_value}`);

                    // Create storage name and image labels
                    const storage_name_label = `ravendawn_item_api:${id}:name`;
                    const storage_image_label = `ravendawn_item_api:${id}:image`;
                    const storage_description_label = `ravendawn_item_api:${id}:description`;

                    // Store parsed data
                    fetchStorageSet(storage_name_label, storage_name_value);
                    fetchStorageSet(storage_image_label, storage_image_value);
                    fetchStorageSet(storage_description_label, storage_description_value);
                }

                render_item_api();
            })
            .catch(console.error);


    } else {
        render_item_api();
    }


}

function name_item_api() {
    const api_query_element = document.querySelector('[data-item-api-fetch]');
    const name_elements = api_query_element.querySelectorAll('[data-item-api-name]');

    for (const el of name_elements) {
        const id = el.getAttribute('data-item-api-name');

        if (isNaN(parseInt(id))) return console.error(`Item API: \n\tAttribute: [data-item-api-name] \n\tError: "${id}" is an invalid id`);

        const storage_name_label = `ravendawn_item_api:${id}:name`;
        let item_name = fetchStorageGet(storage_name_label);

        el.innerHTML = item_name;
    }
}

function image_item_api() {
    const api_query_element = document.querySelector('[data-item-api-fetch]');
    const image_elements = api_query_element.querySelectorAll('[data-item-api-image]');

    for (const el of image_elements) {
        const id = el.getAttribute('data-item-api-image');

        if (isNaN(parseInt(id))) return console.error(`Item API: \n\tAttribute: [data-item-api-image] \n\tError: "${id}" is an invalid id`);

        // Create storage name and image labels
        const storage_name_label = `ravendawn_item_api:${id}:name`;
        const storage_image_label = `ravendawn_item_api:${id}:image`;

        let item_image_url = fetchStorageGet(storage_image_label);
        let item_name = fetchStorageGet(storage_name_label);

        let img = document.createElement('img');

        img.setAttribute("src", item_image_url);
        img.setAttribute("alt", item_name);

        const width = el.getAttribute("data-width");
        const height = el.getAttribute("data-height");

        if (width) img.setAttribute("width", width);
        if (height) img.setAttribute("height", height);

        if (el.tagName === "SPAN") el.replaceWith(img);
        if (el.tagName === "DIV") el.appendChild(img);
    }
}

function description_item_api() {
    const api_query_element = document.querySelector('[data-item-api-fetch]');
    const description_elements = api_query_element.querySelectorAll('[data-item-api-description]');

    for (const el of description_elements) {
        const id = el.getAttribute('data-item-api-description');

        if (isNaN(parseInt(id))) return console.error(`Item API: \n\tAttribute: [data-item-api-description] \n\tError: "${id}" is an invalid id`);

        const storage_description_label = `ravendawn_item_api:${id}:description`;
        let item_name = fetchStorageGet(storage_description_label);

        el.innerHTML = item_name;
    }
}

function render_item_api() {
    image_item_api();
    name_item_api();
    description_item_api();
}

query_item_api();



