document.addEventListener("DOMContentLoaded", function () {
    const calculateButton = document.getElementById("calculateDistance");
    const companyInput = document.getElementById("companyAddress");
    const resultDiv = document.getElementById("result");
    const houseAddressDiv = document.getElementById("houseAddress");

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "ADDRESS_DATA") {
            console.log("Received Address:", message.data);
            document.getElementById("address-display").innerText = message.data;
        }
    });

    // 发送消息给 content.js，让它提取数据
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: extractAddressFromPage
        });
    });

    if (!calculateButton || !companyInput || !resultDiv || !houseAddressDiv) {
        console.error("无法找到 popup.html 中的关键元素");
        return;
    }

    // 计算距离
    calculateButton.addEventListener("click", async function () {
        const companyAddress = companyInput.value.trim();
        if (!companyAddress) {
            alert("请输入公司地址");
            return;
        }

        console.log("用户输入的公司地址:", companyAddress);

        // 再次检查房源地址
        const houseAddressText = houseAddressDiv.innerText.replace("房源地址:", "").trim();
        if (!houseAddressText || houseAddressText === "未找到房源地址，请检查网页") {
            alert("无法获取房源地址，请确认网页是否为租房网站");
            return;
        }

        // 计算距离
        const distanceData = await getDistance(companyAddress, houseAddressText);
        resultDiv.innerHTML = `<strong>直线距离:</strong> ${distanceData.distance} <br> <strong>预计通勤时间:</strong> ${distanceData.duration}`;
    });
});

