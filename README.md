# Personal Blog

基于 Next.js + TypeScript + Markdown 的个人博客。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 环境变量

- `BLOG_PRIVATE_PASSWORD`: 私密区访问密码
- `NEXT_PUBLIC_SITE_URL`: 站点地址

## 页面

- `/` 首页
- `/articles` Newsletter
- `/articles/[slug]` 文章详情
- `/diary` My Diary
- `/diary/[slug]` 日记详情
- `/unlock` 解锁私密内容
