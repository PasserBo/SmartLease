console.log("Chrome");
document.body.style.border = "5px solid red";
// content.js
function extractAddressFromPage() {
    let addressElement = document.querySelector(".property-address, .house-location, .property-detail");
    return addressElement ? addressElement.innerText.trim() : null;
}


