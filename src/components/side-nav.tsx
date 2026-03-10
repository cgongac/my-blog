"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "Newsletter" },
  { href: "/diary", label: "日记" },
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
        {/* Profile section */}
        <div className="side-nav-profile">
          <div className="side-nav-avatar">
            {siteConfig.siteName.charAt(0)}
          </div>
          <p className="side-nav-bio">
            {siteConfig.siteSubtitle}
          </p>
          {/* Social links */}
          <div className="side-nav-social">
            {siteConfig.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="side-nav-social-link" aria-label={link.label}>
                {link.label === "GitHub" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation links */}
        <ul className="side-nav-list">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link href={item.href} className={`side-nav-link ${isActive ? "active" : ""}`}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer actions */}
        <div className="side-nav-footer">
          <div className="side-nav-footer-actions">
            <button onClick={handleThemeToggle} className="side-nav-footer-btn" aria-label="切换主题">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
            {isUnlocked ? (
              <span className="side-nav-footer-btn" style={{ cursor: "default" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              </span>
            ) : (
              <Link href="/unlock" className="side-nav-footer-btn" aria-label="解锁私密">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </Link>
            )}
            <button onClick={handleLogout} className="side-nav-footer-btn" aria-label="退出">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
