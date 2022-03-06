# Video camera stream recorder

This is a video camera stream recorder frontend to backend which will create a file stored inside the videos folder.

#### DEPENDENCIES:

YOU MUST HAVE A CAMERA

node version: 14.18.2

(optional) npm install pm2 -g

#### SETUP:

1) Change variables inside .env.development and .env.production files at the root folder.

2) Install dependencies

```
npm i
```

3) Spin server up.

If it's development:

```
npm run dev
```

If it's production:

```
npm start
```

or
```
pm2 start --env production
```

4) Access "http://<domain>:<port>/" and enter AUTH_USER and AUTH_PASSWORD credentials.

5) Click start button to start recording and stop button to stop recording
