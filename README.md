# TPTI H5 应用

TPTI（Tuberculosis Prevention Type Indicator，防痨体质鉴定）是一款面向结核病防治知识科普的 H5 评估应用。用户完成按维度均衡抽取的 10 道题后，可以获得自己的 TPTI 结果类型、评估得分、知识水平、错题回顾和重点建议。

应用当前包含首页、答题页、结果页和知识指南四个核心模块，支持答题进度持久化、结果回看、全站共享参与人数统计，以及基于浏览器原生分享能力的结果分享。由于共享计数依赖同源 `/api` 服务，推荐始终以“前端 nginx + API + SQLite”双服务方式部署。

---

## 本地开发

```bash
npm install
npm run dev
```

另开一个终端启动参与统计 API：

```bash
cd api
npm install
npm run dev
```

默认数据库会写入 `api/data/participation.sqlite`。

访问 http://localhost:3000

API 本地默认监听 http://localhost:3001

---

## 生产构建

```bash
npm install
npm --prefix api install
npm run test
npm run build
```

`dist/` 只包含前端静态资源；如果你需要首页共享参与人数统计，生产环境还必须同时提供同源 `/api` 服务与持久化数据库。

---

## Docker 部署

当前仓库提供两份 Compose 配置：

- `docker-compose.local.yml`：本地源码构建版
- `docker-compose.yml`：服务器 / dpanel / VPS 镜像部署版（直接拉 GHCR，不依赖本地 `./api` 源码目录）

### A. 本地源码构建与运行

从源码直接构建并启动双服务：

```bash
docker compose -f docker-compose.local.yml up -d --build
```

访问 http://localhost:6666

---

### B. GHCR 镜像部署

`docker-compose.yml` 是服务器镜像部署版，只声明 `ghcr.io/zhy0504/tpti-h5:latest` 与 `ghcr.io/zhy0504/tpti-h5-api:latest`，适合 dpanel / VPS / GHCR 拉镜像部署。

**方式一：docker compose（推荐）**

```bash
docker compose pull
docker compose up -d
```

访问 http://localhost:6666

参与统计数据保存在 Docker volume `participation_data` 中，容器重启后会继续保留。

停止服务：

```bash
docker compose down
```

## VPS 部署流程

1. 将项目上传至 VPS，或在 VPS 上 clone 仓库
2. 进入项目目录

   ```bash
   cd tpti
   ```

3. 确保已安装 Docker 和 Docker Compose
4. 使用默认的 `docker-compose.yml` 拉取最新镜像并启动服务

   ```bash
   docker compose pull
   docker compose up -d
   ```

5. 访问 `http://<VPS_IP>:6666`

如需修改映射端口，编辑所使用的 Compose 文件中的 `ports` 配置后重新执行第 4 步。

如需保留参与人数统计，请不要删除 `participation_data` volume。

如果你使用 dpanel 或其他面板部署，请优先使用默认的 `docker-compose.yml`，因为它不包含 `build.context`，不会要求服务器目录中存在本地 `./api` 源码。

如果你使用自定义反向代理或非 Compose 方式部署，请确保前端页面与 `/api` 服务保持同源，否则首页共享计数与提交上报不会工作。

---

## 技术栈

- Vue 3
- Vite 5
- Express 4
- better-sqlite3
- nginx 1.25（Docker 运行时）
- Node 20（前端构建与 API 运行）

---

## License

MIT
