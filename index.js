
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
*/
const formatHeaders = (headers) => {
    let headersArray = []
    for(let i = 0; i < headers.length; i++) {
        headersArray.push([headers[i].name, headers[i].value])
    }
    return sendToTask(headersArray)
}

/** 
 * @param {Object} request - Request Object
*/
const callback = (request) => {
    if(request.url === "https://gsp.target.com/gsp/authentications/v1/credential_validations?client_id=ecom-web-1.0.0") { // checks if this is the login request(only one w shape headers)
        return formatHeaders(request.requestHeaders) // reformats headers
    }
}


/** 
 * @param {Function} callback - Callback Function
 * @param {Object} filter - Filter Object(only listens to requests from target)
 * @param {Array} extraInfoSpec - specifies we want the requestHeaders
*/
chrome.webRequest.onSendHeaders.addListener(callback, filter, extraInfoSpec)