import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsListSkeletonComponent } from "./ui/pokemons-list-skeleton/pokemons-list-skeleton.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { SimplePokemon } from '../../pokemons/interfaces';
import { map } from 'rxjs';

@Component({
  selector: 'pokemons-page',
  standalone: true,
  imports: [
    PokemonListComponent,
    PokemonsListSkeletonComponent,
  ],
  providers: [
    HttpClient
  ],
  templateUrl: './pokemons-page.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PokemonsPageComponent implements OnInit {

  private pokemonsService = inject(PokemonsService);
  public pokemons = signal<SimplePokemon[]>([]);

  // public isLoading = signal(true);

  private route = inject(ActivatedRoute);

  public currentPage = toSignal<number>(
    this.route.queryParamMap.pipe(
      map( params => params.get('page') ?? '1' ),
      map( page => ( isNaN(+page) ? 1 : +page ) ),
      map( page => Math.max(1, page) )
    )
  );

  ngOnInit(): void {

    this.loadPokemons();

    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 1000);
  }

  public loadPokemons(page = 0) {
    const pageToLoad = this.currentPage()! + page;

    this.pokemonsService.loadPage(pageToLoad).subscribe({
      next: (resp) => {
        this.pokemons.set(resp);
      }
    });
  }

}
