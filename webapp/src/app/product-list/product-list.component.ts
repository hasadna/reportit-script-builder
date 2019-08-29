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

  getDataList() {
    const map1 = new Map();
    map1.set('text', "Bla1");
    const map2 = new Map();
    map2.set('text', "Bla2");
    
    let dataList: Array<Map<string, string>> = [];
    dataList.push(map1);
    dataList.push(map2);
    return dataList;
  }

  getData(event) {
    console.log("Bla");
    console.log(event);

  
    // TODO: Iterate over all blocks and save them to a list
    // Question: How to access blocks
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/