const fs = require('fs');

module.exports = function _watch(file, callback) {
  let c_ctime = '';
  const id = setInterval(async ()=>{
    fs.stat(file, async (error, stats) => {
      if (error) {
        // console.log(error);
      }
      else {
        if(c_ctime !== stats.ctime.toString()) {
          if( (await callback(stats) === 1) ) {
		  clearInterval(id);
	  }
	  c_ctime = stats.ctime.toString();
        }
  
      // Using methods of the Stats object
      // console.log("Path is file:", stats.isFile());
      // console.log("Path is directory:", stats.isDirectory());
      }
    })
  }, 111);
}
