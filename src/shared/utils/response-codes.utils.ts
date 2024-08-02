export const ResponseCodes = {
  // Handler for all successful requests
  '0000': {
    type: 'success',
    status: 'OK',
    code: '00',
    message: 'Successful',
  },

  // Handler for requerying
  '0001': {
    type: 'success',
    status: 'OK',
    code: '01',
    message: 'Successful, will be processed later',
  },

  // Handler for all failed requests or validation or Not Found requests
  '0002': {
    type: 'error',
    status: 'FAIL',
    code: '02',
    message: 'Request failed',
  },

  // Handler for wallet failures
  '0003': {
    type: 'error',
    status: 'FAIL',
    code: '03',
    message: 'Insufficient wallet balance',
  },

  // Handler for third party failures
  '0004': {
    type: 'error',
    status: 'FAIL',
    code: '04',
    message: 'Provider failure',
  },

  // Handler for invalid credentials (pin, authentication...)
  '0005': {
    type: 'error',
    status: 'DENIED',
    code: '05',
    message: 'Invalid access key or credential',
  },

  // Handler for service not available
  '0006': {
    type: 'error',
    status: 'DENIED',
    code: '06',
    message: 'Service unavailable',
  },

  // Handler for system failure
  '0007': {
    type: 'error',
    status: 'DENIED',
    code: '07',
    message: 'System failure',
  },
};
