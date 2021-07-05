
const filter = {"urls": ["*://*.target.com/*"]}
const extraInfoSpec = ["requestHeaders"]


/** 
 * @param {Array} headerArray - Formatted header array
*/
const sendToTask =  (headerArray) => {
    const req = new XMLHttpRequest();
    const baseUrl = "http://localhost:3000/headers";
    const data = JSON.stringify({"headerArray": headerArray})

    req.open("POST", baseUrl, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(data);

    req.addEventListener("readystatechange", function() {
        if (this.readyState === 4 && this.status == 200 && JSON.parse(this.response).success === true) {
            console.log("Headers Sent!")
        }
    });

}

/** 
 * @param {Object} headers - Unformatted header object
 * @param {string} ck - browser cookies
 * @returns {function sendToTask(headersObject)}
*/
const formatHeaders = (headers, ck) => {
    let headersObject = {}
    for(let i = 0; i < headers.length; i++) {
        headersObject[headers[i].name] = headers[i].value
    }
    headersObject["Cookie"] = ck.trim()
    return sendToTask(headersObject)
}


/**
 * 
 * @param {Object} requestHeaders - unformatted request headers
 * @returns {function formatHeaders(requestHeaders, ck)} 
 */
const getCookies = async (requestHeaders) => {
    await chrome.cookies.getAll({ domain: ".target.com" }, (cookies) => {
        let ck = "";
        for (var i = 0; i < cookies.length; i++) {
          ck += `${cookies[i].name}=${cookies[i].value}; `;
        }
        return formatHeaders(requestHeaders, ck)
    })
}


/** 
 * @param {Object} request - Request Object
 * @returns {function getCookies(request.requestHeaders) {
     
 }}
*/
const callback = (request) => {
    if(request.url === "https://gsp.target.com/gsp/authentications/v1/credential_validations?client_id=ecom-web-1.0.0") { // checks if this is the login request(only one w shape headers)
        return getCookies(request.requestHeaders) // gets cookies
    }
}


/** 
 * @param {Function} callback - Callback Function
 * @param {Object} filter - Filter Object(only listens to requests from target)
 * @param {Array} extraInfoSpec - specifies we want the requestHeaders
*/
chrome.webRequest.onSendHeaders.addListener(callback, filter, extraInfoSpec)