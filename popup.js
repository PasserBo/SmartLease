document.addEventListener("DOMContentLoaded", function () {
    // 获取按钮和输入框
    const calculateButton = document.getElementById("calculateDistance");
    const companyInput = document.getElementById("companyAddress");
    const resultDiv = document.getElementById("result");

    if (!calculateButton || !companyInput || !resultDiv) {
        console.error("无法找到 popup.html 中的关键元素");
        return;
    }

    // 绑定按钮点击事件
    calculateButton.addEventListener("click", async function () {
        const companyAddress = companyInput.value.trim();
        if (!companyAddress) {
            alert("请输入公司地址");
            return;
        }

        console.log("用户输入的公司地址:", companyAddress);

        // 获取当前活动的租房网站地址
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            if (tabs.length === 0) {
                alert("未找到活动网页");
                return;
            }

            const activeTab = tabs[0];

            // 在当前网页提取房源地址
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                function: extractAddressFromPage
            }, async (results) => {
                if (!results || !results[0] || !results[0].result) {
                    alert("无法获取房源地址，请确认网页是否为租房网站");
                    return;
                }

                const houseAddress = results[0].result;
                console.log("提取到的房源地址:", houseAddress);

                // 计算公司地址与房源地址的距离
                const distanceData = await getDistance(companyAddress, houseAddress);
                resultDiv.innerHTML = `<strong>直线距离:</strong> ${distanceData.distance} <br> <strong>预计通勤时间:</strong> ${distanceData.duration}`;
            });
        });
    });
});

// 提取网页上的房源地址（由 content script 执行）
function extractAddressFromPage() {
    let addressElement = document.querySelector(".property-address, .house-location, .property-detail-address");
    return addressElement ? addressElement.innerText.trim() : null;
}

// 调用 Google Maps API 计算距离
async function getDistance(origin, destination) {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";  // 替换为你的 Google Maps API Key
    console.log(`获取 ${origin} 和 ${destination} 的距离`);

    // 获取起点经纬度
    const originGeo = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(origin)}&key=${apiKey}`)
        .then(res => res.json());

    if (!originGeo.results.length) return { distance: "无法解析公司地址", duration: "N/A" };
    const originCoords = originGeo.results[0].geometry.location;

    // 获取终点经纬度
    const destGeo = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${apiKey}`)
        .then(res => res.json());

    if (!destGeo.results.length) return { distance: "无法解析房源地址", duration: "N/A" };
    const destCoords = destGeo.results[0].geometry.location;

    // 计算两地距离
    const distanceData = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.lat},${originCoords.lng}&destinations=${destCoords.lat},${destCoords.lng}&key=${apiKey}`)
        .then(res => res.json());

    if (distanceData.rows.length > 0 && distanceData.rows[0].elements.length > 0) {
        const element = distanceData.rows[0].elements[0];
        return {
            distance: element.distance ? element.distance.text : "未知",
            duration: element.duration ? element.duration.text : "未知"
        };
    }

    return { distance: "无法获取距离信息", duration: "N/A" };
}
