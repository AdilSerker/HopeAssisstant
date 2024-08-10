FROM node:18.16.0

WORKDIR /app

COPY . .

RUN npm i
RUN npm run build

CMD bash -x /app/run.sh
