chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveAddress") {
        console.log("Address received:", request.address);

        // 存储数据
        chrome.storage.local.set({ address: request.address }, () => {
            console.log("Address Stored");
        });

        // 立即响应
        sendResponse({ status: "success", message: "Address sent" });
    }
});
