# build stage
FROM node:12 as build-stage

LABEL maintainer=brian@toimc.com

# 创建一个工作目录
WORKDIR /app

COPY . .

# 获取依赖
RUN npm install

# 开始构建
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html
  
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# 自动化测试
FROM cypress/base:10 as test-stage

WORKDIR /test

# 从build-stage中拷贝cypress配置文件
COPY . .

RUN npm install --save-dev cross-env

RUN npm install --save-dev cypress

# 执行测试
RUN npm run test:product