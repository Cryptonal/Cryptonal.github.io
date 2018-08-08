import { ErrorGroupTypes, HttpError } from './error.actions';

export interface ErrorState {
  current: Error;
  type: string;
}

export const initialState: ErrorState = {
  current: undefined,
  type: undefined,
};

export function errorReducer(state = initialState, action: HttpError): ErrorState {
  const httpAction = action as HttpError;
  switch (httpAction.errorGroup) {
    case ErrorGroupTypes.Http5XXError: {
      return { ...state, current: httpAction.error, type: httpAction.type };
    }
  }
  return state;
}