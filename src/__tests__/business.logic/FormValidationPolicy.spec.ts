import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';

// Mock document for parsing module before any imports
Object.defineProperty(globalThis, 'document', {
  value: {
    querySelector: vi.fn().mockReturnValue({
      content: 'app'
    })
  },
  writable: true
});

// Mock the parsing module that gets imported by state
vi.mock('../../business.logic/parsing', () => ({
  get_head_meta_content: vi.fn().mockReturnValue('app'),
  get_cookie: vi.fn().mockReturnValue(''),
  get_val: vi.fn(),
  parse_content_string: vi.fn()
}));

// Mock the StateFormsDataErrors class
vi.mock('../../controllers/StateFormsDataErrors');

import FormValidationPolicy from '../../business.logic/FormValidationPolicy';
import StateFormsDataErrors from '../../controllers/StateFormsDataErrors';
import type { IRedux } from '../../state';
import type { IStateFormsDataErrors, IStateFormErrors } from '@tuber/shared';

interface TestFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
}

describe('FormValidationPolicy', () => {
  let mockRedux: IRedux;
  let mockStore: {
    getState: Mock;
    dispatch: Mock;
  };
  let mockFormsDataErrorsState: IStateFormsDataErrors;
  let mockFormErrorProfiles: IStateFormErrors;
  let mockStateFormsDataErrors: StateFormsDataErrors<TestFormData>;
  let formValidationPolicy: FormValidationPolicy<TestFormData>;

  const FORM_NAME = 'testForm';

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock form error profiles with validation rules
    mockFormErrorProfiles = {
      username: {
        required: true,
        requiredMessage: 'Username is required',
        maxLength: 20,
        maxLengthMessage: 'Username must be 20 characters or less',
        validationRegex: '^[a-zA-Z0-9_]+$',
        validationMessage: 'Username can only contain letters, numbers, and underscores'
      },
      email: {
        required: true,
        requiredMessage: 'Email is required',
        validationRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        validationMessage: 'Please enter a valid email address'
      },
      password: {
        required: true,
        requiredMessage: 'Password is required',
        maxLength: 50,
        maxLengthMessage: 'Password must be 50 characters or less'
      },
      confirmPassword: {
        required: true,
        requiredMessage: 'Password confirmation is required'
      },
      bio: {
        required: false,
        maxLength: 500,
        maxLengthMessage: 'Bio must be 500 characters or less'
      }
    };

    // Mock forms data errors state
    mockFormsDataErrorsState = {
      [FORM_NAME]: mockFormErrorProfiles
    };

    // Mock store
    mockStore = {
      getState: vi.fn().mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            bio: 'This is a test bio'
          }
        }
      }),
      dispatch: vi.fn()
    };

    // Mock Redux interface
    mockRedux = {
      store: mockStore as unknown as IRedux['store'],
      actions: {} as IRedux['actions']
    };

    // Mock StateFormsDataErrors instance
    mockStateFormsDataErrors = {
      configure: vi.fn(),
      get: vi.fn().mockReturnValue(mockFormErrorProfiles),
      hasError: vi.fn().mockReturnValue(false),
      getError: vi.fn().mockReturnValue(false),
      getMessage: vi.fn().mockReturnValue(''),
      getCount: vi.fn().mockReturnValue(0)
    } as unknown as StateFormsDataErrors<TestFormData>;

    // Mock the constructor to return our mock instance  
    (StateFormsDataErrors as unknown as Mock).mockImplementation(function(this: unknown) {
      // Return a new mock instance for each constructor call
      return {
        configure: vi.fn(),
        get: vi.fn().mockReturnValue(mockFormErrorProfiles),
        hasError: vi.fn().mockReturnValue(false),
        getError: vi.fn().mockReturnValue(false),
        getMessage: vi.fn().mockReturnValue(''),
        getCount: vi.fn().mockReturnValue(0)
      };
    });

    // Create FormValidationPolicy instance
    formValidationPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
  });

  describe('constructor', () => {
    it('should initialize with Redux store and form name', () => {
      expect(mockStore.getState).toHaveBeenCalled();
      expect(StateFormsDataErrors).toHaveBeenCalledWith(mockFormsDataErrorsState);
      // Check that configure was called on the actual instance
      expect(formValidationPolicy.e.configure).toHaveBeenCalledWith({ formName: FORM_NAME });
    });

    it('should expose StateFormsDataErrors instance through e getter', () => {
      // Check that the getter returns an object with the expected methods
      expect(formValidationPolicy.e).toHaveProperty('configure');
      expect(formValidationPolicy.e).toHaveProperty('get');
      expect(formValidationPolicy.e).toHaveProperty('hasError');
    });
  });

  describe('emit', () => {
    it('should dispatch error message for form field', () => {
      const fieldName = 'username';
      const errorMessage = 'Username is too short';

      formValidationPolicy.emit(fieldName, errorMessage);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName: FORM_NAME,
          name: fieldName,
          error: true,
          message: errorMessage
        }
      });
    });

    it('should handle different field types', () => {
      const fieldName = 'email';
      const errorMessage = 'Invalid email format';

      formValidationPolicy.emit(fieldName, errorMessage);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName: FORM_NAME,
          name: fieldName,
          error: true,
          message: errorMessage
        }
      });
    });

    it('should handle empty error messages', () => {
      const fieldName = 'password';
      const errorMessage = '';

      formValidationPolicy.emit(fieldName, errorMessage);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName: FORM_NAME,
          name: fieldName,
          error: true,
          message: errorMessage
        }
      });
    });
  });

  describe('mute', () => {
    it('should dispatch remove action for form field', () => {
      const fieldName = 'username';

      formValidationPolicy.mute(fieldName);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsRemove',
        payload: {
          formName: FORM_NAME,
          name: fieldName
        }
      });
    });

    it('should handle different field types', () => {
      const fieldName = 'email';

      formValidationPolicy.mute(fieldName);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsRemove',
        payload: {
          formName: FORM_NAME,
          name: fieldName
        }
      });
    });
  });

  describe('getFormData', () => {
    it('should return form data from Redux store', () => {
      const formData = formValidationPolicy.getFormData();

      expect(formData).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        bio: 'This is a test bio'
      });
    });

    it('should return undefined when form data does not exist', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {}
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, 'nonexistentForm');
      const formData = newPolicy.getFormData();

      expect(formData).toBeUndefined();
    });

    it('should cache form data after first call', () => {
      // First call
      const formData1 = formValidationPolicy.getFormData();
      // Second call
      const formData2 = formValidationPolicy.getFormData();

      expect(formData1).toBe(formData2);
      expect(mockStore.getState).toHaveBeenCalledTimes(2); // Once in constructor, once in first getFormData call
    });
  });

  describe('getFilteredData', () => {
    it('should return filtered form data', () => {
      const formData = formValidationPolicy.getFilteredData();

      expect(formData).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        bio: 'This is a test bio'
      });
    });

    it('should trim string values', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: '  testuser  ',
            email: ' test@example.com ',
            password: 'password123',
            bio: '  This is a test bio  '
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const formData = newPolicy.getFilteredData();

      expect(formData).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'This is a test bio'
      });
    });

    it('should preserve non-string values', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            age: 25,
            isActive: true,
            metadata: { key: 'value' }
          }
        }
      });

      const newPolicy = new FormValidationPolicy(mockRedux, FORM_NAME);
      const formData = newPolicy.getFilteredData();

      expect(formData).toEqual({
        username: 'testuser',
        age: 25,
        isActive: true,
        metadata: { key: 'value' }
      });
    });
  });

  describe('applyValidationSchemes', () => {
    beforeEach(() => {
      // Reset form data for each validation test
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            bio: 'This is a test bio'
          }
        }
      });
    });

    it('should return null when no form data exists', () => {
      // For no form data case, the formsData object should not have the form at all
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          // No form data for FORM_NAME
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toBeNull();
    });

    it('should return null when no validation errors found', () => {
      const validationErrors = formValidationPolicy.applyValidationSchemes();

      expect(validationErrors).toBeNull();
    });

    it('should detect required field errors', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: '',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'username',
          error: true,
          message: 'Username is required'
        }
      ]);
    });

    it('should detect maxLength errors', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'thisusernameiswaytoolo', // 22 characters, exceeds maxLength of 20
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'username',
          error: true,
          message: 'Username must be 20 characters or less'
        }
      ]);
    });

    it('should detect validation regex errors', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'user@name!', // Contains invalid characters
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'username',
          error: true,
          message: 'Username can only contain letters, numbers, and underscores'
        }
      ]);
    });

    it('should detect invalidation regex errors', () => {
      // Add invalidation regex to mock profiles
      const mockFormErrorProfilesWithInvalidation = {
        ...mockFormErrorProfiles,
        username: {
          ...mockFormErrorProfiles.username,
          invalidationRegex: 'admin|root|test',
          invalidationMessage: 'Username cannot be admin, root, or test'
        }
      };

      mockStore.getState.mockReturnValue({
        formsDataErrors: { [FORM_NAME]: mockFormErrorProfilesWithInvalidation },
        formsData: {
          [FORM_NAME]: {
            username: 'admin',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      // Mock the constructor to return updated error profiles for this test
      (StateFormsDataErrors as unknown as Mock).mockImplementationOnce(function(this: unknown) {
        return {
          configure: vi.fn(),
          get: vi.fn().mockReturnValue(mockFormErrorProfilesWithInvalidation),
          hasError: vi.fn().mockReturnValue(false),
          getError: vi.fn().mockReturnValue(false),
          getMessage: vi.fn().mockReturnValue(''),
          getCount: vi.fn().mockReturnValue(0)
        };
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'username',
          error: true,
          message: 'Username cannot be admin, root, or test'
        }
      ]);
    });

    it('should detect email format errors', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'invalid-email',
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'email',
          error: true,
          message: 'Please enter a valid email address'
        }
      ]);
    });

    it('should detect multiple validation errors', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: '', // Required field missing
            email: 'invalid-email', // Invalid format
            password: '', // Required field missing
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toHaveLength(3);
      expect(validationErrors).toEqual(
        expect.arrayContaining([
          {
            name: 'username',
            error: true,
            message: 'Username is required'
          },
          {
            name: 'email',
            error: true,
            message: 'Please enter a valid email address'
          },
          {
            name: 'password',
            error: true,
            message: 'Password is required'
          }
        ])
      );
    });

    it('should skip validation for undefined optional fields', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
            // bio is undefined and optional
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toBeNull();
    });

    it('should validate optional fields when they have values', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            bio: 'a'.repeat(501) // Exceeds maxLength of 500
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const validationErrors = newPolicy.applyValidationSchemes();

      expect(validationErrors).toEqual([
        {
          name: 'bio',
          error: true,
          message: 'Bio must be 500 characters or less'
        }
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle missing form error profiles gracefully', () => {
      (mockStateFormsDataErrors.get as Mock).mockReturnValue({});

      const validationErrors = formValidationPolicy.applyValidationSchemes();

      expect(validationErrors).toBeNull();
    });

    it('should handle form data with extra fields not in error profiles', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
            bio: 'This is a test bio',
            extraField: 'This field is not in error profiles'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const formData = newPolicy.getFormData();

      expect(formData).toHaveProperty('extraField', 'This field is not in error profiles');
    });

    it('should handle null and undefined values in form data', () => {
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: null,
            email: undefined,
            password: 'password123',
            confirmPassword: 'password123'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);
      const formData = newPolicy.getFormData();

      expect(formData).toEqual({
        username: null,
        email: undefined,
        password: 'password123',
        confirmPassword: 'password123'
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work with real validation workflow', () => {
      // Start with invalid data
      mockStore.getState.mockReturnValue({
        formsDataErrors: mockFormsDataErrorsState,
        formsData: {
          [FORM_NAME]: {
            username: '',
            email: 'invalid-email',
            password: 'pwd',
            confirmPassword: 'different'
          }
        }
      });

      const newPolicy = new FormValidationPolicy<TestFormData>(mockRedux, FORM_NAME);

      // Apply validations
      const validationErrors = newPolicy.applyValidationSchemes();
      expect(validationErrors).not.toBeNull();
      expect(validationErrors!.length).toBeGreaterThan(0);

      // Emit errors for each validation failure
      validationErrors!.forEach(error => {
        newPolicy.emit(error.name, error.message!);
      });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(validationErrors!.length);

      // Clear errors after fixing data
      newPolicy.mute('username');
      newPolicy.mute('email');

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsRemove',
        payload: {
          formName: FORM_NAME,
          name: 'username'
        }
      });
    });

    it('should handle form name changes correctly', () => {
      const anotherFormName = 'anotherForm';
      const anotherPolicy = new FormValidationPolicy<TestFormData>(mockRedux, anotherFormName);

      anotherPolicy.emit('username', 'Error message');

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'formsDataErrors/formsDataErrorsUpdate',
        payload: {
          formName: anotherFormName,
          name: 'username',
          error: true,
          message: 'Error message'
        }
      });
    });
  });
});