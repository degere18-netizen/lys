// My PMS 로컬 서버 - 데이터를 my-pms-data.json 파일에 자동 저장/불러오기
// 실행: node server.js   (My PMS 바로가기가 자동으로 실행합니다)
const http = require("http");
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const DATA_FILE = path.join(DIR, "my-pms-data.json");
const PORT = 8787;

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".ico": "image/x-icon" };

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  // 데이터 읽기
  if (url === "/api/data" && req.method === "GET") {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) return send(res, 200, "[]", "application/json"); // 파일 없으면 빈 목록
      send(res, 200, data, "application/json");
    });
    return;
  }

  // 데이터 저장
  if (url === "/api/data" && req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 5e6) req.destroy(); });
    req.on("end", () => {
      try {
        JSON.parse(body); // 유효성 검사
        fs.writeFile(DATA_FILE, body, "utf8", err => {
          if (err) return send(res, 500, "write error");
          send(res, 200, "ok");
        });
      } catch (e) { send(res, 400, "bad json"); }
    });
    return;
  }

  // 정적 파일 (index.html 등)
  let file = url === "/" ? "/index.html" : url;
  let target = path.normalize(path.join(DIR, decodeURIComponent(file)));
  if (!target.startsWith(DIR)) return send(res, 403, "forbidden"); // 디렉터리 탈출 방지
  fs.readFile(target, (err, data) => {
    if (err) return send(res, 404, "not found");
    send(res, 200, data, MIME[path.extname(target)] || "application/octet-stream");
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("My PMS server running -> http://localhost:" + PORT);
  console.log("데이터 파일: " + DATA_FILE);
});
