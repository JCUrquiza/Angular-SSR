import { TestBed } from '@angular/core/testing';
import { PokemonsService } from './pokemons.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokeAPIResponse, SimplePokemon } from '../interfaces';
import { catchError, throwError } from 'rxjs';

const mockPokeApiResponse: PokeAPIResponse = {
  count: 1302,
  next: `https://pokeapi.co/api/v2/pokemon?offset=20&limit=20`,
  previous: '',
  results: [
    {
      name: 'bulbasaur',
      url: `https://pokeapi.co/api/v2/pokemon/1/`,
    },
    {
      name: 'ivysaur',
      url: `https://pokeapi.co/api/v2/pokemon/2/`,
    },
  ],
};

const expectedPokemons: SimplePokemon[] = [
  { id: '1', name: 'bulbasaur' },
  { id: '2', name: 'ivysaur' },
];

const mockPokemon = {
  id: 1,
  name: 'bulbasaur'
}

describe(`PokemonsService`, () => {

  let service: PokemonsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(PokemonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load a page of SimplePokemons', () => {
    service.loadPage(1).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokeApiResponse);
  });

  it('should load a page 5 of SimplePokemons', () => {
    service.loadPage(5).subscribe((pokemons) => {
      expect(pokemons).toEqual(expectedPokemons);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon?offset=80&limit=20`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokeApiResponse);
  });

  it('should load a Pokemon by ID', () => {
    const pokemonId = '1';

    service.loadPokemon(pokemonId).subscribe((pokemon: any) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${ pokemonId }`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokemon);
  });

  it('should load a Pokemon by name', () => {
    const pokemonName = 'bulbasaur';

    service.loadPokemon(pokemonName).subscribe((pokemon: any) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${ pokemonName }`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockPokemon);
  });

  // Disparar errores
  it('should catch error if pokemon not found', () => {
    const pokemonName = 'pokemonNoExistemon';

    service.loadPokemon(pokemonName)
      .pipe(
        catchError((err) => {
          expect(err.message).toContain('Pokemón not found');
          return [];
        })
      ).subscribe();

    const req = httpMock.expectOne(
      `https://pokeapi.co/api/v2/pokemon/${ pokemonName }`
    );

    expect(req.request.method).toBe('GET');

    req.flush('Pokemón not found', {
      status: 404,
      statusText: 'Not Found'
    });

  });

  it('should find out console.log if error.status === "0" on handleError', () => {
    // Espiar el console.log
    const consoleLogSpy = spyOn(console, 'log');
    // Simular el compartamiento de http.get para lanzar un error
    const errorResponse = new HttpErrorResponse({
      error: 'Network error',
      status: 0
    });

    spyOn(service['http'], 'get').and.returnValue(throwError(() => errorResponse));

    const pokemonName = 'pokemonNoExistemon';
    service.loadPokemon(pokemonName).subscribe({
      next: () => fail('should have filed with a network error'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(consoleLogSpy).toHaveBeenCalledWith('An error occurred: ', errorResponse.error);
      }
    });

  });

});

