// backgroundImage.ts
import { gsap } from "gsap";

export class ImageSlider {
  private container: HTMLElement;
  private imageUrls: string[];
  private slides: HTMLDivElement[] = [];
  private autoplayInterval: number | null = null;
  private currentIndex: number = 0;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private autoplayDelay: number;

  constructor(imageUrls: string[], autoplayDelay = 4000) {
    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("ImageSlider requires at least one image URL.");
    }
    const el = document.getElementById("background-image");
    if (!el) throw new Error("Element with id 'background-image' not found.");
    this.container = el;
    this.imageUrls = imageUrls;
    this.autoplayDelay = autoplayDelay;
    this.setupSlider();
  }

  private async setupSlider(): Promise<void> {
    // container baseline styles
    Object.assign(this.container.style, {
      position: "relative",
      overflow: "hidden",
      width: "100vw",
      height: "100vh",
      inset: "0",
      backdropFilter: "blur(10px)"
    } as Partial<CSSStyleDeclaration>);

    // preload images first to avoid flashes
    await this.preloadImages();

    // create slide elements
    this.createSlides();

    // initial visible slide
    this.showInitialSlide();

    // autoplay
    this.startAutoplay();

    // touch events (passive where safe)
    this.container.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: true });
    this.container.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  private async preloadImages(): Promise<void> {
    const load = (url: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // resolve on error so we don't block
        img.src = url;
      });
    await Promise.all(this.imageUrls.map(load));
  }

  private createSlides(): void {
    this.imageUrls.forEach((url, i) => {
      const slide = document.createElement("div");
      slide.className = "gsap-slide";
      // use cssText to reduce TS style typing friction
      slide.style.cssText = `
        position:absolute;
        top:0;left:0;right:0;bottom:0;
        background-image:url("${url}");
        background-size:cover;
        background-position:center;
        opacity:${i === 0 ? 1 : 0};
        transform:scale(1);
        z-index:${i === 0 ? 2 : 1};
        will-change: opacity, transform;
      `;
      this.container.appendChild(slide);
      this.slides.push(slide);
    });
  }

  private showInitialSlide(): void {
    this.currentIndex = 0;
    this.slides.forEach((s, i) => {
      s.style.opacity = i === 0 ? "1" : "0";
      s.style.zIndex = i === 0 ? "2" : "1";
      s.style.transform = "scale(1)";
      s.style.left = "0";
      s.style.top = "0";
    });
  }

  private normalizeIndex(index: number): number {
    const n = this.slides.length;
    return ((index % n) + n) % n; // handles negative indices
  }

  private changeImage(index: number): void {
    const toIndex = this.normalizeIndex(index);
    if (toIndex === this.currentIndex) return; // nothing to do

    const fromIndex = this.currentIndex;
    this.currentIndex = toIndex;

    const prevSlide = this.slides[fromIndex];
    const nextSlide = this.slides[toIndex];

    // prevent overlapping tweens
    gsap.killTweensOf([prevSlide, nextSlide]);

    // stack next above prev for smooth overlap
    nextSlide.style.zIndex = "3";
    prevSlide.style.zIndex = "2";

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power2.inOut" },
      onComplete: () => {
        // cleanup: make sure the prev is hidden and behind
        prevSlide.style.opacity = "0";
        prevSlide.style.zIndex = "1";
        nextSlide.style.zIndex = "2";
        // clear transform property that GSAP might have left
        gsap.set(prevSlide, { clearProps: "transform" });
      },
    });

    // crossfade + subtle scale
    tl.fromTo(nextSlide, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1 }, 0)
      .to(prevSlide, { opacity: 0, scale: 0.97 }, 0);
  }

  public nextImage(): void {
    this.changeImage(this.currentIndex + 1);
  }

  public prevImage(): void {
    this.changeImage(this.currentIndex - 1);
  }

  private startAutoplay(): void {
    if (this.autoplayInterval !== null) return;
    this.autoplayInterval = window.setInterval(() => {
      this.nextImage();
    }, this.autoplayDelay);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval !== null) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  // ------- touch handling -------
  private handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
    this.touchEndX = this.touchStartX;
    this.stopAutoplay();
  }

  private handleTouchMove(e: TouchEvent): void {
    this.touchEndX = e.touches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    const currentSlide = this.slides[this.currentIndex];
    gsap.to(currentSlide, { x: -diff * 0.3, duration: 0.15, overwrite: true });
  }

  private handleTouchEnd(): void {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;
    const currentSlide = this.slides[this.currentIndex];

    // snap back
    gsap.to(currentSlide, { x: 0, duration: 0.45, ease: "power3.out" });

    if (Math.abs(diff) > threshold) {
      diff > 0 ? this.nextImage() : this.prevImage();
    }

    this.startAutoplay();
  }

  // optionally expose a destroy method
  public destroy(): void {
    this.stopAutoplay();
    this.slides.forEach((s) => s.remove());
    this.slides = [];
    this.container.removeEventListener("touchstart", this.handleTouchStart as any);
    this.container.removeEventListener("touchmove", this.handleTouchMove as any);
    this.container.removeEventListener("touchend", this.handleTouchEnd as any);
  }
}

// ----------------------
// Usage example
// ----------------------
const imageUrls = [
  "/monk.jpg",
  "/moon.webp",
  "/city.jpg",
  "/desert.jpg",
  "/art.jpg",
  "/people.webp",
  "/architecture.webp",
];

// instantiate
new ImageSlider(imageUrls, 4000);
