// content.js
console.log("Content script loaded!");

extractAddressFromPage();

function extractAddressFromPage() {
    console.log("Function Executed");
    let addressElement = null;
    addressElement = document.querySelector(".property_view_table-body");
    if (addressElement) {
        let addressText = addressElement.innerText;
        console.log("Extracted Address:", addressText);
    }

    /**
    if (addressElement) {
        try {
            // 转换为 Base64 以防止编码问题
            return btoa(unescape(encodeURIComponent(addressElement)));
        } catch (e) {
            console.error("Failed:", e);
        }
    }
     **/
    chrome.runtime.sendMessage({ type: "ADDRESS_DATA", data: addressText });
}

document.addEventListener("DOMContentLoaded", extractAddressFromPage)


