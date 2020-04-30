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


class Text extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = (sharedStyles + '<div id="txt"><slot></slot></div>');
    }
    sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
    bases = ['light', 'semilight', 'regular', 'semibold', 'bold'];
    inks = ['white', 'light', 'dark', 'grey', 'black', 'primary', 'secondary', 'tertiary', 'bg', 'red', 'blue', 'green', 'purple', 'orange'];
    static get observedAttributes() {
        return ['size', 'ink', 'base', 'style','align','opacity','max-width'];
    }
    connectedCallback() {
        
    }
    disconnectedCallback() {
        console.log("comp disconnected");
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        const txt = this.shadowRoot.getElementById('txt');
       // console.log("new attributes", attrName, oldVal, newVal);
        if (attrName == 'size') {
            if (this.sizes.includes(newVal)) {
                txt.style.fontSize = 'var(--' + newVal + ')';
            }
            else
            txt.style.fontSize = newVal;
        }
        else if (attrName == 'base') {
            if (this.bases.includes(newVal)) {
                txt.style.fontWeight = 'var(--base-' + newVal + ')';
            }
            else
            txt.style.fontWeight = newVal;
        }
        else if (attrName == 'ink') {
            if (this.inks.includes(newVal)) {
                txt.style.color = 'var(--' + newVal + ')';
            }
            else
            txt.style.color = newVal;
        }
        else if(attrName=='align'){
            txt.style.textAlign=newVal;
        }
        else if(attrName=='opacity'){
            txt.style.opacity=newVal;
        }
        else if(attrName=='max-width'){
            txt.style.maxWidth=newVal;
        }
    }
}

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
                { name: "Pay fees", url: "/payfees" },
                { name: "Notice", url: "/Notice" },
                { name: "Contact us", url: "/contactus" },
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
            background-color: rgba(255, 255, 255, 0.77);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            flex-direction: row;
            align-items: center;
            top: 0px;
            overflow: hidden;
            padding: 0.6rem;
            color: rgb(255, 255, 255);
            font-size: 0.9rem;
            font-weight: 500;
            z-index:2;
            width:100%;
            position: ${pos};
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
            font-weight: 300;
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
            justify-content:center;
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
        var smTitleDisplay = "flex";
        if (this.state.isexpanded) {
            smLinksDisplay = "flex";
            smTitleDisplay = "none";
        }
        var html = `<div class="navbar" id="navbar-l">${links}</div>
        <div id="sm">
        <div class="navbar" id="navbar-s" style="display:${smTitleDisplay}">
        <div style="color:black;">${activeName}</div>
        <div id="expand">=</div>
        </div>
        <div class="navbar" id="menu" style="display:${smLinksDisplay}">
           <div id="close">
           <div id="x">X</div>
           </div>
           ${links}
           </div>
           </div>`;
        this.shadowRoot.innerHTML = (sharedStyles + css + html);
        this.listen();
    }
}


class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
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
            min-height: 8rem;
            width: 100%;
            background-image:url(/images/footer-bg.png);
        }
        </style>`;

        var html = `<div id="footer">
        <div style="padding:1.2rem 0.5rem"><x-text ink="secondary">BF 3, Sector 1, Salt Lake, Kolkata 700064</x-text></div>
        <div style="padding:1.2rem 0.5rem;padding-top:0">
          <x-text ink="secondary">call: <a href="tel:8334009522">8334009522</a></x-text>
          <x-text ink="secondary">email: <a href="mailto:senhouse@gmail.com">senhouse@gmail.com</a></x-text>
        </div>
      </div>`;

        this.shadowRoot.innerHTML = (sharedStyles + css + html);
        this.listen();
    }
}

window.customElements.define('x-text', Text);
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
    else{
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