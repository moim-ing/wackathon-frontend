import { authHandlers } from './handlers/auth';
import { classesHandlers } from './handlers/classes';
import { participationHandlers } from './handlers/participation';
import { sessionsHandlers } from './handlers/sessions';
import { userHandlers } from './handlers/user';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...classesHandlers,
  ...sessionsHandlers,
  ...participationHandlers,
];
