# 区块链项目

**热身报告请见**：[热身报告](./热身报告)

**项目设计说明请见**：[项目设计说明](./项目设计说明.md)

**功能测试文档请见**：[功能测试文档](./功能测试文档.md)

**期末实验报告请见**：[期末大作业实验报告](期末大作业实验报告.md)

**智能合约代码请见**：[SupplyChain.sol](./BackEnd/packages/cli/contracts/SupplyChain.sol)

**视频演示请见**：[视频演示](./视频演示.mp4)

## 实现功能

**TODO:**

- [x] 智能合约基本功能
- [x] 前后端框架
- [x] 前端实现
- [x] 后端实现


## 链端

**链端代码**：[ChainEnd](./BackEnd/packages/cli/conf/ChainEnd)

**运行说明**：

`cd BackEnd/packages/cli/conf/ChainEnd/fisco/nodes/127.0.0.1`

`bash start_all.sh`

**停止**：

`cd BackEnd/packages/cli/conf/ChainEnd/fisco/nodes/127.0.0.1`

`bash stop_all.sh `

## 后端

**后端代码**：[BackEnd](./BackEnd)

**运行说明**：

`cd BackEnd`

`npm install`

`npm run repoclean`

`npm run bootstrap`

`cd packages/cli `

`node app.js`

**停止**：

- `Windows/Linux 端`：`Control + c`
- `Mac 端`：`Command + c`

## 前端

**前端代码**：[FrontEnd](./FrontEnd)

**运行说明**：

`cd FrontEnd`

`npm install`

`npm install eslint-plugin-html`

`npm run dev`

**停止**：

- `Windows/Linux 端`：`Control + c`
- `Mac 端`：`Command + c`