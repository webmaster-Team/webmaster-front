# build stage
FROM node:12 as build-stage

LABEL maintainer=brian@toimc.com

# 创建一个工作目录
WORKDIR /app

COPY . .

RUN yarn config set registry https://registry.npmjs.org --global

RUN yarn install

RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]