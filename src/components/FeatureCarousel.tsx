"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

export type FeatureSlide = {
  title: string;
  href: string;
  image: string;
  alt: string;
  square?: boolean;
};

export default function FeatureCarousel({ slides }: { slides: FeatureSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const initialSlide = Math.min(1, slides.length - 1);
  const [active, setActive] = useState(initialSlide);

  useLayoutEffect(() => {
    const container = track.current;
    const slide = container?.children[initialSlide] as HTMLElement | undefined;
    if (container && slide) container.scrollLeft = slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;
  }, [initialSlide]);

  function showSlide(index: number) {
    const container = track.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    container.scrollTo({
      left: slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return (
    <section className="feature-carousel" aria-label="Chicken Joo highlights" aria-roledescription="carousel">
      <div
        ref={track}
        className="feature-track"
        tabIndex={0}
        aria-label="Swipe to explore highlights, or use the arrow keys"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(Math.max(0, Math.min(slides.length - 1, active + (event.key === "ArrowRight" ? 1 : -1))));
          }
        }}
        onScroll={(event) => {
          const container = event.currentTarget;
          const center = container.scrollLeft + container.clientWidth / 2;
          let nearest = 0;
          let distance = Infinity;
          Array.from(container.children).forEach((child, index) => {
            const slide = child as HTMLElement;
            const delta = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
            if (delta < distance) { nearest = index; distance = delta; }
          });
          setActive(nearest);
        }}
      >
        {slides.map((slide, index) => (
          <article key={slide.image} className="feature-slide" data-position={index === active ? "active" : index < active ? "before" : "after"} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            <Link href={slide.href} className="feature-poster" style={slide.square ? { aspectRatio: "1" } : undefined} aria-label={slide.title}>
              <Image src={slide.image} alt={slide.alt} fill sizes="(max-width: 540px) 74vw, 400px" className="object-contain" preload={index === initialSlide} draggable={false} />
            </Link>
          </article>
        ))}
      </div>
      <div className="feature-controls">
        <button type="button" onClick={() => showSlide(active - 1)} disabled={active === 0} aria-label="Previous highlight" className="feature-arrow"><ChevronLeft aria-hidden="true" size={20} /></button>
        <div className="flex gap-2">
          {slides.map((slide, index) => <button key={slide.image} type="button" onClick={() => showSlide(index)} aria-label={`Show highlight ${index + 1}: ${slide.title}`} aria-current={active === index ? "true" : undefined} className="feature-dot"><span /></button>)}
        </div>
        <button type="button" onClick={() => showSlide(active + 1)} disabled={active === slides.length - 1} aria-label="Next highlight" className="feature-arrow"><ChevronRight aria-hidden="true" size={20} /></button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Highlight {active + 1} of {slides.length}</p>
    </section>
  );
}
