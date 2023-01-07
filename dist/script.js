const viewer = require('./viewer.js');
const process = require('process');
const _watcher = require('./_watcher'); // _watcher callback
const {readFile} = require('fs').promises;

let fileName = process.env.JSON_DOM_VIEWER_ARGV;

console.log('viewer v0.1: ', viewer);

function applySearch(sObj, path, shared = {}) { // flags => shared
	if(typeof sObj == 'object') {
		for(let key in sObj) {
			if(key == shared.term) {
				shared.store_keys.push(path + '.' + key)
				// config.store.push([path, key])
				console.log('f: ', Array.from(shared.object_path))
			}
			shared.object_path.push(sObj[key])
			applySearch(sObj[key], path + '.' + key, shared)
			shared.object_path.pop()
		}
	}
	else {
		// return sObj == config.term
	}
}

function domInput(sObj = {}) {
	let input = document.createElement('input');
	Object.assign(input.style, {
		position: 'absolute',
		'top': '0',
		'right': '0',
	});
	input.addEventListener('input', event=>{
		let shared = { // use snake-case for shared_object
			term: event.target.value, // input value
			store_keys: [], // we might have store_values or store_paths or match the entire term such as: 'a.b.c' down the road
			object_path: [],
		};
		applySearch(sObj, '', shared);
		console.log('shared_object.store_keys: ', shared.store_keys);
		console.log('shared_object.object_path: ', shared.object_path);
	})
	return input;
}

let main = document.body // main container for us
// default theme
Object.assign(main.style, {'background': '#1f2023',});

async function read_dict(fileName) {
    let fileContents = (await readFile(fileName)).toString();
    let dict = JSON.parse(fileContents);
    return dict;
}

function render_error(e) {
    document.title = `Error while reading ${fileName}`;
    document.body.textContent = e.toString()
    Object.assign(document.body.style, {color: 'white',})
}

(async ()=>{

  try{
    let dict = await read_dict(fileName)
    let view_dom
    let cache = {}
    setTimeout(()=>{
      view_dom = viewer.viewJSON(dict, 2, '', cache)
      main.append(view_dom);
    }, 11)

    document.title = fileName;
    // main.append(domInput(dict));
    _watcher(fileName, async(event, path) =>{
      // reuse event for Changes log
      console.log('event: ', event)
      try {
        dict = await read_dict(fileName);
      }catch(err) {
              view_dom.remove();
	      render_error(err);
	      return 1;
      }
      view_dom.remove()
      view_dom = viewer.viewJSON(dict, 2, '', cache)
      main.append(view_dom);
      return 0;
    })

    console.log('dict: ', dict)

  }catch(e){
    render_error(e);
  }

})()


