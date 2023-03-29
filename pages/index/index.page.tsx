import React from 'react'
import { Counter } from './Counter'
import { trpc } from '../../trpc'

export { Page }

function Page() {
  const [data, setData] = React.useState("")
  const client = trpc.useContext()

  React.useEffect(() => {
    ; (async function () {
      const data = await client.greet.fetch("World")
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
