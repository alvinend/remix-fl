import { Link, useLoaderData } from "remix"
import { db } from "~/utils/db.server"

type Post = {
  id: number
  title: string
  body: string
  createdAt: string
}

export const loader = async () => {
  const posts = await db.post.findMany({
    take: 20,
    select: {
      id: true,
      title: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return {
    posts
  }
}

const PostItems = () => {
  const { posts } = useLoaderData()

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to='/posts/new' className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link to={String(post.id)}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostItems
