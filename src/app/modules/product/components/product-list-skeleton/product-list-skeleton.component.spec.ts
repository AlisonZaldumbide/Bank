import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListSkeletonComponent } from './product-list-skeleton.component';

describe('ProductListSkeletonComponent', () => {
    let component: ProductListSkeletonComponent;
    let fixture: ComponentFixture<ProductListSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductListSkeletonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ProductListSkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
