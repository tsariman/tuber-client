import { describe, it, expect } from 'vitest';
import * as F from '../../state/net.actions'

describe('src/state/net.actions.ts', () => {

  describe('get_dialog_state', () => {

    it('get_dialog_state', () => {
      expect(F.get_dialog_state).toEqual({});
    });

  });

  describe('post_fetch', () => {

    it('post_fetch', () => {
      expect(F.post_fetch).toEqual({});
    });

  });

  describe('get_fetch', () => {

    it('get_fetch', () => {
      expect(F.get_fetch).toEqual({});
    });

  });

  describe('post_req_state', () => {

    it('post_req_state', () => {
      expect(F.post_req_state).toEqual({});
    });

  });

  describe('patch_req_state', () => {

    it('patch_req_state', () => {
      expect(F.patch_req_state).toEqual({});
    });

  });

  describe('axios_post_req_state', () => {

    it('axios_post_req_state', () => {
      expect(F.axios_post_req_state).toEqual({});
    });

  });

  describe('get_req_state', () => {

    it('get_req_state', () => {
      expect(F.get_req_state).toEqual({});
    });

  });

  describe('delete_req_state', () => {

    it('delete_req_state', () => {
      expect(F.delete_req_state).toEqual({});
    });

  });

  describe('post_req', () => {

    it('post_req', () => {
      expect(F.post_req).toEqual({});
    });

  });

  describe('get_req', () => {

    it('get_req', () => {
      expect(F.get_req).toEqual({});
    });

  });

});