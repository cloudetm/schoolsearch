/// <reference path = "../../../typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap} from 'angular2/angular2';
import {DisplayComponent} from 'app/components/show-properties/show-properties';
 
@Component({
  selector: 'my-app'
})
@View({
  template: `
    <p>my name: {{ myName }}</p>
    <display></display>
  `,
  directives: [DisplayComponent]
})
export class MyAppComponent {
  myName: string;
  
  constructor() {
    this.myName = "Alice";
  }
}

bootstrap(MyAppComponent);