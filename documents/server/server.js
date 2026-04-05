const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8000;

// MIMEタイプのマッピング
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  // URLをパース
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // ルートパスの場合はディレクトリ一覧またはindex.htmlを表示
  if (pathname === "/") {
    pathname = "/index.html";

    // index.htmlが存在しない場合はディレクトリ一覧を表示
    const indexPath = path.join(__dirname, "..", "index.html");
    if (!fs.existsSync(indexPath)) {
      serveDirectoryListing(req, res);
      return;
    }
  }

  // ファイルパスを構築 (server/フォルダから親ディレクトリを指す)
  const filePath = path.join(__dirname, "..", pathname);

  // ディレクトリの場合はディレクトリ一覧を表示
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    serveDirectoryListing(req, res, pathname);
    return;
  }

  // ファイルを読み込んで送信
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>404 Not Found</h1><p>ファイルが見つかりません。</p>");
      } else {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>500 Internal Server Error</h1>");
      }
      console.error(`[エラー] ${req.method} ${req.url} - ${err.code}`);
      return;
    }

    // MIMEタイプを取得
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // キャッシュ無効化ヘッダー（開発用）
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Expires: "0",
    });
    res.end(data);

    console.log(`[成功] ${req.method} ${req.url} - ${contentType}`);
  });
});

// ディレクトリ一覧を表示する関数
function serveDirectoryListing(req, res, pathname = "/") {
  const dirPath = path.join(__dirname, "..", pathname);

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>500 Internal Server Error</h1>");
      return;
    }

    // HTMLを生成
    let html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ディレクトリ一覧: ${pathname}</title>
    <style>
        body {
            font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
            margin: 40px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }
        .path {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 20px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
            transition: background 0.2s;
        }
        li:hover {
            background: #f8f9fa;
        }
        a {
            text-decoration: none;
            color: #667eea;
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        a:hover {
            color: #764ba2;
        }
        .icon {
            margin-right: 10px;
            font-size: 20px;
        }
        .file { color: #3498db; }
        .folder { color: #f39c12; }
        .parent { color: #95a5a6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📁 ディレクトリ一覧</h1>
        <div class="path">パス: ${pathname}</div>
        <ul>`;

    // 親ディレクトリへのリンク（ルート以外）
    if (pathname !== "/") {
      const parentPath = path.dirname(pathname);
      html += `<li><a href="${parentPath}"><span class="icon parent">↩️</span>親ディレクトリへ</a></li>`;
    }

    // ファイルとディレクトリをソート
    const sortedFiles = files.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    // ファイル一覧を生成
    sortedFiles.forEach((file) => {
      const isDir = file.isDirectory();
      const icon = isDir ? "📁" : "📄";
      const iconClass = isDir ? "folder" : "file";
      const href = path.join(pathname, file.name).replace(/\\/g, "/");
      html += `<li><a href="${href}"><span class="icon ${iconClass}">${icon}</span>${file.name}</a></li>`;
    });

    html += `
        </ul>
    </div>
</body>
</html>`;

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
}

// サーバーを起動
server.listen(PORT, () => {
  console.log("============================================================");
  console.log("  HTMLファイル検証サーバー起動 (Node.js)");
  console.log("============================================================");
  console.log(`  URL: http://localhost:${PORT}/`);
  console.log(`  テンプレート一覧: http://localhost:${PORT}/index.html`);
  console.log("  停止するには Ctrl+C を押してください");
  console.log("============================================================");
  console.log("");
});

// エラーハンドリング
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`エラー: ポート ${PORT} は既に使用されています。`);
    console.error(
      `別のアプリケーションがポート ${PORT} を使用している可能性があります。`,
    );
    console.error(
      `サーバーを停止するか、server.js の PORT 変数を変更してください。`,
    );
    process.exit(1);
  } else {
    console.error("サーバーエラー:", err);
    process.exit(1);
  }
});

// Ctrl+C でのシャットダウン
process.on("SIGINT", () => {
  console.log("\n\nサーバーを停止しました。");
  process.exit(0);
});
