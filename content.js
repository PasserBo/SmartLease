// content.js
console.log("Content script loaded!");

if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');
    addressExtract();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        addressExtract();
    });
}

function addressExtract() {
    console.log("Executing myInitCode...");

    // 获取 `.property_view_table-body` 中的地址信息
    let addressElement = document.querySelector(".property_view_table-body");

    if (addressElement) {
        let address = addressElement.innerText.trim();
        console.log("Extracted Address:", address);

        // 发送地址信息到 background.js
        chrome.runtime.sendMessage({ action: "saveAddress", address: address }, response => {
            if (chrome.runtime.lastError) {
                console.error("message send failed", chrome.runtime.lastError);
            } else {
                console.log("Address sent to background.js:", response);
            }
        });
    } else {
        console.log("No Address founded");
    }
}

