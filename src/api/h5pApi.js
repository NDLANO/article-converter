/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fetch from 'isomorphic-fetch';
import {
    resolveJsonOrRejectWithError,
} from '../utils/apiHelpers';

const getHeaders = () => ({
    headers: {
        'content-type': 'Content-Type: application/json',
    },
});

let H5P_HOST_URL = 'https://h5p-test.ndla.no'; // default testing url
if (process.env.NDLA_ENVIRONMENT === 'prod') {
    H5P_HOST_URL = 'https://h5p.ndla.no';
}

export const fetchH5p = async (id) => {
    const url = `${H5P_HOST_URL}/v1/resource/${id}/copyright`;
    const response = await fetch(url, {
        method: 'GET',
        ...getHeaders(),
    });
    return resolveJsonOrRejectWithError(response) || null;
}
