import { CountriesState } from './countries/countries.reducer';
import { ErrorState } from './error/error.reducer';
import { LocaleState } from './locale/locale.reducer';
import { UserState } from './user/user.reducer';
import { ViewconfState } from './viewconf/viewconf.reducer';

export interface CoreState {
  user: UserState;
  locale: LocaleState;
  countries: CountriesState;
  error: ErrorState;
  viewconf: ViewconfState;
}