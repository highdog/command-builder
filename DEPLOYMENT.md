# 生产环境部署指南

## 服务器部署步骤

### 1. 拉取最新代码
```bash
git pull origin main
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
# 复制生产环境配置
cp .env.production .env

# 编辑配置文件，设置安全的密码
nano .env
```

### 4. 创建日志目录
```bash
mkdir -p logs
```

### 5. 启动服务

#### 方法1：使用PM2（推荐）
```bash
# 安装PM2
npm install -g pm2

# 启动生产环境
pm2 start ecosystem.config.js --env production

# 查看状态
pm2 status

# 查看日志
pm2 logs command-builder

# 设置开机自启
pm2 startup
pm2 save
```

#### 方法2：直接启动
```bash
node server-production.js
```

#### 方法3：后台运行
```bash
nohup node server-production.js > logs/app.log 2>&1 &
```

### 6. 配置防火墙
```bash
# 开放3300端口
firewall-cmd --permanent --add-port=3300/tcp
firewall-cmd --reload

# 验证端口开放
firewall-cmd --list-ports
```

### 7. 验证部署
```bash
# 检查服务状态
curl http://localhost:3300/health

# 检查外部访问
curl http://159.75.182.217:3300/health
```

## 生产环境特性

### 安全增强
- ✅ 安全头设置（X-Content-Type-Options, X-Frame-Options, X-XSS-Protection）
- ✅ 环境变量管理
- ✅ 会话安全配置
- ✅ 管理员权限控制

### 监控和日志
- ✅ 请求日志记录
- ✅ 错误处理和日志
- ✅ 健康检查端点 `/health`
- ✅ 优雅关闭处理

### 性能优化
- ✅ 静态文件缓存
- ✅ 数据库连接池
- ✅ 内存使用监控

## 访问地址

- **本地访问**: http://localhost:3300
- **外部访问**: http://159.75.182.217:3300
- **健康检查**: http://159.75.182.217:3300/health

## 管理命令

```bash
# PM2 管理
pm2 restart command-builder    # 重启服务
pm2 stop command-builder       # 停止服务
pm2 delete command-builder     # 删除服务
pm2 logs command-builder       # 查看日志
pm2 monit                      # 监控面板

# 查看进程
ps aux | grep node

# 查看端口占用
netstat -tlnp | grep 3300
```

## 故障排除

### 端口被占用
```bash
# 查找占用进程
lsof -i :3300
# 或
netstat -tlnp | grep 3300

# 杀死进程
kill -9 <PID>
```

### 数据库问题
```bash
# 检查数据库文件权限
ls -la commands.db

# 重新创建数据库（如果需要）
rm commands.db
# 然后重启服务，会自动创建
```

### 日志查看
```bash
# PM2 日志
pm2 logs command-builder

# 系统日志
tail -f logs/combined.log
tail -f logs/error.log
```
