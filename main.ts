/// <reference path = "typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap} from 'angular2/angular2';
import {ShowProperties} from 'public/components/show-properties/show-properties';

@Component({
  selector: 'my-app',
})
@View({
  template: '<show-properties></show-properties>',
  directives: [ShowProperties]
})
class AppComponent {

}
 
bootstrap(AppComponent);