import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import PokemonPageComponent from './pokemon-page.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { Pokemon } from '../../pokemons/interfaces';
import { of } from 'rxjs';

describe('PokemonPageComponent', () => {

  let fixture: ComponentFixture<PokemonPageComponent>;
  let compiled: HTMLElement;
  let component: PokemonPageComponent;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;
  let pokemonsServiceSpy: jasmine.SpyObj<PokemonsService>;

  const mockPokemon = { id: 1, name: 'Bulbasaur' } as Pokemon;

  beforeEach(async () => {
    // Crear spy para title y meta service
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['updateTag']);
    pokemonsServiceSpy = jasmine.createSpyObj('PokemonsService', ['loadPokemon']);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: () => '1' // Simular el parámetro de ruta "id"
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PokemonPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        { provide: PokemonsService, useValue: pokemonsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonPageComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should update title and metatags after onInit', () => {
    pokemonsServiceSpy.loadPokemon.and.returnValue(of(mockPokemon));

    component.ngOnInit();

    expect(pokemonsServiceSpy.loadPokemon).toHaveBeenCalledWith('1');

    const pageTitle = `#${mockPokemon.id} - ${mockPokemon.name}`;
    const pageDescription = `Página del pokemón ${mockPokemon.name}`
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${ mockPokemon.id }.png`;

    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith(pageTitle);
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'description', content: pageDescription });
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'og:title', content: pageTitle });
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'og:description', content: pageDescription });
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'og:image', content: imageUrl });
  });

  // it('should return if "id" is empty', () => {
  //   const activatedRouteMockForIdNull = {
  //     snapshot: {
  //       paramMap: {
  //         get: () => '' // Simular el parámetro de ruta "id"
  //       }
  //     }
  //   };
  //   TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMockForIdNull  });
  //   fixture.detectChanges();

  //   component.ngOnInit();

  //   expect(pokemonsServiceSpy.loadPokemon).not.toHaveBeenCalled();
  // });

});

