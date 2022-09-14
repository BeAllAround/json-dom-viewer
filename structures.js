// 1
function div(s){
	return Object.create({$el: {div: s},
		addTo(elem){
			console.log(this.$el)
			return elem
		}
	})
}

console.log(div('WELL!').addTo('<component/>'))
