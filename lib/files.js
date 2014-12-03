/*
输入目录找出目录下的所有文件，包括文件夹
*/
/*
依赖模块
 */
var fs = require('fs')
	,path = require('path')
;

var shortcuts = {
		'file': 'File'
		,'dir': 'Directory'
	}
	,pty = {}
;
Object.keys(shortcuts).forEach(function(key){
	pty[key] = function(fpath){
		var stat = fs.statSync;
		if (fs.existsSync(fpath)) {
			return stat(fpath)['is' + shortcuts[key]]();
		}
		return false;
	}
});


/*
对目录进行递归
*/
var subDir = function(parent, cb) {
  if (pty.dir(parent)) {//如果是目录
  	/*
    fs.readdir(parent, function(err, all) {//读取目录
      all && all.forEach(function(f) {//遍历目录先的文件和文件夹
        var sdir = path.join(parent, f);
        cb.call(null, sdir);
      });
    });
	*/
	/*将fs.readdir换成fs.readdirSync 使用同步，防止读取目录时因异步而产生的延时问题*/
	var files = fs.readdirSync(parent);
	files && files.forEach(function(f) {//遍历目录先的文件和文件夹
	   var sdir = path.join(parent, f);
	   cb.call(null, sdir);
	});
  }
};

/*
文件判断并记录
fpath 为文件路径
obj 存储对象
*/
var memoFiles = function(fpath,obj){
	var _dir = path.dirname(fpath);
	if(pty.file(fpath)){
		obj[fpath] = {type:'file',dirname:_dir};// type 类型（文件、文件夹） dirname 上一级的路径
	}else if(pty.dir(fpath)){
		obj[fpath] = {type:'direcotry',dirname:_dir};

		subDir(fpath,function(sdir){
			memoFiles(sdir,obj);
		});
	}
};


/*
fpath 为文件目录
*/
var findFiles = function(fpath){
	var allFiles = {};//文件缓存区
	memoFiles(fpath,allFiles);

	return allFiles;
};

module.exports = findFiles;
