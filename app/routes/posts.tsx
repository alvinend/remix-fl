import { Outlet } from 'remix'

const Posts = () => {
  return (
    <div>
      <h1>This is the posts route</h1>
      <Outlet />
    </div>
  )
}

export default Posts
