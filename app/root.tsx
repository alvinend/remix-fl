import { User } from "@prisma/client"
import { Outlet, LiveReload, Link, Links, Meta, ErrorBoundaryComponent, LoaderFunction, useLoaderData } from "remix"
import globalStyle from '~/styles/global.css'
import { getUser } from "./utils/session.server"

export const links = () => [{
  rel: 'stylesheet',
  href: globalStyle
}]

export const meta = () => ({
    description: 'A cool blog built with Remix',
    keyword: 'remix, cool'
})

export const loader: LoaderFunction = async ({
  request
}) => {
  const user = await getUser(request)
  
  return { user }
}

export default () => {
  return (
    <Document title="My Remix Blog">
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

const Document: React.FC<{
  children: JSX.Element
  title: string
}> = ({
  children,
  title
}) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <h1>{title}</h1>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

const Layout: React.FC<{
  children: JSX.Element | JSX.Element[]
}> = ({
  children
}) => {
  const { user } = useLoaderData<{user: User}>()

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav> 

      <div className="container">
        {children}
      </div>
    </>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error)
  return (
    <Document title="My Remix Blog">
      <Layout>
        <h1>Error</h1>
        <pre>{error.message}</pre>
      </Layout>
    </Document>
  )
}
