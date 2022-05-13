# 原创力文档下载合成


使用[puppeteer](https://github.com/puppeteer/puppeteer)实现下载原创力文档

仅支持下载可预览的图片，下载完成将多张图片合成一张

仅用于学习交流

图片合成的功能依赖 [gm](https://github.com/aheckmann/gm), 使用前需安装对应环境
## 安装使用

```bash
npm i
```

```bash
# 使用示例
node main.js url=https://max.book118.com/html/2021/0806/xxxxx.shtm e_file_name=xxx.jpg dir=dir
```

|     |     |
| --- | --- |
|e_file_name| 下载完成保存的图片名称|
|dir| 保存的文件夹|
