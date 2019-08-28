import { Component } from '@angular/core';

import { products } from '../products';
import { Greeter } from '../Greeter';
import { Person } from '../Person';
import { Chatbot } from '../Chatbot';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products = products;
  greeter = new Greeter("world");
  person = new Person();
  chatbot = new Chatbot(this.person);
  messages = this.chatbot.run();

  share() {
    window.alert('The product has been shared!');
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/