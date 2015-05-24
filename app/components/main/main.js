import {Component, Template, bootstrap, ChangeDetection, jitChangeDetection} from 'angular2/angular2';
import {DisplayComponent} from 'components/show-properties/show-properties';

@Component({
  selector: 'my-app'
})
@Template({
  url: System.baseURL+'components/main/main.html',
  directives: [DisplayComponent]
})
export class AppComponent {
  myName: string;
  
  constructor() {
    this.myName = "Alice";
  }
}
