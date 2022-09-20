const SPACE = '&nbsp;',
      DOWN_TRIANGLE = '&#x25BC;',
      RIGHT_TRIANGLE = '&#x25B6;'

function applyStyle(elem, style) {
	Object.assign(elem.style, style)
}

function type(obj) {
	if(!obj) { // JSON null
		return false
	}
	return obj.constructor
}

function newType(constructor){
	let style = {'number': {color: '#746eed'},
		     'string': {color: '#2fd0b0'},
		     'boolean': {color: '#746eed'},
	}
	return style[constructor]
}

function simpleDiv(content = '', style, typing){
	let el, html
	el = document.createElement('div')
	applyStyle(el, {display: 'inline',})
	if(typeof content == 'string' && typing) {
          el.innerHTML += '"'
	}

	// value content
	if(content === null) { // null - special case
	  el.innerHTML = 'null'
	}else {
	  el.innerHTML += content.toString()
	}

	if(typeof content == 'string' && typing) {
	  el.innerHTML += '"'
	}
	if(style) {
	  applyStyle(el, style)
	}

	if(content === null) { // null - special case
	  applyStyle(el, {color: 'gray',})
	}
	/*
	return Object.create({ $el: el, addTo(elem){
	                   elem.appendChild(this.$el)
	                 },
	})
	*/
	return el
}

function valueDiv(value, typing) {
	let style = newType(typeof value)
	return simpleDiv(value, style, typing)
}

function create(obj, dotted = false, spacing = 0){
	let el, html, tab, opening, closing
	let b
	el = document.createElement('div')
	el.id = 'dict'
	applyStyle(el, {color: 'white',})
	applyStyle(el, {display: 'inline',})
	// el.innerHTML = `${JSON.stringify(obj)}`
	tab = SPACE.repeat(spacing)
	
	el.appendChild(opening = simpleDiv('{'))

	opening.addEventListener('mouseover', (event) => { // highligher
		applyStyle(opening, {color: 'red'})
		applyStyle(closing, {color: 'red'})
	})
	opening.addEventListener('mouseleave', (event) => {
		applyStyle(opening, {color: 'white'})
                applyStyle(closing, {color: 'white'})
        })

	let keys = Object.keys(obj), key
	for(let i in keys) {
		let keyDom, valueDom

		b = true
		key = keys[i]
		// console.log([key, obj[key]])
		el.appendChild(document.createElement('br'))
		el.appendChild(simpleDiv(tab+tab))
		el.appendChild(keyDom = simpleDiv(key.toString(), {color: '#5db0d7',}))
		el.appendChild(simpleDiv(':'))
		el.appendChild(simpleDiv(SPACE))
		// el.appendChild(simpleDiv(key.toString() + ': '))
		
		// console.log(keyDom.style)
		// console.log(keyDom)


		// :hover keyDom
		keyDom.addEventListener('mouseover', (event) => {
		  applyStyle(keyDom, {opacity: 0.5, 'background-color': 'white', 
			  padding: '1px', border: '1px solid white', 'border-radius': '6px',})
                })
                keyDom.addEventListener('mouseleave', (event) => {
		  applyStyle(keyDom, {opacity: '', 'background-color': '', 
			  padding: '', border: '', 'border-radius': '',}) // reset style
                })

		keyDom.addEventListener('click', event=>{
	          if(!keyDom.enabled) {
		    applyStyle(valueDom, {'background-color': '#29323d',
			    padding: '0px', border: '1px inset #5db0d7', 'border-radius': '6px',})
	            keyDom.enabled = true
	          }else {
		    applyStyle(valueDom, {'background-color': '',
			    padding: '', border: '', 'border-radius': '',})
	            keyDom.enabled = false
	          }
		})

		if(type(obj[key]) === Object || type(obj[key]) == Array) {
			el.appendChild(valueDom = viewJSON(obj[key], spacing+2))
		}else if(obj[key] === null) {
			el.appendChild(valueDom = valueDiv(null, true))
		}else {
			el.appendChild(valueDom = valueDiv(obj[key], true))
		}

		if(keys.length - i - 1) {
			el.appendChild(simpleDiv(', '))
		}

		/*
		// :hover valueDom - TBD
                valueDom.addEventListener('mouseover', (event) => {
		  applyStyle(valueDom, {'background-color': '#29323d',
			  padding: '0px', border: '1px inset #5db0d7', 'border-radius': '6px',})
                })
                valueDom.addEventListener('mouseleave', (event) => {
		  applyStyle(valueDom, {'background-color': '',
			  padding: '', border: '', 'border-radius': '',})
                })
		*/
	}

	if(dotted) {
		el.appendChild(simpleDiv('...'))
	}
	if(keys.length != 0) {
		el.appendChild(document.createElement('br')) // '\n'
		el.appendChild(closing = simpleDiv(tab + '}'))
	}else {
		el.appendChild(closing = simpleDiv('}'))
	}

	closing.addEventListener('mouseover', (event) => {
                applyStyle(opening, {color: 'red'})
                applyStyle(closing, {color: 'red'})
        })
        closing.addEventListener('mouseleave', (event) => {
                applyStyle(opening, {color: 'white'})
                applyStyle(closing, {color: 'white'})
        })

	return el
}
function icon(obj, dict, spacing){
	let el
	let rendered
	el = document.createElement('div')
	el.innerHTML = RIGHT_TRIANGLE
        applyStyle(el, {color: 'gray', 'font-size': '12px'}) // default style
	el.addEventListener('click', e=>{
		obj[0].remove()
		if(!obj[0].enabled) {
		  el.innerHTML = DOWN_TRIANGLE
                  applyStyle(el, {color: 'gray'}) // update style
		  obj[0] = create(dict, false, spacing)
		  applyStyle(obj[0], {display: "inline"})
		  obj[0].enabled = true
		} else {
                  applyStyle(el, {color: 'gray'}) // update style
		  el.innerHTML = RIGHT_TRIANGLE
		  obj[0] = create({}, true, 0)
		  obj[0].enabled = false
		}

		// console.log('obj: ', obj[0]) // for debugging
		el.parentNode.appendChild(obj[0]) // similar to linked list - prev, next
	})
	applyStyle(el, {display: 'inline',})
	return el
}

function viewJSON(dict, spacing = 2) {
	let obj = [create({}, true, 0)] // default
	let div = document.createElement('div')
	applyStyle(div, {display: 'inline',})
        div.appendChild(icon(obj, dict, spacing))
        div.appendChild(obj[0])
	return div
}

function viewJSONAsString(json_string) {
	return viewJSON(JSON.parse(json_string))
}

export default {name: 'viewer', 
	        viewJSON, 
	        viewJSONAsString}
