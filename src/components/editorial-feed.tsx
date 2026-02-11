"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type FeedItem = {
  title: string;
  date: string;
  href: string;
  sectionLabel: string;
  key: string;
};

function formatDotDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[1]}.${parts[2]}.${parts[0]}`;
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}.${d.getFullYear()}`;
}

export function EditorialFeed({ items }: { items: FeedItem[] }): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      
      // Effective range for the scaling effect (approx half container height)
      const range = containerRect.height / 1.8;

      itemsRef.current.forEach((item) => {
        if (!item) return;
        
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        
        // Distance from center
        const dist = Math.abs(containerCenter - itemCenter);
        
        // Calculate scale and opacity
        // If distance is 0, scale is 1. If distance >= range, scale is minScale.
        let scale = 1;
        let opacity = 1;
        
        if (dist < range) {
          const ratio = dist / range;
          // Scale from 1.0 down to 0.85
          scale = 1 - ratio * 0.15;
          // Opacity from 1.0 down to 0.4
          opacity = 1 - ratio * 0.6;
        } else {
          scale = 0.85;
          opacity = 0.4;
        }

        // Apply styles directly for performance
        item.style.transform = `scale(${scale})`;
        item.style.opacity = String(opacity);
      });
    };

    // Initial check
    handleScroll();

    // Bind event
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="editorial-feed" ref={containerRef}>
      {/* 
        Add padding spacers to allow first and last items to reach the center.
        Approx 40vh is enough to push top item to middle if container height is ~100vh calc.
      */}
      <div style={{ height: "30vh" }} />
      
      {items.map((item, index) => (
        <article
          key={item.key}
          className="editorial-post"
          ref={(el) => {
            itemsRef.current[index] = el;
          }}
          style={{ 
            transition: "transform 0.1s ease-out, opacity 0.1s ease-out", 
            transformOrigin: "center center" 
          }}
        >
          <time className="editorial-date">{formatDotDate(item.date)}</time>
          <h2 className="editorial-post-title">{item.title}</h2>
          <Link href={item.href} className="editorial-read-btn">
            Read {item.sectionLabel}
          </Link>
        </article>
      ))}

      <div style={{ height: "30vh" }} />
    </section>
  );
}
