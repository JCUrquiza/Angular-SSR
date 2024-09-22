import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsListSkeletonComponent } from "./ui/pokemons-list-skeleton/pokemons-list-skeleton.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { map, tap } from 'rxjs';

@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonsListSkeletonComponent,
    RouterLink
  ],
  providers: [
    HttpClient
  ],
  templateUrl: './pokemons-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent {

  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  private route = inject(ActivatedRoute);
  private titile = inject(Title);

  public currentPage = toSignal<number>(
    this.route.params.pipe(
      map( params => params['page'] ?? '1' ),
      map( page => ( isNaN(+page) ? 1 : +page ) ),
      map( page => Math.max(1, page) )
    )
  );

  public loadOnPageChanged = effect(() => {
    this.loadPokemons(this.currentPage())
  }, { allowSignalWrites: true });

  public loadPokemons(page = 0) {
    this.pokemonsService.loadPage(page)
      .pipe(
        tap(() => {
          this.titile.setTitle(`Pokemons list: ${page}`);
        })
      )
      .subscribe({
        next: (resp) => {
          this.pokemons.set(resp);
        }
      });
  }

}
