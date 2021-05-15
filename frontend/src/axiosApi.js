import axios from 'axios'
import Cookies from "./js/cookie";
const requests = axios.create({
    baseURL: window.location.protocol + "//" + window.location.host + '/api/',
    timeout: 5000,
    headers: {
        'X-CSRFToken': Cookies.get("csrftoken"),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }, 
    withCredentials: true
});


export default requests;