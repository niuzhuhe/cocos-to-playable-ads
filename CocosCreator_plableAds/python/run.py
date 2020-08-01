#coding:utf-8
import glob
import os

#执行cmd命令，cwebp工具包
cmd_cwebp = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp'
os.system(cmd_cwebp)

# glob.glob模块，遍历找到png/jpg所在路径path
filePng =  glob.glob("/Users/niuzhuhe/Desktop/cocosPack/src/web-mobile/res/raw-assets/*/*.png")
fileJpg =  glob.glob("/Users/niuzhuhe/Desktop/cocosPack/src/web-mobile/res/raw-assets/*/*.jpg")

# 遍历文件
for file in filePng:    
	# 筛选大于5kb的进行压缩
    kb_png = os.path.getsize(file)/float(1024)
    if kb_png > 5: 
    	cmd = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp -q 50 %s -o %s' % (file, file)
    	# print(cmd) 
    	os.system(cmd)
    	# print(kb_png)

for files in fileJpg:
	# 筛选大于5kb的进行压缩
	kb_jpg = os.path.getsize(files)/float(1024)
	if kb_jpg > 5:
	    cmd = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp -q 50 %s -o %s' % (files, files)
	    # print(cmd) 
	    os.system(cmd)
		# print(kb_jpg)

# 打开终端 cd 到 /Users/niuzhuhe/Desktop/cocosPack目录下
cmd_cdCocosPack = '/Users/niuzhuhe/Desktop/cocosPack'
os.chdir(cmd_cdCocosPack)
# 然后接着执行npm run build
cmd_runBuild = 'npm run build'
os.system(cmd_runBuild)
