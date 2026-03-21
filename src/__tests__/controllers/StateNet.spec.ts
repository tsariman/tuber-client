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
});