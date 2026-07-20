export const startTestRequest = (testId: number) => ({
  url: `/api/tests/${testId}/start/`,
  method: 'POST' as const,
});

export const finishTestRequest = (testPassId: number) => ({
  url: `/api/test-pass/${testPassId}/finish/`,
  method: 'POST' as const,
});
