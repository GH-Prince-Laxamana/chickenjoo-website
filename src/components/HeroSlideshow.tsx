"use client";

/**
 * HeroSlideshow
 * Drop replacement hero images into: public/images/hero/
 * Each image listed in `images` will fade in/out in sequence.
 */

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroSlideshowProps {
  images: { src: string; alt: string }[];
  /** Duration each image is fully visible, in milliseconds */
  interval?: number;
  /** Cross-fade transition duration, in milliseconds */
  fadeDuration?: number;
}

export default function HeroSlideshow({
  images,
  interval = 4000,
  fadeDuration = 1000,
}: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        // Fade in
        setVisible(true);
      }, fadeDuration);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, fadeDuration]);

  if (!images.length) return null;

  return (
    <div className="hero-slideshow" aria-live="polite" aria-atomic="true">
      {images.map((img, i) => (
        <div
          key={img.src}
          className="hero-slideshow-slide"
          style={{
            opacity: i === current ? (visible ? 1 : 0) : 0,
            transition: `opacity ${fadeDuration}ms ease-in-out`,
          }}
          aria-hidden={i !== current}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 520px, 90vw"
            className="object-contain"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
