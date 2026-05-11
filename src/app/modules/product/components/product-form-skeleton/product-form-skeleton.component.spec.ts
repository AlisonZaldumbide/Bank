import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormSkeletonComponent } from './product-form-skeleton.component';

describe('ProductFormSkeletonComponent', () => {
    let component: ProductFormSkeletonComponent;
    let fixture: ComponentFixture<ProductFormSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductFormSkeletonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductFormSkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
