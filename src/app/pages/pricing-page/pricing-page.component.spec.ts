import { ComponentFixture, TestBed } from '@angular/core/testing';
import PricingPageComponent from './pricing-page.component';
import { Meta, Title } from '@angular/platform-browser';

describe('PricingPageComponent', () => {

  let fixture: ComponentFixture<PricingPageComponent>;
  let compiled: HTMLElement;
  let component: PricingPageComponent;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;

  beforeEach(async () => {
    // Crear spy para Title y Meta
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['updateTag']);

    await TestBed.configureTestingModule({
      imports: [PricingPageComponent],
      providers: [
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PricingPageComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should set "title" and "meta" after ngOnInit', () => {
    component.ngOnInit();

    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Pricing Page');
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Este es pricing page' });
  });

});

