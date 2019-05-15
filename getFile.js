let fs = require('fs');
let url = require('url');
var request = require('request');
var fileIO = require('./file')   // a module for saving file from form.

var copyFile = require('./copyFile')   // a module for saving file from form.
var AdmZip = require('adm-zip'); // a module for extracting files
//var express=require('express')  // module for receving HTTP traffic
//var app=express()

//var upload = multer({ dest: 'uploads/' })

// 自定义下载位置
// 前提是有这个文件夹，不然会报错
let download_path = `../assets/jsons/`;
var _path = process.cwd();

//console.log(fileIO);
//console.log(path);

/*s
* url 网络文件地址
* filename 文件名
* callback 回调函数
*/
function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}

var fileUrl = 'http://image.tianjimedia.com/uploadImages/2015/129/56/J63MI042Z4P8.jpg';
var filename = 'beauty.jpg';
/*downloadFile(fileUrl,filename,function(){
    console.log(filename+'下载完毕');
});*/

function http_get_file(file_path,mydir) {
    let options = {
        host: url.parse(file_path).host,
        port: 80,       // 默认端口是80，当然也可以自己修改
        path: url.parse(file_path).pathname
    };


    var time = (new Date().getTime());
    let file_name = time + '.zip'

    var path = _path + "/temp";
    var download_path = path+'/' + file_name;

    var callback = function () {

        downloadFile(file_path, download_path, function () {
            var zip = new AdmZip(download_path);
            zip.extractAllTo("temp/");
            setTimeout(function(){
                console.log('解压完成');
                var src=_path+"/temp/"+mydir;
                var dst=_path;
                console.log(src,dst);
                copyFile(src,dst,function(){
                    console.log('复制完成')

                    fileIO.deleteDir(_path+"/temp");
                });
            },3000);
        });
    }



    try {
        console.log(path);

        //var dst=path;
        fs.exists( path, function( exists ){
            // 已存在

            console.log(exists);
            if( exists ){
                callback();
            }
            // 不存在
            else{
                fs.mkdir( path, function(){
                    callback();
                });
            }
        });
    } catch (ex) {

        console.log('ee');
    }


}

//return;
// fileIO.dirExists(path);



module.exports = http_get_file;
