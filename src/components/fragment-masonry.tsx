"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type FragmentEntry } from "@/types/content";

type FragmentMasonryProps = {
  items: FragmentEntry[];
};

function formatDotDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[1]}.${parts[2]}.${parts[0]}`;
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}.${d.getFullYear()}`;
}

export function FragmentMasonry({ items }: FragmentMasonryProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numColumns, setNumColumns] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setNumColumns(1);
      else if (width < 1024) setNumColumns(2);
      else if (width < 1440) setNumColumns(3);
      else if (width < 1920) setNumColumns(4);
      else setNumColumns(5);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute items into columns based on current numColumns
  const columns: FragmentEntry[][] = Array.from({ length: numColumns }, () => []);
  items.forEach((item, i) => {
    columns[i % numColumns].push(item);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (): void => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      
      // Range for effect
      const range = containerRect.height / 1.5;

      // Query cards dynamically to ensure we always have the current list
      const cards = container.querySelectorAll<HTMLElement>(".masonry-card");

      cards.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        // Use the vertical center of the card
        const itemCenter = itemRect.top + itemRect.height / 2;
        const dist = Math.abs(containerCenter - itemCenter);
        
        let scale = 1;
        let opacity = 1;
        
        if (dist < range) {
          const ratio = dist / range;
          scale = 1 - ratio * 0.12; 
          opacity = 1 - ratio * 0.5;
        } else {
          scale = 0.88;
          opacity = 0.5;
        }

        item.style.transform = `scale(${scale})`;
        item.style.opacity = String(opacity);
      });
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    
    // We already handle resize for columns, but we also need to recalculate effects on resize
    // Since re-rendering happens on resize (due to numColumns change), 
    // this effect will re-run if we include numColumns in dependency, 
    // or we can attach a separate resize listener here if dependency is [].
    // Given the column change handles the major layout shift, let's just 
    // rely on the fact that handleScroll is called on mount, 
    // and if we add numColumns to dependency, it gets called again after layout change.
    
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [numColumns]); // Re-run when columns change to ensure correct initial state for new layout

  return (
    <div className="masonry-scroll-container" ref={containerRef}>
      {/* Spacer for centering first item */}
      <div style={{ height: "15vh" }} />
      
      <div 
        className="masonry-grid" 
        style={{ 
          gridTemplateColumns: `repeat(${numColumns}, 1fr)` 
        }}
      >
        {columns.map((colItems, colIndex) => (
          <div key={colIndex} className="masonry-column">
            {colItems.map((item) => {
              return (
                <article
                  key={item.slug}
                  className="masonry-card"
                  // ref handling replaced by querySelectorAll in effect
                >
                  <div className="masonry-media">
                    {/* If has text only, show abstract pattern or color */}
                    {item.images && item.images.length > 0 ? (
                      <div className="media-wrapper">
                         {item.images.map((imgSrc, idx) => (
                           <img 
                             key={idx}
                             src={imgSrc} 
                             alt={item.title}
                             style={{ display: "block", width: "100%", height: "auto" }}
                           />
                         ))}
                      </div>
                    ) : (
                      <div className="media-placeholder" style={{ height: `${200 + (item.title.length * 5) % 150}px`, backgroundColor: `hsl(${20 + item.title.length % 30}, 20%, 90%)` }}>
                         {/* Pure image style placeholder: just a colored block if no image */}
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden content for accessibility but visual is pure image */}
                  <div className="sr-only">
                    <time>{formatDotDate(item.date)}</time>
                    <h3>{item.title}</h3>
                  </div>
                  <Link href={`/fragments?slug=${item.slug}`} className="masonry-link-overlay" aria-label={`View ${item.title}`} />
                </article>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ 
        textAlign: "center", 
        opacity: 0.4, 
        marginTop: "4rem", 
        fontFamily: "var(--font-serif)",
        fontSize: "0.9rem",
        letterSpacing: "0.1em"
      }}>
        ———— 到底啦 ————
      </div>

      <div style={{ height: "15vh" }} />
    </div>
  );
}
