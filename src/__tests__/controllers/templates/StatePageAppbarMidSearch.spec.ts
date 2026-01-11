import { describe, it, expect } from 'vitest'
import { StateAllPages } from '../../../controllers'
import StatePage from '../../../controllers/StatePage'
import StatePageAppbarMidSearch from '../../../controllers/templates/StatePageAppbarMidSearch'
import type { IStateAppbar } from '../../../interfaces/localized'

describe('StatePageAppbarMidSearch', () => {
  const allPages = new StateAllPages({})
  const page1 = new StatePage({}, allPages)
  const appbarState = {
    'appbarStyle': 'middle_search',
    'inputBaseChips': [

      // Example of a chip
      {
        'label': 'Default',
        'color': 'primary',
        'variant': 'filled',
        'ondeleteHandler': 'tuberCallbacks.$51_C_1'
      }
    ],
    'items': [],
  } as IStateAppbar

  describe('constructor', () => {
    it('should create a state page appbar mid search object', () => {
      const obj1 = new StatePageAppbarMidSearch(appbarState, page1)
      expect(obj1.inputHasNoChips).toBe(false)
      expect(obj1.inputHasChips).toBe(true)

      // TODO - More tests here.
    })
  })

  describe('getChipFromPaths', () => {
    it('should get a chip from the paths', () => {
      // const def1 = new StatePageAppbarMidSearch({}, page1)
      // const inputChipsDefs1 = def1.getChipFromPaths(
      //   'foo/1234567890123456789'
      // )
      // expect(inputChipsDefs1.length).toEqual(1)
      // const def2 = new StatePageAppbarMidSearch({}, page1)
      // const icds2 = def2.getChipFromPaths(
      //   'foo/1234567890123456789/1234567890123456789'
      // )
      // expect(icds2.length).toEqual(2)
    })
  })
})
