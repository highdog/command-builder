# 使用官方Node.js运行时作为基础镜像
FROM node:18-alpine

# 安装sqlite3运行时依赖
RUN apk add --no-cache sqlite

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 设置生产环境
ENV NODE_ENV=production

# 临时安装构建依赖，安装npm包，然后清理
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    python3-dev \
    py3-setuptools \
    make \
    g++ && \
    npm ci --omit=dev && \
    apk del .build-deps

# 复制应用代码
COPY . .

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有权
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# 启动应用
CMD ["node", "server.js"]