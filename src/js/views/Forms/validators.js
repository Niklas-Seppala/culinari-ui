/**
 *
 */
export class ValidationResult {
  /** @type {[{field: string, reason: string}]} */
  errors = []
  constructor() {
    this.success = true;
  }
}

/**
 *
 * @param {string} email
 * @param {ValidationResult} result
 * @returns {ValidationResult} result
 */
const validateEmail = (email, result) => {
  const regex = /^\S+@\S+\.\S+$/;
  if (!regex.test(email)) {
    result.success = false;
    result.errors.push({
      field: 'email',
      reason: 'Please enter valid email address' 
    })
  }
  return result;
};

/**
 *
 * @param {string} password
 * @param {ValidationResult} result
 * @returns {ValidationResult} result
 */
const validatePassword = (password, result) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]*$/;
  if (!regex.test(password)) {
    result.success = false
    result.errors.push({
      field: 'password',
      reason: 'Pasword must contain a number and an uppercase letter' 
    })
    return result;
  }

  if (password.length < 8) {
    result.success = false
    result.errors.push({
      field: 'password',
      reason: 'Pasword must be atleast 8 chars long' 
    })
    return result;
  }

  return result;
};

/**
 *
 * @param {string} password1
 * @param {string} password2
 * @param {ValidationResult} result
 * @returns {ValidationResult} result
 */
const validatePassword2 = (password1, password2, result) => {
  if (password1 !== password2) {
    result.success = false
    result.errors.push({
      field: 'password2',
      reason: "2nd password doesn't match" 
    })
  }
  return result;
};

/**
 *
 * @param {string} username
 * @param {ValidationResult} result
 * @returns {ValidationResult} result
 */
const validateUsername = (username, result) => {
  if (username.length < 4 || username.length > 14) {
    result.success = false
    result.errors.push({
      field: 'username',
      reason: 'Username must be atleast 4 chars, max 14 chars' 
    })
  }
  return result;
};

/**
 * Validator function for Register form.
 *
 * @param {{
 *  username: string,
 *  email: string,
 *  password: string,
 *  password2: string }} fields
 *
 * @returns {ValidationResult} success/failure
 */
const register = fields => {
  const result = new ValidationResult();

  validateUsername(fields.username, result)
  validateEmail(fields.email, result)
  validatePassword(fields.password, result)
  validatePassword2(fields.password, fields.password2, result)

  return result;
};

export default { register };
