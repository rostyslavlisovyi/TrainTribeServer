const mockFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({})
});

export default mockFetch;
