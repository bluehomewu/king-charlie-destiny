<div align="center">

# 👑 查理國王 - 選擇困難症救星

**不知道要喝什麼？讓命運來決定吧！**

這是一個為「查理國王」飲料店設計的隨機飲品選擇器，透過轉盤決定今天要喝什麼，並搭配 AI 生成有趣的命運訊息！

[![Deploy to GitHub Pages](https://github.com/bluehomewu/king-charlie-destiny/actions/workflows/deploy.yml/badge.svg)](https://github.com/bluehomewu/king-charlie-destiny/actions/workflows/deploy.yml)

</div>

---

## ✨ 功能特色

- 🎰 **輪盤抽選** - 隨機選擇飲品，終結選擇困難
- ❤️ **我的最愛** - 建立個人常喝清單
- 🎯 **分類篩選** - 依飲品種類快速篩選
- 💰 **預算控制** - 設定價格範圍
- 🧊 **甜度冰塊** - 隨機決定甜度與冰塊
- 🔮 **AI 命運籤** - 使用 Gemini AI 生成有趣的命運訊息

---

## 🚀 GitHub Pages 部署教學

### 步驟一：Fork 或 Clone 此專案

```bash
git clone https://github.com/bluehomewu/king-charlie-destiny.git
```

### 步驟二：設定 GitHub Repository Secrets

1. 前往你的 GitHub Repository
2. 點擊 **Settings** (設定)
3. 在左側選單找到 **Secrets and variables** → **Actions**
4. 點擊 **New repository secret**
5. 新增以下 Secret：
   - **Name:** `GEMINI_API_KEY`
   - **Value:** 你的 Gemini API Key（取得方式請參考下方）

### 步驟三：啟用 GitHub Pages

1. 前往你的 GitHub Repository
2. 點擊 **Settings** (設定)
3. 在左側選單找到 **Pages**
4. 在 **Source** 區段，選擇 **GitHub Actions**
5. 儲存設定

### 步驟四：觸發部署

- 只要 push 到 `main` 分支，就會自動觸發部署
- 或者前往 **Actions** 分頁，手動執行 **Deploy to GitHub Pages** 工作流程

部署完成後，你的網站將會在：
```
https://<你的GitHub帳號>.github.io/king-charlie-destiny/
```

---

## 🔑 取得 Gemini API Key

1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 登入你的 Google 帳號
3. 點擊 **Get API Key** 或 **建立 API 金鑰**
4. 選擇或建立一個 Google Cloud 專案
5. 複製產生的 API Key
6. 將 API Key 加入到 GitHub Secrets（如上方步驟二所述）

> ⚠️ **注意事項：**
> - API Key 是敏感資訊，請勿將其直接寫在程式碼中
> - 免費版本有使用限制，詳情請參考 [Google AI Studio 定價](https://ai.google.dev/pricing)

---

## 💻 本地開發

### 環境需求

- Node.js 20+
- npm

### 安裝步驟

1. 安裝依賴套件：
   ```bash
   npm install
   ```

2. 建立 `.env.local` 檔案，並設定 Gemini API Key：
   ```bash
   GEMINI_API_KEY=你的API金鑰
   ```

3. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

4. 開啟瀏覽器訪問 `http://localhost:3000`

### 建置專案

```bash
npm run build
```

建置完成的檔案會在 `dist/` 目錄中。

---

## 🛠️ 技術棧

- **前端框架：** React 19
- **建置工具：** Vite
- **程式語言：** TypeScript
- **樣式：** Tailwind CSS
- **AI 服務：** Google Gemini API
- **部署：** GitHub Pages + GitHub Actions

---

## 👥 製作團隊

<table>
  <tr>
    <td align="center">
      <b>網頁設計</b><br>
      <a href="https://github.com/bluehomewu">@bluehomewu</a><br>
      <sub>EdwardWu</sub>
    </td>
    <td align="center">
      <b>程式開發</b><br>
      <a href="https://aistudio.google.com/">Gemini 3 Build APP</a><br>
      <sub>AI Studio</sub>
    </td>
  </tr>
</table>

---

## 📄 授權

本專案僅供學習與參考使用。

---

<div align="center">
  <sub>Made with ❤️ for 查理國王飲料店</sub>
</div>
