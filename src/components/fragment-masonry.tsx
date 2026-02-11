"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="masonry-scroll-container">
      {/* Spacer for centering first item */}
      <div style={{ height: "4vh" }} />
      
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
