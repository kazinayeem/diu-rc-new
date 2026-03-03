import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/*
  Central RTK Query API for client-side API calls.
  This file exposes generated hooks (useGetXQuery/useCreateXMutation) for resources.

  NOTE: types are intentionally permissive (any) so this can be integrated quickly.
  You can replace `any` with proper interfaces from `lib/models/*` later.
*/

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: [
    "Members",
    "Events",
    "Seminars",
    "Notices",
    "Posts",
    "Projects",
    "ResearchPapers",
    "Workshops",
    "MemberRegistrations",
    "Gallery",
    "AdminStats",
    "Uploads",
  ],
  keepUnusedDataFor: 60, // Keep cached data for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: false, // Don't refetch when window regains focus
  refetchOnReconnect: true, // Refetch when connection is restored
  endpoints: (builder) => ({
    
    getMembers: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `members${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["Members"],
    }),
    getMember: builder.query<any, string>({
      query: (id) => `members/${id}`,
      providesTags: (result, error, id) => [{ type: "Members", id }],
    }),
    createMember: builder.mutation<any, any>({
      query: (body) => ({ url: "members", method: "POST", body }),
      invalidatesTags: ["Members"],
    }),
    updateMember: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `members/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Members", id }],
    }),
    deleteMember: builder.mutation<any, string>({
      query: (id) => ({ url: `members/${id}`, method: "DELETE" }),
      invalidatesTags: ["Members"],
    }),

    
    getEvents: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `events${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["Events"],
    }),
    getEvent: builder.query<any, string>({
      query: (id) => `events/${id}`,
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),
    createEvent: builder.mutation<any, any>({
      query: (body) => ({ url: "events", method: "POST", body }),
      invalidatesTags: ["Events"],
    }),
    updateEvent: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `events/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Events", id }],
    }),
    deleteEvent: builder.mutation<any, string>({
      query: (id) => ({ url: `events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Events"],
    }),

    // Seminars - using unified Event model
    getSeminars: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `events?type=seminar${opts?.query ? `&${opts.query}` : ""}`,
      providesTags: ["Events"],
    }),
    getSeminar: builder.query<any, string>({ 
      query: (id) => `events/${id}`,
      providesTags: ["Events"],
    }),
    createSeminar: builder.mutation<any, any>({
      query: (body) => ({ 
        url: "events", 
        method: "POST", 
        body: { ...body, type: "seminar" } 
      }),
      invalidatesTags: ["Events"],
    }),
    updateSeminar: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ 
        url: `events/${id}`, 
        method: "PUT", 
        body: { ...body, type: "seminar" } 
      }),
      invalidatesTags: ["Events"],
    }),
    deleteSeminar: builder.mutation<any, string>({
      query: (id) => ({ url: `events/${id}`, method: "DELETE" }),
      invalidatesTags: ["Events"],
    }),

    
    getNotices: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `notices${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["Notices"],
    }),
    getMarqueeNotice: builder.query<any, void>({
      query: () => "notices/marquee",
      providesTags: ["Notices"],
    }),
    createNotice: builder.mutation<any, any>({
      query: (body) => ({ url: "notices", method: "POST", body }),
      invalidatesTags: ["Notices"],
    }),
    updateNotice: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `notices/${id}`, method: "PUT", body }),
      invalidatesTags: ["Notices"],
    }),
    deleteNotice: builder.mutation<any, string>({
      query: (id) => ({ url: `notices/${id}`, method: "DELETE" }),
      invalidatesTags: ["Notices"],
    }),

    
    getPosts: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `posts${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["Posts"],
    }),
    getPost: builder.query<any, string>({ query: (id) => `posts/${id}` }),
    deletePost: builder.mutation<any, string>({
      query: (id) => ({ url: `posts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Posts"],
    }),

    
    getProjects: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `projects${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<any, any>({
      query: (body) => ({ url: "projects", method: "POST", body }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `projects/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Projects", id }],
    }),
    deleteProject: builder.mutation<any, string>({
      query: (id) => ({ url: `projects/${id}`, method: "DELETE" }),
      invalidatesTags: ["Projects"],
    }),

    
    getResearchPapers: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `research-papers${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: ["ResearchPapers"],
    }),
    createResearchPaper: builder.mutation<any, any>({
      query: (body) => ({ url: "research-papers", method: "POST", body }),
      invalidatesTags: ["ResearchPapers"],
    }),
    updateResearchPaper: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `research-papers/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "ResearchPapers", id }],
    }),
    deleteResearchPaper: builder.mutation<any, string>({
      query: (id) => ({ url: `research-papers/${id}`, method: "DELETE" }),
      invalidatesTags: ["ResearchPapers"],
    }),

    
    getMemberRegistrations: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `member-registrations${opts?.query ? `?${opts.query}` : ""}`,
      providesTags: (result) => 
        result?.data
          ? [
              ...result.data.map(({ _id }: any) => ({ type: "MemberRegistrations" as const, id: _id })),
              { type: "MemberRegistrations", id: "LIST" },
            ]
          : [{ type: "MemberRegistrations", id: "LIST" }],
      keepUnusedDataFor: 30, // Keep this specific query cache for 30 seconds
    }),
    createMemberRegistration: builder.mutation<any, any>({
      query: (body) => ({ url: `member-registrations`, method: "POST", body }),
      invalidatesTags: [{ type: "MemberRegistrations", id: "LIST" }],
    }),
    getMemberRegistration: builder.query<any, string>({
      query: (id) => `member-registrations/${id}`,
    }),
    updateMemberRegistration: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `member-registrations/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MemberRegistrations", id },
        { type: "MemberRegistrations", id: "LIST" },
      ],
    }),
    deleteMemberRegistration: builder.mutation<any, string>({
      query: (id) => ({ url: `member-registrations/${id}`, method: "DELETE" }),
      invalidatesTags: (result, error, id) => [
        { type: "MemberRegistrations", id },
        { type: "MemberRegistrations", id: "LIST" },
      ],
    }),

    
    getWorkshopRegistrations: builder.query<any, string>({
      
      query: (workshopId) => `workshops/${workshopId}/registrations`,
      providesTags: (result, error, workshopId) => [{ type: "Workshops", id: workshopId }],
    }),
    deleteWorkshopRegistration: builder.mutation<any, string>({
      query: (registrationId) => ({ url: `workshops/registrations/${registrationId}`, method: "DELETE" }),
      
      invalidatesTags: ["Workshops", "Events"],
    }),
    updateWorkshopRegistration: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `workshops/registrations/${id}`, method: "PUT", body }),
      invalidatesTags: ["Workshops", "Events"],
    }),
    
    createWorkshopRegistration: builder.mutation<any, { workshopId: string; body: any }>({
      query: ({ workshopId, body }) => ({ url: `workshops/${workshopId}/register`, method: "POST", body }),
      
      invalidatesTags: (result, error, { workshopId }) => [
        { type: "Workshops", id: workshopId },
        { type: "Events", id: workshopId },
      ],
    }),

    // Additional endpoints for public pages
    getBootcamps: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `events?type=bootcamp${opts?.query ? `&${opts.query}` : ""}`,
      providesTags: ["Events"],
    }),
    getWorkshops: builder.query<any, { query?: string | undefined }>({
      query: (opts) => `events?type=workshop${opts?.query ? `&${opts.query}` : ""}`,
      providesTags: ["Events"],
    }),
    getEventBySlug: builder.query<any, string>({
      query: (slug) => `events?slug=${slug}`,
      transformResponse: (response: any) => ({
        ...response,
        data: response.data?.[0],
      }),
      providesTags: (result, error, slug) => [{ type: "Events", id: slug }],
    }),
    createRegistration: builder.mutation<any, { eventId: string; name: string; email: string; phone: string }>({
      query: ({ eventId, name, email, phone }) => ({
        url: `member-registrations`,
        method: "POST",
        body: {
          eventId,
          name,
          email,
          phone,
        },
      }),
      invalidatesTags: ["MemberRegistrations"],
    }),

    
    uploadFile: builder.mutation<any, FormData>({
      query: (body) => ({ url: "upload", method: "POST", body }),
      
    }),

    
    getAdminStats: builder.query<any, void>({
      query: () => "admin/stats",
      providesTags: ["AdminStats"],
    }),
  }),
});


export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,

  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,

  useGetSeminarsQuery,
  useGetSeminarQuery,
  useCreateSeminarMutation,
  useUpdateSeminarMutation,
  useDeleteSeminarMutation,

  useGetBootcampsQuery,
  useGetWorkshopsQuery,
  useGetEventBySlugQuery,
  useCreateRegistrationMutation,

  useGetNoticesQuery,
  useGetMarqueeNoticeQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,

  useGetPostsQuery,
  useGetPostQuery,
  useDeletePostMutation,

  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,

  useGetResearchPapersQuery,
  useCreateResearchPaperMutation,
  useUpdateResearchPaperMutation,
  useDeleteResearchPaperMutation,

  useGetMemberRegistrationsQuery,
  useGetMemberRegistrationQuery,
  useUpdateMemberRegistrationMutation,
  useDeleteMemberRegistrationMutation,
  useCreateMemberRegistrationMutation,

  useGetWorkshopRegistrationsQuery,
  useDeleteWorkshopRegistrationMutation,
  useUpdateWorkshopRegistrationMutation,
  useCreateWorkshopRegistrationMutation,

  useUploadFileMutation,

  useGetAdminStatsQuery,
} = api;

export default api;
