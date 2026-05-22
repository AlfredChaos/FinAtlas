FROM node:20-alpine

WORKDIR /app

# 先复制依赖描述文件，利用 docker 缓存层
COPY package.json package-lock.json* ./

RUN npm install

# 复制应用代码
COPY . .

# 生产构建（开发模式下通过 docker-compose override 使用 npm run dev）
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
