import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent;
  let compiled: HTMLDivElement;

  @Component({
    selector: 'navbar',
    standalone: true,
  })
  class NavbarComponentMock {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [ provideRouter([]) ]
    })
    .overrideComponent(AppComponent, {
      add: {
        imports: [NavbarComponentMock]
      },
      remove: {
        imports: [NavbarComponent]
      }
    })
    .compileComponents();

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

    console.log(compiled);
  });

});
