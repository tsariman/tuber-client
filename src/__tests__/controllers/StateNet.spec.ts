import { describe, it, expect } from 'vitest';
import StateNet from '../../controllers/StateNet';

describe('StateNet', () => {
  it('does not inject a bearer authorization header from bootstrap state', () => {
    const headers = new StateNet({
      headers: {
        'X-Test': 'ok'
      },
      token: 'server-should-not-send-this'
    }).headers;

    expect(headers).toEqual({
      'X-Test': 'ok'
    });
    expect(headers?.Authorization).toBeUndefined();
  });

  it('treats user identity fields as sufficient for logged-in state', () => {
    const stateNet = new StateNet({
      _id: 'abc123',
      name: 'admin',
      role: 'administrator'
    });

    expect(stateNet.userLoggedIn).toBe(true);
  });

  it('rejects empty or whitespace-only identity fields for logged-in state', () => {
    expect(new StateNet({
      _id: 'abc123',
      name: '   ',
      role: 'administrator'
    }).userLoggedIn).toBe(false);

    expect(new StateNet({
      _id: '',
      name: 'admin',
      role: 'administrator'
    }).userLoggedIn).toBe(false);

    expect(new StateNet({
      _id: 'abc123',
      name: 'admin',
      role: '  '
    }).userLoggedIn).toBe(false);
  });

  it('uses the same hardened identity check for session validity', () => {
    expect(new StateNet({
      _id: 'abc123',
      name: 'admin',
      role: 'administrator'
    }).sessionValid).toBe(true);

    expect(new StateNet({
      _id: '',
      name: 'admin',
      role: 'administrator'
    }).sessionValid).toBe(false);

    expect(new StateNet({
      _id: 'abc123',
      name: '   ',
      role: 'administrator'
    }).sessionValid).toBe(false);
  });
});