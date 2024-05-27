import { MiddlewareContext } from '@vaadin/hilla-frontend';
import { MiddlewareNext } from '@vaadin/hilla-frontend';
import { ConnectClient } from '@vaadin/hilla-frontend';

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
      const loggedIn = localStorage.getItem('loggedIn');
      if (loggedIn && response.status === 401) {
        localStorage.removeItem('loggedIn');
        window.location.href = '/login';
        window.location.reload();
      }
      return response;
    },
  ]
});

export default client;
