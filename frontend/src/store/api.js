import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const STATUS_MESSAGES = {
  operating: undefined, // No message needed when operating
  closed: 'Gesloten',
  maintenance: 'Storing',
  refurbishment: 'Onderhoud',
  down: 'Storing',
};

// Use different base URL in development
const baseUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/'  // Development server URL
  : '/';  // Production URL

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getQueueTimes: builder.query({
      query: () => 'api/v1/queues/',
      pollingInterval: 60000, // Poll every minute to keep queue times up-to-date
      transformResponse: (response) => {
        return response.entities.attractions.map(entity => ({
          name: entity.name,
          waitTime: entity.waitTime,
          singleRider: entity.singleRider?.waitTime,
          status: STATUS_MESSAGES[entity.status]
        }));
      },
    }),
    getOpeningHours: builder.query({
      query: () => 'api/v1/opening-hours/',
      pollingInterval: 3600000, // Poll once per hour (60 minutes * 60 seconds * 1000ms)
    }),
  }),
});

export const {
  useGetQueueTimesQuery,
  useGetOpeningHoursQuery,
} = api; 