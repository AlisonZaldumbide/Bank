import { ProductFacadeService } from './product-facade.service';
import { ProductService } from './product.service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { skip, take } from 'rxjs/operators';

describe('ProductFacadeService', () => {
  let service: ProductFacadeService;
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    mockProductService = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn(),
      createProduct: jest.fn(),
      readProduct: jest.fn(),
      updateProduct: jest.fn(),
      getIdExists: jest.fn()
    } as unknown as jest.Mocked<ProductService>;

    service = new ProductFacadeService(mockProductService);
  });

  it('should load products into state', async () => {
    const products = [
      { id: '1', name: 'Cuenta', description: 'Ahorro principal', logo: 'x', date_release: '2025-01-01', date_revision: '2026-01-01' }
    ];
    mockProductService.getProducts.mockReturnValue(of(products));

    const resultPromise = firstValueFrom(service.products$.pipe(skip(1), take(1)));
    service.loadProducts();

    await expect(resultPromise).resolves.toEqual(products);
  });

  it('should set error state on load failure', done => {
    mockProductService.getProducts.mockReturnValue(throwError(() => ({
      name: 'HttpError',
      message: 'Error cargando',
      errors: null
    })));

    service.loadProducts();

    service.error$.subscribe(error => {
      if (!error) {
        return;
      }
      expect(error.message).toBe('Error cargando');
      done();
    });
  });

  it('should remove product from state after delete', done => {
    mockProductService.getProducts.mockReturnValue(of([
      { id: '1', name: 'A', description: 'A', logo: 'x', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'B', description: 'B', logo: 'y', date_release: '2025-01-01', date_revision: '2026-01-01' }
    ]));
    mockProductService.deleteProduct.mockReturnValue(of({ data: null }));

    service.loadProducts();
    service.deleteProduct('1').subscribe(() => {
      service.products$.pipe(take(1)).subscribe(result => {
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('2');
        done();
      });
    });
  });
});
