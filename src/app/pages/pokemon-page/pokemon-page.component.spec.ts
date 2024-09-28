import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const mockPokemon = { id: 1, name: 'Bulbasaur' } as Pokemon;

  // Crear un mock de ParamMap
  const createParamMapMock = (params: { [key: string]: string }): ParamMap => {
    return {
      has: (key: string) => key in params,
      get: (key: string) => params[key] || null,
      getAll: (key: string) => [params[key]],
      keys: Object.keys(params),
    } as ParamMap;
  };

  beforeEach(async () => {
    // Crear spy para title y meta service
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['updateTag']);
    pokemonsServiceSpy = jasmine.createSpyObj('PokemonsService', ['loadPokemon']);

    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    activatedRouteSpy.snapshot = {
      paramMap: createParamMapMock({ id: '1' })
    } as any;

    await TestBed.configureTestingModule({
      imports: [PokemonPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        { provide: PokemonsService, useValue: pokemonsServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
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

  it('should return if "id" is empty', () => {
    activatedRouteSpy.snapshot = {
      paramMap: createParamMapMock({ id: '' })
    } as any;

    fixture.detectChanges();

    component.ngOnInit();

    expect(pokemonsServiceSpy.loadPokemon).not.toHaveBeenCalled();
  });

});

