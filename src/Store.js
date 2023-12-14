'use strict';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const inventorySelectedBookAtom = atom(null);

export const sessionAtom = atomWithStorage(
  'session',
  localStorage.getItem('session')
    ? JSON.parse(localStorage.getItem('session'))
    : undefined,
);

export const removeSession = () => {
  localStorage.removeItem('session');
};

export const getSession = () => {
  if (!localStorage.getItem('session')) {
    return;
  }

  return JSON.parse(localStorage.getItem('session'));
};
