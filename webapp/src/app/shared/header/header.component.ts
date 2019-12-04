import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

interface Link {
  label: string;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  routes: Link[] = [
    { label: 'Blocks', url: '/' },
    { label: 'YAML', url: '/yaml' },
  ];
  url: string;

  constructor(
    public router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Scroll to top
        window.scrollTo(0, 0);

        // Convert '/my-page?param=data' -> '/my-page'
        const parser: HTMLAnchorElement = document.createElement('a');
        parser.href = event.url;
        this.url = parser.pathname;
      }
    });
  }
}
