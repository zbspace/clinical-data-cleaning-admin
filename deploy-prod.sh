#!/bin/bash
# =====================================================
# 前端部署脚本：将 dist 目录同步到服务器指定目录并替换
# 用法：
#   ./deploy.sh              # 直接同步当前 dist
#   ./deploy.sh --build      # 先执行 npm run build:dev 再同步（开发环境）
#   ./deploy.sh --build:prod # 先执行 npm run build 再同步（生产环境）
# =====================================================
set -e

# ---------- 服务器配置（按需修改） ----------
SERVER_HOST="47.101.173.159"               # 服务器 IP/域名
SERVER_USER="root"                        # SSH 用户
SERVER_DIR="/var/www/web/admin/"               # 目标部署目录
SSH_PORT=22                              # SSH 端口
# ------------------------------------------

# 本地 dist 目录
LOCAL_DIR="dist"

# 参数解析：--build 先构建
if [ "$1" = "--build:prod" ]; then
  echo ">>> 生产环境构建..."
  npm run build
elif [ "$1" = "--build" ]; then
  echo ">>> 开发环境构建..."
  npm run build:dev
fi

# 检查本地 dist 是否存在
if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ 未找到 $LOCAL_DIR 目录，请先执行 npm run build:prod"
  exit 1
fi

# 安全校验：防止误删服务器根目录
if [ -z "$SERVER_DIR" ] || [ "$SERVER_DIR" = "/" ]; then
  echo "❌ SERVER_DIR 配置不安全，拒绝执行"
  exit 1
fi

echo ">>> 部署 $LOCAL_DIR -> $SERVER_USER@$SERVER_HOST:$SERVER_DIR ..."

# 1. 确保目标目录存在
ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "mkdir -p '$SERVER_DIR'"

# 2. 清空服务器目标目录（实现完整替换，删除旧文件）
ssh -p "$SSH_PORT" "$SERVER_USER@$SERVER_HOST" "rm -rf '${SERVER_DIR}'*"

# 3. 上传 dist 所有文件
scp -P "$SSH_PORT" -r "$LOCAL_DIR"/* "$SERVER_USER@$SERVER_HOST:$SERVER_DIR"

echo "✅ 部署完成：$SERVER_HOST:$SERVER_DIR"
