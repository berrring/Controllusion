import assert from 'node:assert/strict';
import test from 'node:test';

import {
  validateCustomer,
  validateInviteUser,
  validateLogin,
  validatePasswordChange,
  validateProfile,
  validateRegister,
} from './validation.js';

test('validateLogin returns required field errors', () => {
  assert.deepEqual(validateLogin({ email: '', password: '' }), {
    email: 'Email is required.',
    password: 'Password is required.',
  });
});

test('validateLogin accepts a valid email and password', () => {
  assert.deepEqual(validateLogin({ email: 'owner@example.com', password: 'secret' }), {});
});

test('validateRegister enforces name, password length, and password confirmation', () => {
  assert.deepEqual(
    validateRegister({
      fullName: '',
      email: 'bad-email',
      password: 'short',
      confirmPassword: 'different',
    }),
    {
      email: 'Enter a valid email address.',
      fullName: 'Full name is required.',
      password: 'Password must be at least 8 characters.',
      confirmPassword: 'Passwords do not match.',
    },
  );
});

test('validateCustomer accepts complete customer data with numeric deal value', () => {
  assert.deepEqual(
    validateCustomer({
      fullName: 'Jane Cooper',
      email: 'jane@example.com',
      phone: '+1 555 123',
      company: 'Acme',
      status: 'Active',
      stage: 'Proposal',
      dealValue: '12500',
    }),
    {},
  );
});

test('validateCustomer rejects missing fields and negative deal value', () => {
  assert.deepEqual(
    validateCustomer({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      status: '',
      stage: '',
      dealValue: '-1',
    }),
    {
      fullName: 'Customer name is required.',
      email: 'Email is required.',
      phone: 'Phone number is required.',
      company: 'Company is required.',
      status: 'Select a status.',
      stage: 'Select a stage.',
      dealValue: 'Deal value cannot be negative.',
    },
  );
});

test('validateProfile requires a valid profile name and email', () => {
  assert.deepEqual(validateProfile({ fullName: ' ', email: 'wrong' }), {
    fullName: 'Full name is required.',
    email: 'Enter a valid email address.',
  });
});

test('validatePasswordChange validates current and matching new passwords', () => {
  assert.deepEqual(
    validatePasswordChange({
      currentPassword: '',
      newPassword: 'long-enough',
      confirmNewPassword: 'mismatch',
    }),
    {
      currentPassword: 'Current password is required.',
      confirmNewPassword: 'Passwords do not match.',
    },
  );
});

test('validateInviteUser requires name, email, and role', () => {
  assert.deepEqual(validateInviteUser({ fullName: '', email: '', role: '' }), {
    fullName: 'Full name is required.',
    email: 'Email is required.',
    role: 'Select a role.',
  });
});
