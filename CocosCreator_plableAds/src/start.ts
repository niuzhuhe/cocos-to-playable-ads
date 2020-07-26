import * as fs from "fs"//导入nodejs里的文件模块
import * as path from "path"//导入nodejs里的路径模块
import * as uglify from "uglify-js"//npm压缩器
import CleanCSS = require("clean-css")//针对Node.js平台和任何现代浏览器的快速高效的CSS优化器

export namespace X {
    const C = {
        BASE_PATH: "src/web-mobile",            
        RES_PATH: "src/web-mobile/res",//资源路径       
        RES_BASE64_EXTNAME_SET: new Set([      
            ".png", ".jpg", ".webp", ".mp3",".mtl"
        ]),
        OUTPUT_RES_JS: "dist/res.js",           
        OUTPUT_INDEX_HTML: "dist/index.html",  
        INPUT_HTML_FILE: "src/web-mobile/index.html",//cocos发布的html
        INPUT_CSS_FILES: [
            "src/web-mobile/style-mobile.css"//cocos手机适配css
        ],
        INPUT_JS_FILES: [
            "dist/res.js",                     
            "src/web-mobile/cocos2d-js-min.js",//coccos引擎库
            "src/web-mobile/main.js",//cocos主要逻辑脚本文件
            "src/web-mobile/src/settings.js",//cocos内置脚本
            "src/web-mobile/src/project.js",//cocos内置脚本
            "src/new-res-loader.js",//转换base64的脚本
            "src/game-start.js",//游戏启动脚本
        ],
    }
    //将文件中的图片音乐等资源转换成base64
    function get_file_content(filepath: string): string {
        let file = fs.readFileSync(filepath)
        return C.RES_BASE64_EXTNAME_SET.has(path.extname(filepath)) ? file.toString("base64") : file.toString()
    }


    function get_all_child_file(filepath: string): string[] {
        let children = [filepath]
        for (; ;) {
            // 如果都是file类型的,则跳出循环
            if (children.every(v => fs.statSync(v).isFile())) { break }
            // 如果至少有1个directroy类型,则删除这一项,并加入其子项
            children.forEach((child, i) => {
                if (fs.statSync(child).isDirectory()) {
                    delete children[i]
                    let child_children = fs.readdirSync(child).map(v => `${child}/${v}`)
                    children.push(...child_children)
                }
            })
        }
        return children
    }

    /**
     * 将所有res路径下的资源转化为res.js
     * - 存储方式为:res-url(注意是相对的),res文件内容字符串或编码
     */
    function write_resjs() {
        // 读取并写入到一个对象中
        let res_object = {}
        get_all_child_file(C.RES_PATH).forEach(path => {
            // 注意,存储时删除BASE_PATH前置
            let store_path = path.replace(new RegExp(`^${C.BASE_PATH}/`), "")
            res_object[store_path] = get_file_content(path)
        })
        // 写入文件
        fs.writeFileSync(C.OUTPUT_RES_JS, `window.res=${JSON.stringify(res_object)}`)
    }

    /** 将js文件转化为html文件内容(包括最小化过程) */
    function get_html_code_by_js_file(js_filepath: string): string {
        //gulp将文件最小化
        let js = get_file_content(js_filepath)
        let min_js = ''
        if(js_filepath === 'src/web-mobile/cocos2d-js-min.js'){
           min_js = js
        } else {
           min_js = uglify.minify(js).code
        }
        return `<script type="text/javascript">${min_js}</script>`
    }

    /** 将css文件转化为html文件内容(包括压缩过程) */
    function get_html_code_by_css_file(css_filepath: string): string {
        let css = get_file_content(css_filepath)
        let min_css = new CleanCSS().minify(css).styles
        return `<style>${min_css}</style>`
    }

    /** 执行任务 */
    export function do_task() {
        //==================替换main.js中的部分代码==================
        let main = fs.readFileSync('./src/web-mobile/main.js').toString();
        main = main.replace('if (jsList) {', 'if (false) {').replace('jsList = [bundledScript];', '');//去掉加载方法
        main=main.replace('.indexOf(cc.sys.browserType) < 0','>0');//去掉全屏
        fs.writeFileSync('./src/web-mobile/main.js', main)
       
        //========================================================

        // 前置:将res资源写成res.js
        console.time("写入res.js")
        write_resjs()
        console.timeEnd("写入res.js")

        // 清理html
        console.time("清理html")
        let html = get_file_content(C.INPUT_HTML_FILE)
        html = html.replace(/<link rel="stylesheet".*\/>/gs, "")
        html = html.replace(/<script.*<\/script>/gs, "")
        console.timeEnd("清理html")

        // 写入css
        console.log("写入所有css文件")
        C.INPUT_CSS_FILES.forEach(v => {
            console.time(`---${path.basename(v)}`)
            html = html.replace(/<\/head>/, `${get_html_code_by_css_file(v)}\n</head>`)
            console.timeEnd(`---${path.basename(v)}`)
        })

        // 写入js
        console.log("写入所有js到html")
        let scriptArr = ''
        C.INPUT_JS_FILES.forEach(v => {
            console.time(`---${path.basename(v)}`)
            scriptArr += `${get_html_code_by_js_file(v)}\n`
            console.timeEnd(`---${path.basename(v)}`)
        })
        html = html.replace(/<\/body>/, `${scriptArr}\n</body>`)

        // 写入文件并提示成功
        console.time("输出html文件")
        html=html.replace(/<\/body>&/,'')
        html=html.replace('splash.png','')
        fs.writeFileSync(C.OUTPUT_INDEX_HTML, html)
        console.timeEnd("输出html文件")
    }
}
X.do_task()


