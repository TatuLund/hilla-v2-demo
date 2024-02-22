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
      // const resp = response.clone();
      // resp.headers.forEach((value, key) => {
      //   console.log(key + ': ' + value);
      // });
      // resp.json().then((data) => {
      //   console.log(data);
      // });
      return response;
    },
  ]
});

export default client;
