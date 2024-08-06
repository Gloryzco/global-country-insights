export const ResponseCodes = {
  // Handler for all successful requests | Code: '200'
  '0000': {
    type: 'success',
    status: 'OK',
    code: '00',
    message: 'Successful',
  },

  // Handler for all failed requests or validation or Not Found requests | Code: '400',
  '0001': {
    type: 'error',
    status: 'FAIL',
    code: '01',
    message: 'Request failed',
  },

  // Handler for third party failures | Code: '502',
  '0002': {
    type: 'error',
    status: 'FAIL',
    code: '02',
    message: 'Provider failure',
  },

  // Handler for invalid credentials (authentication...) | Code: '401',
  '0003': {
    type: 'error',
    status: 'UNAUTHORIZED',
    code: '03',
    message: 'Invalid access key or credential',
  },

  // Handler for service not available | Code: '503',
  '0004': {
    type: 'error',
    status: 'DENIED',
    code: '04',
    message: 'Service unavailable',
  },

  // Handler for system failure | Code: '500',
  '0005': {
    type: 'error',
    status: 'DENIED',
    code: '05',
    message: 'System failure',
  },
};
