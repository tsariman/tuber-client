import { describe, it, expect } from 'vitest';
import * as F from '../../../../src/mui/table/_table.common.logic';

describe('mui/table/_table.common.logic.ts', () => {
  describe('analyze_table_data', () => {
    it('should return an object', () => {
      const data = {
        id: 1,
        name: 'name',
        description: 'description',
        active: true,
        created_at: '2019-01-01',
        updated_at: '2019-01-01'
      };
      const result = F.analyze_table_data(data);
      expect(result).toEqual(data);
    });

    it('should return an array 1', () => {
      const data = [
        {
          id: 1,
          name: 'name',
          description: 'description',
          active: true,
          created_at: '2019-01-01',
          updated_at: '2019-01-01'
        }
      ];
      const result = F.analyze_table_data(data);
      expect(result).toEqual(data[0]);
    })

    it('should throw an error', () => {
      const data = 'string';
      const result = () => F.analyze_table_data(data);
      expect(result).toThrow();
    });
  });

  describe('get_table_view_columns', () => {
    it('should return an array', () => {
      const data = {
        id: 1,
        name: 'name',
        description: 'description',
        active: true,
        created_at: '2019-01-01',
        updated_at: '2019-01-01'
      }
      const result = F.get_table_view_columns(data)
      expect(result).toEqual(data)
    });

    it('should return an array 2', () => {
      const data = [
        {
          id: 1,
          name: 'name',
          description: 'description',
          active: true,
          created_at: '2019-01-01',
          updated_at: '2019-01-01'
        }
      ];
      const result = F.get_table_view_columns(data);
      expect(result).toEqual(data[0]);
    });

    it('should throw an error', () => {
      const data = 'string';
      const result = () => F.get_table_view_columns(data);
      expect(result).toThrow();
    });
  });

});