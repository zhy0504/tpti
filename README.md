# TPTI H5 应用

TPTI（Tuberculosis Prevention Type Indicator，防痨体质鉴定）是一款面向结核病防治知识科普的 H5 测评应用。用户完成随机组卷的 12 道题后，可以获得自己的 TPTI 类型、答题得分、段位评级、错题回顾和个性化防护建议。

应用当前包含首页引导、测试说明、答题页、结果页和知识补给站五个核心模块，支持答题进度持久化、结果回看，以及基于浏览器原生分享能力的结果分享。项目同时提供 Docker / docker compose / VPS 部署方案，适合直接作为独立前端项目运行和发布。

---

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

---

## 生产构建

```bash
npm install
npm run build
```

产物输出到 `dist/`，可直接用任意静态服务器托管。

---

## Docker 部署

### A. 本地构建与运行

从源码构建镜像：

```bash
docker build -t tpti-h5 .
docker run -d --name tpti-h5 -p 8080:80 tpti-h5
```

访问 http://localhost:8080

---

### B. GHCR 镜像部署

`docker-compose.yml` 默认使用 GHCR 镜像 `ghcr.io/zhy0504/tpti-h5:latest`。

**方式一：docker compose（推荐）**

```bash
docker compose up -d
```

访问 http://localhost:8080

停止服务：

```bash
docker compose down
```

**方式二：docker pull + docker run**

```bash
docker pull ghcr.io/zhy0504/tpti-h5:latest
docker run -d --name tpti-h5 -p 8080:80 ghcr.io/zhy0504/tpti-h5:latest
```

访问 http://localhost:8080

停止并删除容器：

```bash
docker stop tpti-h5
docker rm tpti-h5
```

---

## VPS 部署流程

1. 将项目上传至 VPS，或在 VPS 上 clone 仓库
2. 进入项目目录

   ```bash
   cd tpti
   ```

3. 确保已安装 Docker 和 Docker Compose
4. 拉取最新镜像并启动服务

   ```bash
   docker compose pull
   docker compose up -d
   ```

5. 访问 `http://<VPS_IP>:8080`

如需修改映射端口，编辑 `docker-compose.yml` 中的 `ports` 配置后重新执行第 4 步。

---

## 技术栈

- Vue 3
- Vite 5
- nginx 1.25（Docker 运行时）
- Node 20（构建阶段）

---

## License

MIT
