### 2021 字节训练营后端代码

本地安装 mongoDB，建立名为 bytedance-backend 的数据库。

`npm start`：生产环境

`npm run dev`：开发环境

`npm run build`：打包，生成一个 build 文件夹。文件夹里直接 `npm i` 然后 `npm start` 就可以跑起来

`npm run test`：测试

`npm run test-suite "user"`：测试用户模块

`npm run test-suite "user login"`：测试用户模块下的登录模块



sharp 装不上先依次执行

  - `npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"`

  - `npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"`

再尝试



启动失败先 `npm i ts-node nodemon -g` 再尝试
