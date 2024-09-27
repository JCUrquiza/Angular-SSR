import { ComponentFixture, TestBed } from '@angular/core/testing';
import ContactPageComponent from './contact-page.component';
import { Meta, Title } from '@angular/platform-browser';

describe('ContactPageComponent', () => {

  let fixture: ComponentFixture<ContactPageComponent>;
  let compiled: HTMLElement;
  let component: ContactPageComponent;
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;

  beforeEach(async () => {
    // Crear spy para title y meta service
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['updateTag']);

    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should update title and metatags after onInit', () => {
    component.ngOnInit();

    expect(titleServiceSpy.setTitle).toHaveBeenCalledWith('Contant Page');
    expect(metaServiceSpy.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Esta es la pagina de contacto' });
  });

});

