let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

class ImageSlider {
	private backgroundElement: HTMLElement;
	private imageUrls: string[];
	private autoplayInterval: number | null = null;
	public isLoading: boolean = true;

	constructor(imageUrls: string[]) {
		this.imageUrls = imageUrls;
		this.backgroundElement = document.getElementById('background-image') as HTMLElement;
		this.setupSlider();
	}

	private setupSlider(): void {
		this.backgroundElement.style.backgroundSize = 'cover';
		this.backgroundElement.style.backgroundPosition = 'center';
		this.backgroundElement.style.filter = 'opacity(0.5) sepia(0.5)';

		this.backgroundElement.style.transition = 'background-image 1s ease-in-out';

		this.backgroundElement.addEventListener('load', () => {
			this.isLoading = false;
		});

		this.backgroundElement.addEventListener('error', () => {
			console.error(`Failed to load image: ${this.imageUrls[currentIndex]}`);
			this.isLoading = false;
			this.nextImage();
		});


		this.preloadImages().then(() => {
			this.changeImage(0);
			this.startAutoplay();
		});

		this.backgroundElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
		this.backgroundElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
		this.backgroundElement.addEventListener('touchmove', this.handleTouchMove.bind(this));

	}

	private async preloadImages(): Promise<void> {
		const loadImage = (url: string): Promise<void> => {
			return new Promise((resolve) => {
				const img = new Image();
				img.onload = () => resolve();
				img.onerror = () => resolve();
				img.src = url;
			});
		};

		await Promise.all(this.imageUrls.map(loadImage));
	}

	private changeImage(newIndex: number): void {
		currentIndex = newIndex;
		this.isLoading = true;
		this.backgroundElement.style.backgroundImage = `url(${this.imageUrls[currentIndex]})`;
	}

	private startAutoplay(): void {
		this.autoplayInterval = window.setInterval(() => {
			this.nextImage();
		}, 3000);
	}

	private stopAutoplay(): void {
		if (this.autoplayInterval) clearInterval(this.autoplayInterval);
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
		this.backgroundElement.style.transform = `translateX(${-diffX * 0.3}px)`;
	}

	private handleTouchEnd(): void {
		const diffX = touchStartX - touchEndX;
		const threshold = 50;

		this.backgroundElement.style.transform = 'translateX(0)';

		if (Math.abs(diffX) > threshold) diffX > 0 ? this.nextImage() : this.prevImage();

		this.startAutoplay();
	}
}

const imageUrls: string[] = [
	'/monk.jpg',
	'/moon.webp',
	'/city.jpg',
	'/desert.jpg',
	'/art.jpg',
	'/people.webp',
	'/architecture.webp',
];

new ImageSlider(imageUrls);
