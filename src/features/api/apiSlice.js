import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query({
            // Original was: "query: () => '/todos',"
            query: ( { page, limit } ) => `/todos?_page=${page}&_limit=${limit}&_sort=id&_order=desc`,
            // Original was: "transformResponse: res => res.sort((a, b) => b.id - a.id), ""
            transformResponse(res, meta) {
                return ({ 
                            data: res, 
                            totalCount: Number(meta.response.headers.get('X-Total-Count')),
                            headerLink: String(meta.response.headers.get("Link"))
                        })
              },
            providesTags: ['Todos']
        }),
        addTodo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({
                url: `/todos/${id}`,
                method: 'DELETE',
                body: { id }    // original was: ＂body: id＂
            }),
            invalidatesTags: ['Todos']
        }),
    })
})

export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = apiSlice

/*
   How to get X-Total-Count header with RTK Query?
   https://stackoverflow.com/questions/70408411/how-to-get-x-total-count-header-with-rtk-query

   Pagination in a json-server API with the link header
   https://joshgoestoflatiron.medium.com/february-10-pagination-in-a-json-server-api-with-the-link-header-dea63eb0a835

   typicode/json-server
   https://github.com/typicode/json-server

   Pagination in React Tutorial with React Query, Hooks Examples
   https://youtu.be/9ZbdwL5NSuQ

   130 Motivational Quotes of the Day to Get you Motivated
   https://www.invajy.com/motivational-quotes-of-the-day/
*/