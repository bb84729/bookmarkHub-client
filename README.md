# BookmarkHub — Client

BookmarkHub 的前端介面，提供書籤與資料夾的視覺化管理，支援拖曳排序、搜尋等互動功能。

後端 Repo：[bookmarkhub-server](https://github.com/bb84729/bookmarkHub-server)

---

## 技術架構

| 類別     | 技術         |
| -------- | ------------ |
| 框架     | Vue.js 3     |
| 語言     | TypeScript   |
| 樣式     | Tailwind CSS |
| UI 元件  | shadcn-vue   |
| 狀態管理 | Pinia        |

---

## 功能列表

- **使用者驗證** — 登入、註冊，搭配後端 JWT 雙 Token 機制，自動處理 Token 刷新
- **書籤管理** — 新增、編輯、刪除書籤，支援分頁載入
- **資料夾管理** — 建立資料夾、將書籤歸類整理
- **拖曳排序** — 書籤與資料夾皆可拖曳調整順序
- **搜尋** — 即時搜尋書籤標題與網址

---

## 專案結構

```
src/
├── components/     # 共用元件
├── composables/    # 可複用邏輯（useBookmark、useFolder 等）
├── pages/          # 頁面元件
├── stores/         # Pinia 狀態管理
├── services/       # API 呼叫層
├── types/          # TypeScript 型別定義
└── main.ts         # 入口點
```

---

## 本地開發

### 環境需求

- Node.js 18+
- 後端服務需先啟動（參考 [bookmarkhub-server](https://github.com/bb84729/bookmarkHub-server)）

### 步驟

**1. Clone 專案**

```bash
git clone https://github.com/bb84729/bookmarkhub-client.git
cd bookmarkhub-client
```

**2. 設定環境變數**

```bash
cp .env.example .env
```

編輯 `.env`，填入後端 API 位址。

**3. 安裝依賴並啟動**

```bash
npm install
npm run dev
```

前端預設運行於 `http://localhost:5173`

---

## 環境變數

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

| 變數                | 說明                |
| ------------------- | ------------------- |
| `VITE_API_BASE_URL` | 後端 API 的基底網址 |
