let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

class ImageSlider {
  private imgElement: HTMLImageElement;
  private imageUrls: string[];
  private altTexts: string[];
  private autoplayInterval: number | null = null;
  public isLoading: boolean = true;

  constructor(imageUrls: string[], altTexts: string[]) {
    this.imageUrls = imageUrls;
    this.altTexts = altTexts;
    this.imgElement = document.getElementById("background-image") as HTMLImageElement;
    this.imgElement.style.opacity = "0";
    this.setupSlider();
  }

  private setupSlider(): void {
    this.imgElement.style.transition = "opacity 1s ease-in-out, transform 0.3s ease-in-out";
    this.imgElement.style.display = "inherit";

    // Add loading state
    this.imgElement.addEventListener("load", () => {
      this.isLoading = false;
      this.imgElement.style.opacity = "0.5";
    });

    this.imgElement.addEventListener("error", () => {
      console.error(`Failed to load image: ${this.imageUrls[currentIndex]}`);
      this.isLoading = false;
      this.nextImage(); // Try loading the next image on error
    });

    // Preload all images before starting the slider
    this.preloadImages().then(() => {
      // Initialize with first image only after preloading
      this.changeImage(0);
      this.startAutoplay();
    });

    // Add touch event listeners
    this.imgElement.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.imgElement.addEventListener("touchend", this.handleTouchEnd.bind(this));
    this.imgElement.addEventListener("touchmove", this.handleTouchMove.bind(this));

    // Add keyboard navigation
    document.addEventListener("keydown", this.handleKeyNavigation.bind(this));

    // Add resize listener for responsive behavior
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  private async preloadImages(): Promise<void> {
    const loadImage = (url: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if an image fails to load
        img.src = url;
      });
    };

    await Promise.all(this.imageUrls.map(loadImage));
  }

  private changeImage(newIndex: number): void {
    currentIndex = newIndex;
    this.isLoading = true;
    this.imgElement.style.opacity = "0";

    // Set new image source immediately
    this.imgElement.src = this.imageUrls[currentIndex];
    this.imgElement.alt = this.altTexts[currentIndex];
  }

  private startAutoplay(): void {
    this.autoplayInterval = window.setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private nextImage(): void {
    const newIndex = (currentIndex + 1) % this.imageUrls.length;
    this.changeImage(newIndex);
  }

  private prevImage(): void {
    const newIndex = (currentIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
    this.changeImage(newIndex);
  }

  private handleTouchStart(e: TouchEvent): void {
    touchStartX = e.touches[0].clientX;
    this.stopAutoplay();
  }

  private handleTouchMove(e: TouchEvent): void {
    touchEndX = e.touches[0].clientX;
    const diffX = touchStartX - touchEndX;
    
    // Add a subtle transform effect while dragging
    this.imgElement.style.transform = `translateX(${-diffX * 0.3}px)`;
  }

  private handleTouchEnd(): void {
    const diffX = touchStartX - touchEndX;
    const threshold = 50; // minimum distance for swipe

    this.imgElement.style.transform = "translateX(0)";

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.nextImage();
      } else {
        this.prevImage();
      }
    }

    this.startAutoplay();
  }

  private handleKeyNavigation(e: KeyboardEvent): void {
    if (e.key === "ArrowLeft") {
      this.prevImage();
    } else if (e.key === "ArrowRight") {
      this.nextImage();
    }
  }

  private handleResize(): void {
    this.imgElement.style.objectFit = 'cover';
    this.imgElement.style.objectPosition = 'center';
  }
}

// Array of image URLs
const imageUrls: string[] = [
  "/monk.jpg",
  "/moon.jpg",
  "/city.jpg",
  "/desert.jpg",
  "/art.jpg",
  "/people.jpg",
  "/architecture.jpg",
];

const altTexts: string[] = [
  "Monk - Photo by Robin Benad on Unsplash",
  "Moon - Photo by Mike Petrucci on Unsplash",
  "City - Photo by Anthony DELANOIX on Unsplash",
  "Desert - Photo by Wolfgang Hasselmann on Unsplash",
  "Art - Photo by Alp Ancel on Unsplash",
  "People - Photo by Ryoji Iwata on Unsplash",
  "Architecture - Photo by Denis Tuksar on Unsplash",
];

// Initialize the slider
new ImageSlider(imageUrls, altTexts);
