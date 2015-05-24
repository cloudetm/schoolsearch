import {bootstrap, ChangeDetection, jitChangeDetection} from 'angular2/angular2';
import {bind} from 'angular2/di';
import {AppComponent} from 'components/main/main';
import {DisplayComponent} from 'components/show-properties/show-properties';

export function main() {
  bootstrap(AppComponent, [bind(ChangeDetection).toValue(jitChangeDetection)]);
}
