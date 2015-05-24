import {Component, Template, View, For, If} from 'angular2/angular2';

@Component({
  selector: 'display'
  //injectables: [FriendsService]
})
@Template({
  template: `<p>My name: {{ myName }}</p>
                <p>Friends:</p>
                <ul>
                  <li *for="#name of names">
                    {{ name }}
                  </li>
                </ul>
                <p *if="names.length > 3">You have many friends!</p>`,
  directives: [For, If]
})

export class DisplayComponent {
  myName: string;
  names: Array<string>;
  
  constructor(/* friendsService: FriendsService */) {
    this.myName = "Alice";
    //this.names = friendsService.names;
    this.names = ["Alice", "Aarav", "Martín", "Shannon", "Ariana", "Kai"];
  }
}

/* 
class FriendsService {
  names: Array<string>;
  constructor() {
    this.names = ["Alice", "Aarav", "Martín", "Shannon", "Ariana", "Kai"];
  }
}
*/
