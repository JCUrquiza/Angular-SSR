import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pokemons-list-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './pokemons-list-skeleton.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonsListSkeletonComponent {

}
