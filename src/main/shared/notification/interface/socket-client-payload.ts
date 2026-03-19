export type PayloadForSocketClient = {
  sub: string;
  email: string;
  userUpdates: boolean;
  userRegistration: boolean;
  createBranch: boolean;
  createHuddle: boolean;
  useTemplate: boolean;
  createSessions: boolean;
};
