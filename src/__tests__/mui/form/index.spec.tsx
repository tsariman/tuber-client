import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StateJsxForm from '../../../mui/form';
import type StateForm from '../../../controllers/StateForm';

// Mock StateForm for testing
const createMockForm = (type: string = 'box', paperBackground: boolean = false): StateForm => ({
  _type: type,
  paperBackground,
  paperProps: { elevation: 2 },
  props: { 'data-testid': 'form-container' },
} as unknown as StateForm);

describe('src/mui/form/index.tsx', () => {

  describe('StateJsxForm', () => {

    it('should render box form correctly', () => {
      const mockForm = createMockForm('box');
      
      const { getByTestId } = render(
        <StateJsxForm instance={mockForm}>
          <div>Form content</div>
        </StateJsxForm>
      );
      
      expect(getByTestId('form-container')).toBeInTheDocument();
    });

    it('should render stack form correctly', () => {
      const mockForm = createMockForm('stack');
      
      const { getByTestId } = render(
        <StateJsxForm instance={mockForm}>
          <div>Stack content</div>
        </StateJsxForm>
      );
      
      expect(getByTestId('form-container')).toBeInTheDocument();
    });

    it('should render with paper background when enabled', () => {
      const mockForm = createMockForm('box', true);
      
      const { container } = render(
        <StateJsxForm instance={mockForm}>
          <div>Paper content</div>
        </StateJsxForm>
      );
      
      const paper = container.querySelector('.MuiPaper-root');
      expect(paper).toBeInTheDocument();
    });

    it('should render without paper when disabled', () => {
      const mockForm = createMockForm('box', false);
      
      const { container } = render(
        <StateJsxForm instance={mockForm}>
          <div>No paper content</div>
        </StateJsxForm>
      );
      
      const paper = container.querySelector('.MuiPaper-root');
      expect(paper).not.toBeInTheDocument();
    });

    it('should fallback to box for unknown type', () => {
      const mockForm = createMockForm('unknown');
      
      const { getByTestId } = render(
        <StateJsxForm instance={mockForm}>
          <div>Fallback content</div>
        </StateJsxForm>
      );
      
      expect(getByTestId('form-container')).toBeInTheDocument();
    });

    it('should render none type correctly', () => {
      const mockForm = createMockForm('none');
      
      const { getByText } = render(
        <StateJsxForm instance={mockForm}>
          <div>None type content</div>
        </StateJsxForm>
      );
      
      expect(getByText('None type content')).toBeInTheDocument();
    });

  });

});