# TPTI H5 应用

基于 Vue 3 + Vite 的 H5 单页应用，代码位于 `h5/` 目录，原小程序代码保持不变。

---

## 本地开发

```bash
cd h5
npm install
npm run dev
```

访问 http://localhost:3000

---

## 生产构建

```bash
cd h5
npm install
npm run build
```

产物输出到 `h5/dist/`，可直接用任意静态服务器托管。

---

## Docker 构建与运行

### 构建镜像

```bash
cd h5
docker build -t tpti-h5 .
```

### 运行容器

```bash
docker run -d --name tpti-h5 -p 8080:80 tpti-h5
```

访问 http://localhost:8080

---

## docker-compose 使用

```bash
cd h5
docker compose up -d
```

访问 http://localhost:8080

停止服务：

```bash
docker compose down
```

---

## VPS 部署流程

1. 将整个项目上传至 VPS，或在 VPS 上 clone 仓库
2. 进入 `h5/` 目录

   ```bash
   cd h5
   ```

3. 确保已安装 Docker 和 Docker Compose
4. 执行

   ```bash
   docker compose up -d --build
   ```

5. 访问 `http://<VPS_IP>:8080`

如需修改映射端口，编辑 `h5/docker-compose.yml` 中的 `ports` 配置后重新部署。

---

## 技术栈

- Vue 3
- Vite 5
- nginx 1.25（Docker 运行时）
- Node 20（构建阶段）
