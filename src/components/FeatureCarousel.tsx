"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export type FeatureSlide = {
  title: string;
  href: string;
  image: string;
  alt: string;
};

export default function FeatureCarousel({ slides }: { slides: FeatureSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, scrollLeft: 0, moved: false, active: false });
  const suppressClick = useRef(false);
  const interacting = useRef(false);
  const autoplayStopped = useRef(false);
  const touching = useRef(false);
  const current = useRef(slides.length > 1 ? slides.length : 0);
  const settleTimer = useRef<number | undefined>(undefined);
  const loopedSlides = slides.length > 1 ? [...slides, ...slides, ...slides] : slides;

  const showSlide = useCallback((index: number) => {
    const container = track.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    container.scrollTo({
      left: slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);

  useLayoutEffect(() => {
    const container = track.current;
    const first = container?.children[slides.length > 1 ? slides.length : 0] as HTMLElement | undefined;
    if (container && first) container.scrollLeft = first.offsetLeft - (container.clientWidth - first.clientWidth) / 2;
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !interacting.current && !autoplayStopped.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showSlide(current.current + 1);
      }
    }, 2000);
    return () => { window.clearInterval(timer); window.clearTimeout(settleTimer.current); };
  }, [showSlide, slides.length]);

  function endDrag(container: HTMLDivElement) {
    if (drag.current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 100);
    }
    drag.current.active = false;
    drag.current.moved = false;
    delete container.dataset.dragging;
    updatePosition(container);
  }

  function updatePosition(container: HTMLDivElement) {
    const center = container.scrollLeft + container.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    Array.from(container.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const delta = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
      if (delta < distance) { nearest = index; distance = delta; }
    });
    current.current = nearest;

    if (slides.length < 2 || drag.current.active || touching.current) return;
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const cycle = (container.children[slides.length] as HTMLElement).offsetLeft - (container.children[0] as HTMLElement).offsetLeft;
      if (container.scrollLeft < cycle) container.scrollLeft += cycle;
      else if (container.scrollLeft >= cycle * 2) container.scrollLeft -= cycle;
    }, 140);
  }

  return (
    <section className="feature-carousel" aria-label="Chicken Joo highlights" aria-roledescription="carousel" onMouseEnter={() => { interacting.current = true; }} onMouseLeave={() => { interacting.current = false; }} onFocusCapture={() => { interacting.current = true; }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}>
      <div
        ref={track}
        className="feature-track"
        tabIndex={0}
        aria-label="Swipe or drag to explore highlights, or use the arrow keys"
        onDragStart={(event) => event.preventDefault()}
        onTouchStart={() => { window.clearTimeout(settleTimer.current); touching.current = true; autoplayStopped.current = true; }}
        onTouchEnd={(event) => { touching.current = false; updatePosition(event.currentTarget); }}
        onTouchCancel={(event) => { touching.current = false; updatePosition(event.currentTarget); }}
        onMouseDown={(event) => {
          if (event.button !== 0) return;
          window.clearTimeout(settleTimer.current);
          drag.current = { startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false, active: true };
        }}
        onMouseMove={(event) => {
          if (!drag.current.active || event.buttons !== 1) return;
          const distance = event.clientX - drag.current.startX;
          if (Math.abs(distance) > 5) {
            drag.current.moved = true;
            autoplayStopped.current = true;
            event.currentTarget.dataset.dragging = "true";
          }
          if (drag.current.moved) event.currentTarget.scrollLeft = drag.current.scrollLeft - distance;
        }}
        onMouseUp={(event) => { if (drag.current.active) endDrag(event.currentTarget); }}
        onMouseLeave={(event) => { if (drag.current.active) endDrag(event.currentTarget); }}
        onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            autoplayStopped.current = true;
            showSlide(Math.max(0, Math.min(loopedSlides.length - 1, current.current + (event.key === "ArrowRight" ? 1 : -1))));
          }
        }}
        onScroll={(event) => updatePosition(event.currentTarget)}
      >
        {loopedSlides.map((slide, index) => {
          const original = slides.length < 2 || (index >= slides.length && index < slides.length * 2);
          return <article key={`${index}-${slide.image}`} className="feature-slide" role="group" aria-roledescription="slide" aria-label={`${index % slides.length + 1} of ${slides.length}`} aria-hidden={!original}>
            <Link href={slide.href} className="feature-poster" aria-label={slide.title} tabIndex={original ? undefined : -1}>
              <Image src={slide.image} alt={slide.alt} fill sizes="(min-width: 1024px) 540px, 78vw" className="object-cover object-top" draggable={false} />
            </Link>
          </article>;
        })}
      </div>
    </section>
  );
}
