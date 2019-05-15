#!/usr/bin/env node
var argvs = process.argv.splice(2);
const fs = require('fs');
var module = argvs[0] //模块名称
var dir = argvs[1] //解压路径
var request = require('request');
var _cmdpath = process.cwd();



var htmlPath = _cmdpath + "/html/" + module + ".html";
var scssPath = _cmdpath + "/src/style/page/" + module + ".scss";
var jsPath = _cmdpath + "/src/js/" + module + ".js";


function _dir(paths, callbak) {

    console.log(paths);

    var dirs = paths.split('/'); ///['m','n']；

    //return;
    let index = 0;


    var createFile = function () {


        callbak && callbak();


    }

    function next() {
        let currentPath = dirs.slice(0, ++index).join('/');

        fs.access(currentPath, (err) => {
            //如果不存在 则err 存在

            if (currentPath.indexOf('.') > -1) {
                createFile();
                return;
            } else if (err) {
                fs.mkdir(currentPath, () => {
                    next();
                })
            } else {
                //递归他的子目录
                next();
            }
        })
    };
    next()
}

function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}


_dir(htmlPath, function () {


    _dir(scssPath, function () {

        _dir(jsPath, function () {

            var paths = {

                html: {
                    source: "https://raw.githubusercontent.com/gurenGithub/kila-html/master/html/index.html"+("?"+new Date().getTime()),
                    copy: htmlPath
                },
                js: {
                    source: "https://raw.githubusercontent.com/gurenGithub/kila-html/master/src/js/index.js"+("?"+new Date().getTime()),
                    copy: jsPath
                },
                scss: {
                    source: "https://raw.githubusercontent.com/gurenGithub/kila-html/master/src/style/index.scss"+("?"+new Date().getTime()),
                    copy: scssPath
                }
            }

            console.log('begin downloadFile');
            downloadFile(paths.html.source,paths.html.copy,function(){


                downloadFile(paths.js.source,paths.js.copy,function(){

                   // console.log('创建完成');
                   var js = fs.readFileSync(paths.js.copy,'utf-8');
                   var extendjs="import '@/"+module+".scss';";
                   var rebuildjs=[extendjs,js].join('\r\n');
                   fs.writeFileSync(paths.js.copy,rebuildjs,'utf-8');
                    downloadFile(paths.scss.source,paths.scss.copy,function(){

                        var scss = fs.readFileSync(paths.scss.copy,'utf-8');
                        
                        //console.log(date);
                        var extendCss="$"+module.replace(/\//gi,'_')+":'"+module.replace(/\//gi,'_')+"';";

                        var extendCss2=".#{"+module.replace(/\//gi,'_')+"}{"+"\r\n\r\n"+"  }";

                        var rebuildScss=[scss,extendCss,extendCss2].join('\r\n')
                        console.log(rebuildScss);

                        fs.writeFileSync(paths.scss.copy,rebuildScss,'utf-8');
                    
                    })
                
                })
            })

          
        })
    })
})