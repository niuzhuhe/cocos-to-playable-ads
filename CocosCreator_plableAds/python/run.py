import glob
import os
#cwebp
cmd_cwebp = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp'
os.system(cmd_cwebp)

# png/jpg path
filePng =  glob.glob("/Users/niuzhuhe/Desktop/cocosPack/src/web-mobile/res/raw-assets/*/*.png")
fileJpg =  glob.glob("/Users/niuzhuhe/Desktop/cocosPack/src/web-mobile/res/raw-assets/*/*.jpg")


for file in filePng:
    cmd = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp -q 30 %s -o %s' % (file, file)
    print(cmd) 
    os.system(cmd)
    #print(file)


for files in fileJpg:
    cmd = '/Users/niuzhuhe/Desktop/cocosPack/python/cwebp -q 30 %s -o %s' % (files, files)
    print(cmd) 
    os.system(cmd)
    #print(file)

# cd /Users/niuzhuhe/Desktop/cocosPack
cmd_cdCocosPack = '/Users/niuzhuhe/Desktop/cocosPack'
os.chdir(cmd_cdCocosPack)
# npm run build
cmd_runBuild = 'npm run build'
os.system(cmd_runBuild)
