document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup is loaded");

    // 读取存储的地址信息
    chrome.storage.local.get("address", data => {
        if (data.address) {
            document.getElementById("address").innerText = data.address;
        } else {
            document.getElementById("address").innerText = "No address founded";
        }
    });
});
