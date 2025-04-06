#!/bin/bash

echo "[ApplicationStart] Installing dependencies & starting server..."

cd /home/ec2-user/tiempo-server

# 의존성 설치
npm install

# 서버 실행 (백그라운드로)
nohup node src/index.js
echo "Node.js server started."