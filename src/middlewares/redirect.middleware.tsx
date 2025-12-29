import {PayloadAction} from '@reduxjs/toolkit';
import {Middleware} from 'redux';
import browserHistory from '../browser-history';

export const redirect: Middleware =
() =>
    (next) =>
      (action: PayloadAction<string>) => {
        if (action.type === 'engine/redirectToRoute') {
          browserHistory.push(action.payload);
        }

        return next(action);
      };
