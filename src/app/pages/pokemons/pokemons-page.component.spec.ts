import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import PokemonsPageComponent from './pokemons-page.component';
import { PokemonsService } from '../../pokemons/services/pokemons.service';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { SimplePokemon } from '../../pokemons/interfaces';

describe('PokemonsPageComponent', () => {

  let fixture: ComponentFixture<PokemonsPageComponent>;
  let compiled: HTMLElement;
  let component: PokemonsPageComponent;

  let pokemonsServiceSpy: jasmine.SpyObj<PokemonsService>;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let activatedRouteSubject: BehaviorSubject<any>;

  beforeEach(async () => {

    const pokemonsServiceMock = jasmine.createSpyObj('PokemonsService', ['loadPage']);
    const titleServiceMock = jasmine.createSpyObj('Title', ['setTitle']);

    activatedRouteSubject = new BehaviorSubject({ page: '1' });

    await TestBed.configureTestingModule({
      imports: [PokemonsPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PokemonsService, useValue: pokemonsServiceMock },
        { provide: Title, useValue: titleServiceMock },
        {
          provide: ActivatedRoute, useValue: { params: activatedRouteSubject.asObservable() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonsPageComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    pokemonsServiceSpy = TestBed.inject(PokemonsService) as jasmine.SpyObj<PokemonsService>;
    titleServiceSpy = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set title "Pokemons list: <numberOfPage>"', () => {
    const mockResponse: SimplePokemon[] = [
      { id: '1', name: 'bulbasaur' },
      { id: '2', name: 'ivysaur' }
    ];
    // Arrange: simulate loadPage response
    pokemonsServiceSpy.loadPage.and.returnValue(of(mockResponse)); // Simulate observable response

    component.loadPokemons(2);

    expect(pokemonsServiceSpy.loadPage).toHaveBeenCalledWith(2);
    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Pokemons list: 2');
  });

  it('should trigger loadPokemons function when currentPage changes', () => {
    // Arrange: mock the loadPage method
    const mockResponse: SimplePokemon[] = [
      { id: '1', name: 'bulbasaur' },
      { id: '2', name: 'ivysasaur' },
    ];
    pokemonsServiceSpy.loadPage.and.returnValue(of(mockResponse));
    // Act: change the route param and trigger the effect
    activatedRouteSubject.next({ page: '3' });
    // Necesario detectar los cambios para que el componente procese la nueva señal
    fixture.detectChanges();
    // Assert: verify loadPokemons is called with the correct page
    expect(pokemonsServiceSpy.loadPage).toHaveBeenCalledWith(3);
  });

});

