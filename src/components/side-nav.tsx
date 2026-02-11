"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Simple SVGs for minimal editorial look */
const Icons = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Article: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  Diary: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Fragment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Theme: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Exit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const navItems = [
  { href: "/", label: "首页", icon: Icons.Home },
  { href: "/articles", label: "文章分类", icon: Icons.Article },
  { href: "/diary", label: "日记", icon: Icons.Diary },
  { href: "/fragments", label: "日常碎片", icon: Icons.Fragment },
];

export function SideNav({ isUnlocked = false }: { isUnlocked?: boolean }): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  };

  const handleThemeToggle = (): void => {
    const current = document.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("blog-theme", next);
  };

  if (!mounted) return <aside className="side-nav" />;

  return (
    <aside className="side-nav">
      <nav className="side-nav-content">
        <ul className="side-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href} className="side-nav-item-wrapper">
                <Link href={item.href} className={`side-nav-link ${isActive ? "active" : ""}`}>
                  <span className="side-nav-icon">
                    <Icon />
                  </span>
                  <span className="side-nav-text">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="side-nav-footer">
          <ul className="side-nav-list">
            <li className="side-nav-item-wrapper">
              <button onClick={handleThemeToggle} className="side-nav-link" aria-label="切换主题">
                <span className="side-nav-icon">
                  <Icons.Theme />
                </span>
                <span className="side-nav-text">切换主题</span>
              </button>
            </li>
            <li className="side-nav-item-wrapper">
              {isUnlocked ? (
                <div className="side-nav-link" style={{ cursor: "default", color: "var(--color-text)" }}>
                  <span className="side-nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  </span>
                  <span className="side-nav-text">已解锁</span>
                </div>
              ) : (
                <Link href="/unlock" className="side-nav-link">
                  <span className="side-nav-icon">
                    <Icons.Lock />
                  </span>
                  <span className="side-nav-text">解锁私密</span>
                </Link>
              )}
            </li>
            <li className="side-nav-item-wrapper">
              <button onClick={handleLogout} className="side-nav-link" aria-label="退出">
                <span className="side-nav-icon">
                  <Icons.Exit />
                </span>
                <span className="side-nav-text">退出</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
