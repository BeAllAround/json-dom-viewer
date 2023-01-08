# json-dom-viewer

Written in pure DOM, Json DOM Viewer is a data viewer for dissecting json data.

It is inspired by the Javascript object viewer appearing in our console by either `console.log` call or simply typing out a global variable and hitting enter.

You can load as many json files as you like. It currently supports: `null`, `Booleans`, `Numbers`, `Strings`, `Objects`, and `Arrays` (parsed as indexed items). Have a look at the Preview and check out its readability yourself!

You can use the module in your own projects by `importing` it or use it as an electron-based tool.


**Preview:**

![Alt Text](https://raw.githubusercontent.com/BeAllAround/json-viewer/main/Preview.gif)

**Installation:**
        npm: `> npm install json-dom-viewer`

**View a JSON file:** 
        `"scripts": {
                "view-json": "json-dom-viewer ./model/model.json"
        }`
        
**Importing**

``<script type="module">``

        import viewer from "./node_modules/json-dom-viewer/dist/viewer.js"
        
        Object.assign(document.body.style, {'background': 'black',})
        
        document.body.append(viewer.viewJSON({'a': 1}))
        
``</script>``
