import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';

import {
  AuthService,
  FirebaseService,
  YamlService,
  NotificationService,
  LoadingService,
  BlockService,
} from '@/core/services';
import { Block } from '@/core/types';

interface Link {
  label: string;
  url: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnDestroy {
  routes: Link[] = [
    { label: 'תסריטים', url: '/' },
    { label: 'YAML', url: '/yaml' },
  ];
  url: string;
  radio = new FormControl('user');
  scriptSub = new Subscription();

  constructor(
    public router: Router,
    public authService: AuthService,
    public firebaseService: FirebaseService,
    public yamlService: YamlService,
    public notificationService: NotificationService,
    public loadingService: LoadingService,
    private blockService: BlockService,
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
    this.radio.valueChanges.subscribe(option => {
      this.blockService.isUserScript = option === 'user';
      this.blockService.update();
      this.getScript();
    });
    this.authService.onlineChanges.subscribe(isOnline => this.getScript());
  }

  getScript(): void {
    if (this.authService.isOnline) {
      this.loadingService.isLoading = true;
      this.scriptSub = this.firebaseService.getScript(this.radio.value).subscribe(script => {
        this.scriptSub.unsubscribe();
        this.yamlService.yaml = script;
        this.blockService.blockList = this.yamlService.fromYAML();
        this.loadingService.isLoading = false;
      });
    }
  }

  save(): void {
    let isValid: boolean = false;
    if (this.url === '/') {
      // Blocks page. Converts blocks to YAML before saving
      this.yamlService.toYAML();
      // Blocks always produce valid YAML
      isValid = true;
    } else {
      // Not blocks page. Check that current YAML is valid
      const blockList: Block[] = this.yamlService.fromYAML();
      if (blockList) {
        // Rebuild blocks from YAML
        this.blockService.blockList = blockList;
        isValid = true;
      }
    }
    if (isValid) {
      // Save YAML if it's valid
      this.firebaseService.setScript(this.radio.value, this.yamlService.yaml).subscribe(() => {
        this.loadingService.isLoading = false;
        this.notificationService.success('Saved');
      });
    }
  }

  logOut(): void {
    this.authService.logOut().subscribe();
  }

  ngOnDestroy() {
    this.scriptSub.unsubscribe();
  }
}
