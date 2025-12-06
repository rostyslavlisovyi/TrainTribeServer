export const getAuth = () => ({
  verifyIdToken: async () => ({
    uid: "test",
    user_id: "test",
    aud: "test"
  })
});

export type DecodedIdToken = Record<string, unknown>;
