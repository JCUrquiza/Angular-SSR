import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { PokemonListComponent } from "../../pokemons/components/pokemon-list/pokemon-list.component";
import { PokemonsListSkeletonComponent } from "./ui/pokemons-list-skeleton/pokemons-list-skeleton.component";
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { HttpClient } from '@angular/common/http';

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

  // public isLoading = signal(true);

  ngOnInit(): void {

    this.loadPokemons();

    // setTimeout(() => {
    //   this.isLoading.set(false);
    // }, 1000);
  }

  public loadPokemons(page = 0) {
    this.pokemonsService.loadPage(page).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
