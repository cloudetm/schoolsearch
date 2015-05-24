
import {Component, View, For, If} from 'angular2/angular2';

@Component({
  selector: 'display',
  //injectable: [FriendsService]
})
@View({
  templateUrl: 'app/components/show-properties/show-properties.html',
  directives: [For, If]
})

export class DisplayComponent {
  myName: string;
  names: Array<string>;
  
  constructor(/*friends: FriendsService*/) {
    this.myName = "Alice";
    var friends = new FriendsService();
    this.names = friends.names;
  }
}

class FriendsService {
  names: Array<string>;
  constructor() {
    this.names = ["Alice", "Aarav", "Martín", "Shannon", "Ariana", "Kai"];
  }
}
