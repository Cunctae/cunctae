class MenuButton extends HTMLElement {
	constructor() {
		super();

		// Inject menu toggle button when JS runs.
		this.appendChild(this.querySelector('template')!.content.cloneNode(true));
		const btn = this.querySelector('button')!;

		// Hide menu (shown by default to support no-JS browsers).
		const menu = document.getElementById('menu-content')!;
		menu.hidden = true;
		// Add "menu-content" class in JS to avoid covering content in non-JS browsers.
		menu.classList.add('menu-content');

		/** Set whether the menu is currently expanded or collapsed. */
		const setExpanded = (expand: boolean) => {
			btn.setAttribute('aria-expanded', expand ? 'true' : 'false');
			menu.hidden = !expand;
		};

		// Toggle menu visibility when the menu button is clicked.
		btn.addEventListener('click', () => setExpanded(menu.hidden));

		// Hide menu button for large screens.
		const handleViewports = (e: MediaQueryList | MediaQueryListEvent) => {
			setExpanded(e.matches);
			btn.hidden = e.matches;
		};
		const mediaQueries = window.matchMedia('(min-width: 50em)');
		handleViewports(mediaQueries);
		mediaQueries.addEventListener('change', handleViewports);
	}
}
customElements.define('menu-button', MenuButton);
