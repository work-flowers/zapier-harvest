'use strict';

const addHarvestHeaders = (request, z, bundle) => {
  request.headers = request.headers || {};
  if (bundle.authData.accessToken) {
    request.headers.Authorization = `Bearer ${bundle.authData.accessToken}`;
  }
  if (bundle.authData.accountId) {
    request.headers['Harvest-Account-Id'] = bundle.authData.accountId;
  }
  request.headers['User-Agent'] = 'Zapier Harvest Integration (support@work.flowers)';
  return request;
};

const handleErrors = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      'Your Harvest credentials are invalid. Check your Personal Access Token and Account ID.',
      'AuthenticationError',
      response.status
    );
  }
  if (response.status === 403) {
    throw new z.errors.Error(
      'You do not have permission to access this Harvest resource. Administrator or Manager access is required.',
      'ForbiddenError',
      response.status
    );
  }
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('retry-after') || '10', 10);
    throw new z.errors.ThrottledError(
      'Harvest rate limit reached.',
      retryAfter
    );
  }
  return response;
};

module.exports = {
  befores: [addHarvestHeaders],
  afters: [handleErrors],
};
