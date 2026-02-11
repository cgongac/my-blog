# Personal Blog

基于 Next.js + TypeScript + Markdown 的个人博客模板。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 必需环境变量

- `BLOG_PRIVATE_PASSWORD`: 私密区统一访问密码
- `NEXT_PUBLIC_SITE_URL`: 站点地址（用于 sitemap/metadata）

## 页面

- `/`
- `/articles`
- `/articles/[slug]`
- `/diary`
- `/diary/[slug]`
- `/fragments`
- `/unlock`
