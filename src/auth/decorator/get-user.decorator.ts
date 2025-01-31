import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userDoc = request.userDoc || {}; // Ensure userDoc is an object
    return {
      ...userDoc,
      decodedToken: request.user,
    };
  },
);
