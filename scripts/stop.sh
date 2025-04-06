#!/bin/bash

echo "[ApplicationStop] Stopping existing Node.js app..."

# 실행 중인 node 프로세스 중 내 앱만 찾아서 종료
# 예: /home/ec2-user/tiempo-server/main.js 가 실행 중인 경우
PID=$(pgrep -f "node.*tiempo-server")

if [ -n "$PID" ]; then
  echo "Found Node process with PID: $PID. Killing..."
  kill -9 $PID
else
  echo "No Node.js process found."
fi

exit 0