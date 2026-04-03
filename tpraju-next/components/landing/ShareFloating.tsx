"use client";

import { useEffect, useRef, useState } from "react";

export function ShareFloating({ siteUrl }: { siteUrl?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [href, setHref] = useState(siteUrl ?? "https://yourwebsite.com");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteUrl) setHref(window.location.href);
  }, [siteUrl]);

  /* Outside click only — React's stopPropagation does not block native document listeners,
     so a bare document click handler was closing the menu in the same tick as opening it. */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const url = siteUrl ?? href;

  return (
    <div className="share-wrapper" ref={wrapperRef}>
      <div
        className={`share-options${menuOpen ? " active" : ""}`}
        id="shareMenu"
      >
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Check this out: ${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-item"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg"
            alt=""
          />
          <span>WhatsApp</span>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="share-item"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
            alt=""
          />
          <span>Instagram</span>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-item"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
            alt=""
          />
          <span>Facebook</span>
        </a>
      </div>
      <div
        className="share-main"
        id="shareBtn"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span className="material-symbols-outlined text-5xl">share</span>
      </div>
    </div>
  );
}
