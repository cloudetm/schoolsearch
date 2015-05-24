import {Component, View, bootstrap, For, If} from 'angular2/angular2';

@Component({
  selector: 'show-properties',
  injectables: [FriendsService]
})
@View({
  templateUrl: 'public/components/show-properties/show-properties.html',
  directives: [For, If]
})

export class ShowProperties {
  myName: string;
  names: Array<string>;
  
  constructor(friendsService: FriendsService) {
    this.myName = "Alice";
    this.names = friendsService.names;
  }
}
 
class FriendsService {
  names: Array<string>;
  constructor() {
    this.names = ["Alice", "Aarav", "Martín", "Shannon", "Ariana", "Kai"];
  }
}
