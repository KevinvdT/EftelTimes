import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const STATUS_MESSAGES = {
  operating: undefined, // No message needed when operating
  closed: 'Dicht',
  maintenance: 'Storing',
  refurbishment: 'Onderhoud'
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (builder) => ({
    getQueueTimes: builder.query({
      query: () => 'api/v1/queues/',
      transformResponse: (response) => {
        return response.entities.attractions.map(entity => ({
          name: entity.name,
          waitTime: entity.waitTime,
          singleRider: entity.singleRider?.waitTime,
          status: STATUS_MESSAGES[entity.status]
        }));
      },
    }),
  }),
});

export const { useGetQueueTimesQuery } = api; 