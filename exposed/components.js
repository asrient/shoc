const sharedStyles = `
<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  outline: none;
  font-family: 'Segoe UI', sans-serif;
}
a {
    text-decoration: none;
    color: inherit;
  }
:host { display: block }
</style>
`;


class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.state = {
            active: null,
            links: [
                { name: "Home", url: "/" },
                { name: "Gallery", url: "/gallery" },
                { name: "Notice", url: "/notice" },
                { name: "Contact us", url: "/contactus" },
                { name: "Pay fees", url: "/fees" },
                { name: "Account", url: "/account" },
            ],
            isexpanded: false,
            position: 'sticky'
        }
    }
    static get observedAttributes() {
        //return Object.keys(this.state);
        return ['active', 'links', 'isexpanded', 'position']
    }
    connectedCallback() {
        this.render();
    }
    disconnectedCallback() {
        console.log("comp disconnected");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        //console.log("new attributes", attrName, oldVal, newVal);
        if (attrName in this.state && oldVal != newVal) {
            if (attrName == 'isexpanded') {
                newVal = JSON.parse(newVal);
            }
            this.state[attrName] = newVal;
            this.render();
        }
    }
    getAttribute(attr) {
        return this.state[attr];
    }
    setAttribute(attrName, newVal) {
        this.attributeChangedCallback(attrName, this.state[attrName], newVal);
    }
    listen() {
        this.shadowRoot.getElementById("expand").addEventListener("click", () => {
            this.setAttribute("isexpanded", "true");
        })
        this.shadowRoot.getElementById("x").addEventListener("click", () => {
            this.setAttribute("isexpanded", "false");
        })
    }
    render() {
        const pos = this.state.position;
        const active = this.state.links.find((link) => { return link.url == this.state.active });
        var activeName = "";
        if (active != undefined) {
            activeName = active.name;
        }
        const css = `<style>
        .navbar {
            min-height: 1rem;
            flex-direction: row;
            align-items: center;
            overflow: hidden;
            color: rgb(255, 255, 255);
            font-size: 0.9rem;
            font-weight: 500;
            width:100%;
        }
        :host { 
            position: ${pos};
            top: 0px;
            z-index:3;
            width:100%;
         }
        #navbar-l {
            display: flex;
            justify-content: space-around;
        }
        
        #navbar-s {
            padding: 0.3rem 1rem;
            display: flex;
            justify-content: space-between;
        }
        #sm{
            display:none;
        }
        #expand{
            color:rgb(51, 51, 51);
            font-size: 2rem;
            font-weight: 600;
            display:none;
            justify-content:center;
            align-items:center;
            text-align:center;
        }
        #x{
            color: rgb(37, 37, 37);
            font-size: 2.2rem;
            font-weight: 100;
        }
        #close{
            display: flex;
            justify-self: flex-end;
        }
        #menu{
            padding: 0.8rem 1rem;
            flex-direction: column;
            justify-content:space-around;
            background-color:white;
            min-height:100vh;
            overflow-y:auto;
        }
        .link {
            margin: 0rem 0.2rem;
            text-decoration: none;
            -webkit-text-decoration:none;
            color: rgb(73, 73, 73);
            display: block;
        }
        
        .active {
            color:rgb(0, 119, 255);
        }
        
        @media(max-width:700px) {
            #navbar-l {
                display: none;
            }
            #sm {
                display: block;
            }
            .link {
                margin: 0.8rem 0.2rem;
                font-weight:400;
                width:100%;
            }
            #expand{
                display:flex;
            }
        }
        
        #head{
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: solid thin #00000012;
            box-shadow: 0px 0px 5px 0px #00000070;
            position:relative;
            width:100%;
            background-color:white;
            padding:0.4rem 0.8rem;
            z-index:5;
            display:grid;
            grid-template-columns:10rem auto;
        }
        @media(max-width:700px){
            #head{
                grid-template-columns:auto 5rem;
            }
            .link {
                font-weight:800;
                font-size:2rem;
            }
        }
        #brnd{
            display:flex;
            align-items:center;
        }
        </style>`;
        var links = '';
        this.state.links.forEach((link) => {
            var cls = "link"
            if (link.url == this.state.active) {
                cls += " active";
            }
            links += `<a class="${cls}" href=${link.url}>${link.name}</a>`;
        })
        var smLinksDisplay = "none";
        var smTitleDisplay = "grid";
        if (this.state.isexpanded) {
            smLinksDisplay = "flex";
            smTitleDisplay = "none";
        }
        var html = `<div id="head" style="display:${smTitleDisplay}">
        <div id="brnd"><img src="/images/branding.png"/></div>
        <div class="navbar" id="navbar-l">${links}</div>
        <div id="expand">=</div>
        </div>

        <div class="navbar" id="menu" style="display:${smLinksDisplay}">
           <div id="close">
           <div id="x">X</div>
           </div>
           ${links}
           </div>`;
        this.shadowRoot.innerHTML = (sharedStyles + css + html);
        this.listen();
    }
}


class Footer extends HTMLElement {
    constructor() {
        super();
        /*this.attachShadow({
            mode: 'open'
        });*/
        this.state = {}
    }
    static get observedAttributes() {
        //return Object.keys(this.state);
        return ['opts']
    }
    connectedCallback() {
        this.render();
    }
    disconnectedCallback() {
        console.log("comp disconnected");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        //console.log("new attributes", attrName, oldVal, newVal);
        if (attrName in this.state && oldVal != newVal) {
            /*if (attrName == 'links' || attrName == 'isExpanded') {
                newVal = JSON.parse(newVal);
            }*/
            this.state[attrName] = newVal;
            this.render();
        }
    }
    setValue(attrName, newVal) {
        this.attributeChangedCallback(attrName, this.state[attrName], newVal);
    }
    listen() {

    }
    render() {
        const css = `<style>
        #footer{
            background: var(--tertiary);
            min-height: 2rem;
            width: 100%;
          }
        </style>`;

        var html = `<div id="footer">
        <div style="padding:1.2rem 0.5rem" class="center-col ink-grey base-semilight size-xs">
          <div class="size-m ink-primary base-semilight">Sen House of Children</div>
          <div>BF 3, Sector 1, Salt Lake, Kolkata 700064</div>
        </div>
        <div class="center">
          <div style="width:100%;padding:2rem 0.5rem;padding-top:0;max-width:40rem;" class="hstack space-around size-xs">
            <a href="https://goo.gl/maps/Gh3MknQsfxZT5sRQA">Visit</a>
            <a href="tel:8017665988">Call</a>
            <a href="mailto:senhouse@gmail.com">Email</a>
            <a href="/Policies">Policies</a>
            <a href="/aboutus">About us</a>
         </div>
         </div>
       </div>`;

        this.innerHTML = (css + html);
        this.listen();
    }
}

window.customElements.define('x-navbar', NavBar);
window.customElements.define('x-footer', Footer);

//determines if the user has a set theme
function detectColorTheme() {
    var theme = "light";
    //local storage is used to override OS theme settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    }
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
    }
    //dark theme preferred, set document with a `data-theme` attribute
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
    else {
        document.documentElement.setAttribute("data-theme", "light");
    }
}

window.detectColorTheme();

matchMedia("(prefers-color-scheme: dark)").addListener(window.detectColorTheme);

window.changeTheme = function (to = 'system') {
    if (to == 'dark') {
        localStorage.setItem('theme', 'dark');
    }
    else if (to == 'light') {
        localStorage.setItem('theme', 'light');
    }
    else {
        localStorage.removeItem('theme');
    }
    window.detectColorTheme();
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

window.isEmail = isEmail

class Api {
    constructor(baseUrl = null, extraHeaders = {}) {
        if (baseUrl)
            this.baseUrl = baseUrl;
        else
            this.baseUrl = "/api/";

        this.extraHeaders = extraHeaders;
    }
    _send(method, url, data, cb) {
        $.ajax({
            url: this.baseUrl + url,
            type: method,
            data,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            headers: this.extraHeaders,
            dataType: 'json',
            success: (result, status, xhr) => {
                cb(xhr.status, result)
            },
            error: (xhr, txtStatus, err) => {
                cb(xhr.status, xhr.responseJSON)
            }
        });
    }
    post(url, data = {}, cb) {
        this._send('POST', url, data, cb)
    }
    get(url, data = {}, cb) {
        this._send('GET', url, data, cb)
    }
    put(url, data = {}, cb) {
        this._send('PUT', url, data, cb)
    }
    SET(url, data = {}, cb) {
        this._send('SET', url, data, cb)
    }
}

window.Api = Api;

const ua = window.navigator.userAgent;
const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
const webkit = !!ua.match(/WebKit/i);
const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);


function toggleSwitch(id, onToggle = function () { }) {
    var isActive = false;
    var button = document.createElement('div');
    button.className += 'toggle-button'
    var circle = document.createElement('div')
    circle.className += 'inner-circle'
    button.appendChild(circle)
    var root = document.getElementById(id)
    root.appendChild(button)
    root.className += 'toggle-container'
    button.addEventListener('click', () => {
        onToggle(isActive);
    })
    return (show = true) => {
        if (show && !isActive) {
            button.classList.toggle('active');
            isActive = true
        }
        else if (!show && isActive) {
            button.classList.toggle('active');
            isActive = false
        }
    }
}

function openLink(link) {
    window.location.href = link
}


function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}