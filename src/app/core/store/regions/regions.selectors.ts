import { createSelector } from '@ngrx/store';

import { Region } from 'ish-core/models/region/region.model';
import { getCoreState } from '../core-store';

import { regionAdapter } from './regions.reducer';

const getRegionState = createSelector(
  getCoreState,
  state => state.regions
);

export const { selectAll: getAllRegions } = regionAdapter.getSelectors(getRegionState);

export const getRegionsLoading = createSelector(
  getRegionState,
  regions => regions.loading
);

export const getRegionsByCountryCode = createSelector(
  getAllRegions,
  getRegionsLoading,
  (entities, loading, props: { countryCode: string }): Region[] => {
    const regionsForCountry = entities.filter(e => e.countryCode === props.countryCode);
    // when still loading, do not return empty array because we can't be sure there are no regions
    if (loading && !regionsForCountry.length) {
      return;
    }

    return regionsForCountry;
  }
);