import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
          status: entity.status === 'closed' ? 'Dicht' :
            entity.status === 'maintenance' ? 'Storing' :
              undefined
        }));
      },
    }),
  }),
});

export const { useGetQueueTimesQuery } = api; 