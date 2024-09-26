import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent;
  let compiled: HTMLDivElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [ provideRouter([]) ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    compiled = fixture.nativeElement;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should render the navbar and router-outlet`, () => {
    // const navBarElement = fixture.nativeElement.querySelector('navbar');
    // const routerOutletElement = fixture.nativeElement.querySelector('router-outlet');
    // expect(navBarElement).not.toBeNull();
    // expect(routerOutletElement).not.toBeNull();
    expect(compiled.querySelector('navbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

});
