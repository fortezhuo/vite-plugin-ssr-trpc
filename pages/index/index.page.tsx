import React from 'react'
import { Counter } from './Counter'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server/trpc';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
});

export { Page }

function Page() {
  const [data, setData] = React.useState("")

  React.useEffect(() => {
    ; (async function () {
      const data = await client.greet.query("World")
      setData(data.greeting)
    })()
  }, [])


  return (
    <>
      <h1>Welcome</h1>
      Greeting : <span>{data}</span>
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
