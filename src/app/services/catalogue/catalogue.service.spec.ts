import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Tab } from './catalogue.model';
import { CatalogueService } from './catalogue.service';

describe('CatalogueService', () => {
  let service: CatalogueService;
  let httpMock: HttpTestingController;

  const searchQuery = (tab: Tab): string => {
    httpMock.expectOne('assets/default.json').flush({ perPage: 100, pageSize: 8, tabs: { tab } });
    service.items$.tab.subscribe();

    const search = httpMock.expectOne((req) => req.url.startsWith('https://api.github.com/search/repositories'));
    return search.request.url.split('&q=')[1];
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(CatalogueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search a single topic with the topic qualifier', () => {
    const query = searchQuery({ topic: 'unict-qd+unict-qd-2025-2026', path: '/unict-qd+unict-qd-2025-2026' });

    expect(query).toBe('fork:true+topic:unict-qd+unict-qd-2025-2026+sort:stars');
  });

  it('should search a list of topics as any of them', () => {
    const query = searchQuery({ topic: ['unict-qd', 'unict-sqpd'], path: '/unict-qd' });

    expect(query).toBe('fork:true+unict-qd+OR+unict-sqpd+in:topics+sort:stars');
  });
});
