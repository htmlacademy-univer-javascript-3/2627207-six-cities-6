import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainPage from '../../pages/main/main.page';
import LoginPage from '../../pages/login/login.page';
import FavoritesPage from '../../pages/favorites/favorites.page';
import OfferPage from '../../pages/offer/offer.page';
import { PageNotFound } from '../not-found/not-found.component';
import { PrivateRoutes } from '../private-route/private-route.component';
import { AuthStatus } from '../../enums/auth-status.enum';
import { SortType } from '../../enums/sort-options.enum';
import { createAPI } from '../../services/api';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
const mockStore = configureMockStore(middlewares);

vi.mock('../../hooks/use-map', () => ({
  default: () => null,
}));

describe('App routing', () => {
  const initialState = {
    city: {
      city: {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        }
      }
    },
    offers: {
      offers: [],
      sortType: SortType.Popular,
      areOffersLoading: false,
    },
    offerDetails: {
      currentOffer: null,
      nearbyOffers: [],
      isOfferLoading: false,
      hasOfferError: false,
    },
    reviews: {
      reviews: [],
      isSubmitting: false,
    },
    user: {
      authStatus: AuthStatus.NotAuth,
      user: null,
    }
  };

  it('should render MainPage when navigating to "/"', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path='/' element={<MainPage/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Cities/i)).toBeInTheDocument();
  });

  it('should render LoginPage when navigating to "/login"', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path='/login' element={<LoginPage/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render PageNotFound for unknown route', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown']}>
          <Routes>
            <Route path='*' element={<PageNotFound/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('should redirect to LoginPage when trying to access "/favorites" without auth', () => {
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route path='/favorites' element={
              <PrivateRoutes>
                <FavoritesPage/>
              </PrivateRoutes>
            } />
            <Route path='/login' element={<LoginPage/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render FavoritesPage when navigating to "/favorites" with auth', () => {
    const authState = {
      ...initialState,
      user: {
        authStatus: AuthStatus.Auth,
        user: {
          name: 'User',
          email: 'user@test.com',
          avatarUrl: 'avatar.jpg',
          isPro: false,
          token: 'token',
        },
      }
    };

    const store = mockStore(authState);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/favorites']}>
          <Routes>
            <Route path='/favorites' element={
              <PrivateRoutes>
                <FavoritesPage/>
              </PrivateRoutes>
            } />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Saved listing/i)).toBeInTheDocument();
  });
});
