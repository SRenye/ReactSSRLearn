//这里用nodemon配置服务端代码的热更新，nodemon监听nodemon.json

const express = require("express");
const ReactSSR = require("react-dom/server");
const fs = require("fs");
const path = require("path");
const favicon = require('serve-favicon')
const isDev = process.env.NODE_ENV === "development";

const app = express();

app.use(favicon(path.join(__dirname,'../favicon.ico')))

//不是开发模式的情况下，就会生成有dist目录
console.log("now is ",isDev);
if (!isDev) {
  const serverEntry = require("../dist/server-entry").default;
  const template = fs.readFileSync(
    path.join(__dirname, "../dist/index.html"),
    "utf8"
  );
  app.use("/public", express.static(path.join(__dirname, "../dist")));

  app.get("*", function(req, res) {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace("<!-- app -->", appString));
  });
} else {
  console.log('this is devStatic')
  const devStatic = require('./util/dev-static.js')
  devStatic(app);
}

app.listen(3333, function() {
  console.log("server is listening on 3333 port");
});
