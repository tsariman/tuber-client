// Example usage of the new set_error_id function

import { set_error_id, remember_exception, remember_error, remember_possible_error } from './errors';

// Example 1: Basic usage in a catch block
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function riskyOperation() {
  try {
    // Some operation that might throw
    throw new Error("Something went wrong");
  } catch (error) {
    set_error_id(1); // error # 1
    remember_exception(error);
    // To find this error location later, search codebase for "set_error_id(1)"
  }
}

// Example 2: Different catch block with different ID
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function anotherFunction() {
  try {
    // Some operation
    throw new Error("Another error");
  } catch (error) {
    set_error_id(2); // error # 2  
    remember_exception(error, "Failed in anotherFunction");
    // To find this error location later, search codebase for "set_error_id(2)"
  }
}

// Example 3: Using with manual error reporting
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function validateData(data: any) {
  if (!data) {
    set_error_id(3); // error # 3
    remember_possible_error({
      code: 'MISSING_VALUE',
      title: 'Data validation failed',
      meta: {
        receivedData: data
      }
    });
    // To find this error location later, search codebase for "set_error_id(3)"
    return false;
  }
  return true;
}

// Example 4: Using with manual error objects
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processPayment(amount: number) {
  if (amount <= 0) {
    set_error_id(4); // error # 4
    remember_error({
      id: '', // Will be set by remember_error function
      code: 'BAD_VALUE',
      title: 'Payment amount must be positive',
      detail: `Received amount: ${amount}`,
    });
    // To find this error location later, search codebase for "set_error_id(4)"
    return false;
  }
  return true;
}

// Example 5: Multiple error points in same function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function complexOperation(data: any) {
  try {
    if (!data.user) {
      set_error_id(5); // error # 5 - missing user
      remember_possible_error({code: 'MISSING_REQUIRED_FIELD', title: 'Missing user data'});
      return;
    }
    
    if (!data.permissions) {
      set_error_id(6); // error # 6 - missing permissions
      remember_possible_error({code: 'MISSING_REQUIRED_FIELD', title: 'Missing permissions data'});
      return;
    }
    
    // Some complex processing
    processUserData(data);
    
  } catch (error) {
    set_error_id(7); // error # 7 - processing failed
    remember_exception(error, "Complex operation failed");
  }
}

function processUserData(data: any) {
  throw new Error("Processing failed");
}
