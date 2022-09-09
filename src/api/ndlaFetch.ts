import fetch from 'isomorphic-fetch';
import { getCorrelationId } from '../correlationIdMiddleware';

function getHeaders(init?: RequestInit): HeadersInit | undefined {
  const correlationId = getCorrelationId();
  if (!correlationId) return init?.headers;

  return {
    ...init?.headers,
    'x-correlation-id': correlationId,
  };
}

export function ndlaFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const headers = getHeaders(init);
  const newInit: RequestInit = { ...init, headers };

  return fetch(input, newInit);
}
