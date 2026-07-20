export const cancelContestRegistrationRequest = (contestId: number | string) => ({
  url: `/api/contests/${contestId}/cancel-registration/`,
  method: 'DELETE' as const,
});
