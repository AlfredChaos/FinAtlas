.PHONY: dev dev-all backend worker frontend migrate down logs clean

# 仅启动基础设施（postgres / redis / rabbitmq）
dev:
	docker compose up -d

# 启动全部服务（包括 backend / worker / frontend）
dev-all:
	docker compose --profile all up -d

# 本地启动 FastAPI 开发服务器
backend:
	cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 本地启动 taskiq worker
worker:
	cd backend && taskiq worker app.tasks:broker

# 本地启动前端开发服务器
frontend:
	cd frontend && npm run dev -- --host

# 运行数据库迁移
migrate:
	cd backend && alembic upgrade head

# 停止全部服务
down:
	docker compose down

# 查看日志
logs:
	docker compose logs -f

# 清理 volumes（不可逆，会删除数据库数据）
clean:
	docker compose down -v
