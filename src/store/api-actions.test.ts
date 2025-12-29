import { describe, it, expect, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { createAPI } from '../services/api';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import {
  fetchOffersAction,
  checkAuthAction,
  fetchOfferAction,
  fetchNearbyOffersAction,
  fetchCommentsAction,
  postCommentAction,
  toggleFavoriteAction,
  fetchFavoritesAction,
} from './api-actions';
import { AppRoute } from '../types/app-route.type';

describe('Async actions', () => {
  const api = createAPI();
  const mockAPI = new MockAdapter(api);
  const middlewares = [thunk.withExtraArgument(api)];
  const mockStore = configureMockStore(middlewares);

  it('should dispatch fetchOffersAction when GET /offers', async () => {
    const mockOffers = [
      {
        id: '1',
        title: 'Test Offer',
        previewImage: 'test.jpg',
        isPremium: false,
        price: 100,
        isFavorite: false,
        rating: 4,
        type: 'apartment',
        city: {
          name: 'Paris',
          location: {
            latitude: 48.85661,
            longitude: 2.351499,
            zoom: 16,
          }
        },
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        },
        images: ['test.jpg'],
      }
    ];

    mockAPI.onGet(AppRoute.OffersMain).reply(200, mockOffers);

    const store = mockStore();

    await store.dispatch(fetchOffersAction());

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      fetchOffersAction.pending.type,
      fetchOffersAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockOffers);
  });

  it('should dispatch checkAuthAction when GET /login', async () => {
    const mockUser = {
      name: 'User',
      email: 'user@test.com',
      avatarUrl: 'avatar.jpg',
      isPro: false,
      token: 'token',
    };

    mockAPI.onGet(AppRoute.Login).reply(200, mockUser);

    const store = mockStore();

    await store.dispatch(checkAuthAction());

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      checkAuthAction.pending.type,
      checkAuthAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockUser);
  });

  it('should dispatch fetchOfferAction when GET /offers/:id', async () => {
    const mockOffer = {
      id: '1',
      title: 'Test Offer',
      previewImage: 'test.jpg',
      isPremium: true,
      price: 200,
      isFavorite: true,
      rating: 5,
      type: 'hotel',
      city: {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        }
      },
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 16,
      },
      images: ['test.jpg'],
    };

    mockAPI.onGet('/offers/1').reply(200, mockOffer);

    const store = mockStore();

    await store.dispatch(fetchOfferAction('1'));

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      fetchOfferAction.pending.type,
      fetchOfferAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockOffer);
  });

  it('should dispatch fetchNearbyOffersAction when GET /offers/:id/nearby', async () => {
    const mockNearbyOffers = [
      {
        id: '2',
        title: 'Nearby Offer',
        previewImage: 'nearby.jpg',
        isPremium: false,
        price: 150,
        isFavorite: false,
        rating: 4,
        type: 'apartment',
        city: {
          name: 'Paris',
          location: {
            latitude: 48.85661,
            longitude: 2.351499,
            zoom: 16,
          }
        },
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        },
        images: ['nearby.jpg'],
      }
    ];

    mockAPI.onGet('/offers/1/nearby').reply(200, mockNearbyOffers);

    const store = mockStore();

    await store.dispatch(fetchNearbyOffersAction('1'));

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      fetchNearbyOffersAction.pending.type,
      fetchNearbyOffersAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockNearbyOffers);
  });

  it('should dispatch fetchCommentsAction when GET /comments/:id', async () => {
    const mockReviews = [
      {
        id: 1,
        offerId: '1',
        user: {
          name: 'User',
          email: 'user@test.com',
          avatarUrl: 'avatar.jpg',
          isPro: false,
          token: 'token',
        },
        comment: 'Great place!',
        date: '2023-10-01',
        rating: 5,
      }
    ];

    mockAPI.onGet('/comments/1').reply(200, mockReviews);

    const store = mockStore();

    await store.dispatch(fetchCommentsAction('1'));

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      fetchCommentsAction.pending.type,
      fetchCommentsAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockReviews);
  });

  it('should dispatch postCommentAction when POST /comments/:id', async () => {
    const mockComment = {
      offerId: '1',
      comment: 'Nice place!',
      rating: 4,
    };

    const mockReviews = [
      {
        id: 1,
        offerId: '1',
        user: {
          name: 'User',
          email: 'user@test.com',
          avatarUrl: 'avatar.jpg',
          isPro: false,
          token: 'token',
        },
        comment: 'Nice place!',
        date: '2023-10-01',
        rating: 4,
      }
    ];

    mockAPI.onPost('/comments/1').reply(200);
    mockAPI.onGet('/comments/1').reply(200, mockReviews);

    const store = mockStore();

    await store.dispatch(postCommentAction(mockComment));

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      postCommentAction.pending.type,
      postCommentAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockReviews);
  });

  it('should dispatch toggleFavoriteAction when POST /favorite/:id/:status', async () => {
    const mockOffer = {
      id: '1',
      title: 'Test Offer',
      previewImage: 'test.jpg',
      isPremium: false,
      price: 100,
      isFavorite: true,
      rating: 4,
      type: 'apartment',
      city: {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        }
      },
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 16,
      },
      images: ['test.jpg'],
    };

    mockAPI.onPost('/favorite/1/1').reply(200, mockOffer);

    const store = mockStore();

    await store.dispatch(toggleFavoriteAction({ offerId: '1', status: 1 }));

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      toggleFavoriteAction.pending.type,
      toggleFavoriteAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockOffer);
  });

  it('should dispatch fetchFavoritesAction when GET /favorite', async () => {
    const mockFavorites = [
      {
        id: '1',
        title: 'Favorite Offer',
        previewImage: 'favorite.jpg',
        isPremium: true,
        price: 250,
        isFavorite: true,
        rating: 5,
        type: 'hotel',
        city: {
          name: 'Paris',
          location: {
            latitude: 48.85661,
            longitude: 2.351499,
            zoom: 16,
          }
        },
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
          zoom: 16,
        },
        images: ['favorite.jpg'],
      }
    ];

    mockAPI.onGet('/favorite').reply(200, mockFavorites);

    const store = mockStore();

    await store.dispatch(fetchFavoritesAction());

    const actions = store.getActions();
    const extractedActionsTypes = actions.map(({ type }) => type);

    expect(extractedActionsTypes).toEqual([
      fetchFavoritesAction.pending.type,
      fetchFavoritesAction.fulfilled.type,
    ]);

    expect(actions[1].payload).toEqual(mockFavorites);
  });
});
