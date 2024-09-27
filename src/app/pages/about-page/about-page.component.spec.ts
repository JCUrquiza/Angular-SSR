import { ComponentFixture, TestBed } from '@angular/core/testing';
import AboutPageComponent from './about-page.component';
import { Meta, Title } from '@angular/platform-browser';

describe('AboutPageComponent', () => {

  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;
  let compiled: HTMLElement;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;

  beforeEach(async () => {
    // Crear spys para Title y Meta
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['updateTag']);

    await TestBed.configureTestingModule({
      imports: [AboutPageComponent],
      providers: [
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;

    // fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should update title signal and update meta tags on init', () => {
    component.ngOnInit();

    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('About Page');
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Este es mi About Page' });
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'og:title', content: 'About Page' });
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({
      name: 'keywords',
      content: 'Juan,Carlos,JC'
    });
  });

});

