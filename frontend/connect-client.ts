import { MiddlewareContext } from '@hilla/frontend';
import { MiddlewareNext } from '@hilla/frontend';
import { ConnectClient } from '@hilla/frontend';

const client = new ConnectClient({
  prefix: 'connect',
  middlewares: [
    async (context: MiddlewareContext, next: MiddlewareNext) => {
      document.body.style.cursor = 'wait';
      const response = await next(context);
      document.body.style.cursor = 'default';
      return response;
    },
  ],
});

export default client;
