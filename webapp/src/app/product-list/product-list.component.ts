import { Component } from '@angular/core';

import { products } from '../products';
import { Greeter } from '../Greeter';
import { Person } from '../Person';
import { Chatbot } from '../Chatbot';
import { BlockingProxy } from 'blocking-proxy';
import { Button } from 'protractor';
import { triggerAsyncId } from 'async_hooks';
import { read } from 'fs';

export interface BaseBlockData {
  id: string;
}

// text-block
export interface TextData extends BaseBlockData {
  text: string;
}

// date-block
export interface DateData extends BaseBlockData {
  date: Date;
}

interface DataList {
  [id: string]: TextData;
}

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
  initialDataList: TextData[] = this.getDataList();
  dataList: DataList;
  
  share() {
    window.alert('The product has been shared!');
  }

  getDataList(): TextData[] {
    const map1: TextData = {
      // TODO: add autogeneration
      id: '1',
      text: 'Blah1',
    };
    const map2: TextData = {
      id: '2',
      text: 'Second Text Block',
    };

    this.dataList = {};
    this.dataList[map1.id] = map1;
    this.dataList[map2.id] = map2;
    return Object.values(this.dataList);
  }

  getData(data): void {
    this.dataList[data.id] = data;
  }
}
