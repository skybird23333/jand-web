import ApiError from "./ApiError"
import FatalError from "./FatalError"

/**
* REST Api Handler
*/
 export default class REST {
    constructor(token) {
        this.token = token
        this.isWaitingForBaseURL = false
        if(process.env.NODE_ENV === "production") {
            this.baseURL = '/api'
        }
    }

    async waitForBaseURL() {
        if(this.baseURL) return this.baseURL
        if(this.isWaitingForBaseURL) {
            return new Promise((res, rej) => {
                const interval = setInterval(checkForBaseURL, 200)
                function checkForBaseURL () {
                    if(this.baseURL) return res(this.baseURL)
                    clearInterval(interval)
                }
            })
        }
        else {
            this.isWaitingForBaseURL = true
            await this.fetchBaseURL()
        }
    }
    
    async fetchBaseURL() {
        try { //Development mode
            const res = await Promise.race([
                fetch('//localhost:3000/api'),
                new Promise(res => {setTimeout(() => {res('DEV SERVER TIMED OUT')}, 10000)})
            ])
            if(res === 'DEV SERVER TIMED OUT') {
                console.warn('Development server request timed out')
                throw Error()
            }
            console.log('Development server detected')
            this.baseURL = '//localhost:3000/api'
        }
        catch(e) { //Production mode(app is served from root)
            this.baseURL = '/api'
        }
    }
 
    /**
     * Sends a request.
     * @param path The path relative to base url
     * @param options The options of the request
     * @param auth Whether the endpoint requires authenication or not
     * @returns The fetch res object
     */
    async request(path, options, auth=false) {
        if(!this.baseURL) await this.waitForBaseURL()
        const response = await fetch(
            `${this.baseURL}${path}`,
            Object.assign(options, {
                headers: {
                    'content-type': 'application/json',
                    authorization: (auth ? this.token : null)
                }
            })
        )

        if(response.status === 204) return null
            
        const resdata = await response.json()

        if(response.ok) return resdata

        else switch(response.status) {
            case 401:
                throw new ApiError('Unauthorized', 401, resdata)
            case 404: return null
            case 503: throw new FatalError()
            default: throw new ApiError(resdata.message | 'An Unknown Error Occurred', response.status, resdata)
        }
    }

    /**
     * Sends a GET request.
     * @param path Path to the request.
     * @param auth Whether authenication is required or not.
     */
    async get(path, auth) {return this.request(path, {}, auth)}

    /**
     * Sends a POST request.
     * @param path Path to the request.
     * @param body The request body.
     * @param auth Whether authenication is required or not.
     */
    async post(path, body, auth) {
        return this.request(path, {method: 'post', body: JSON.stringify(body)}, auth)
    }
    
    /**
     * Sends a PATCH request.
     * @param path Path to the request.
     * @param body The request body.
     * @param auth Whether authenication is required or not.
     */
    async patch(path, body, auth) {
        return this.request(path, {method: 'patch', body: JSON.stringify(body)}, auth)
    }
    

    /**
     * Sends a DELETE request.
     * @param path Path to the request.
     * @param auth Whether authenication is required or not.
     */
    async delete(path, auth) {return this.request(path, {method: 'delete'}, auth)}
}