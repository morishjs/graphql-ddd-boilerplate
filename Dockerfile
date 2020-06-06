FROM gcr.io/selectchu-prod-253306/sc-ad:latest

WORKDIR /opt/app

COPY package.json ./

COPY . /opt/app

RUN yarn install --frozen-lockfile && npm run build

CMD [ "yarn", "start" ]
