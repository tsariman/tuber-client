import { describe, it, expect } from 'vitest';
import { odysee_get_url_data } from '../_tuber.common.logic';

describe('odysee_get_url_data', () => {
  it('parses author, id, and start from Odysee URL', () => {
    const url = 'https://odysee.com/@KRWSD-MxR:3/MxR-Skyrim-Mods-Week-33:1?t=3';
    const data = odysee_get_url_data(url);
    expect(data.author).toBe('@KRWSD-MxR:3');
    expect(data.id).toBe('MxR-Skyrim-Mods-Week-33:1');
    expect(data.start).toBe(3);
  });

  it('handles URLs without start param', () => {
    const url = 'https://odysee.com/@KRWSD-MxR:3/MxR-Skyrim-Mods-Week-33:1';
    const data = odysee_get_url_data(url);
    expect(data.author).toBe('@KRWSD-MxR:3');
    expect(data.id).toBe('MxR-Skyrim-Mods-Week-33:1');
    expect(data.start).toBeUndefined();
  });

  it('allows optional www subdomain', () => {
    const url = 'https://www.odysee.com/@KRWSD-MxR:3/MxR-Skyrim-Mods-Week-33:1?t=3';
    const data = odysee_get_url_data(url);
    expect(data.author).toBe('@KRWSD-MxR:3');
    expect(data.id).toBe('MxR-Skyrim-Mods-Week-33:1');
    expect(data.start).toBe(3);
  });
});
