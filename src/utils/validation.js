const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password?.trim()) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function validateRegister(values) {
  const errors = validateLogin(values);

  if (!values.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.password?.trim()) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateCustomer(values) {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = 'Customer name is required.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.phone?.trim()) {
    errors.phone = 'Phone number is required.';
  }

  if (!values.company?.trim()) {
    errors.company = 'Company is required.';
  }

  if (!values.status) {
    errors.status = 'Select a status.';
  }

  if (!values.stage) {
    errors.stage = 'Select a stage.';
  }

  if (values.dealValue === '' || Number.isNaN(Number(values.dealValue))) {
    errors.dealValue = 'Enter a valid deal value.';
  } else if (Number(values.dealValue) < 0) {
    errors.dealValue = 'Deal value cannot be negative.';
  }

  return errors;
}

export function validateProfile(values) {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function validatePasswordChange(values) {
  const errors = {};

  if (!values.currentPassword?.trim()) {
    errors.currentPassword = 'Current password is required.';
  }

  if (!values.newPassword?.trim()) {
    errors.newPassword = 'New password is required.';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters.';
  }

  if (!values.confirmNewPassword?.trim()) {
    errors.confirmNewPassword = 'Confirm the new password.';
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = 'Passwords do not match.';
  }

  return errors;
}
