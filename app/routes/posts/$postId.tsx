import { Post, User } from "@prisma/client"
import { ActionFunction, Link, LoaderFunction, redirect, useLoaderData, useParams } from "remix"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

export const loader: LoaderFunction = async ({ params, request }) => {
  const post = await db.post.findUnique({
    where: {
      id: params.postId
    }
  })

  if (!post) { throw new Error('Post not found') }

  const author = await db.user.findUnique({
    where: {
      id: post?.userId
    }
  })

  const currentUser = await getUser(request)

  return { post, author, currentUser }
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()

  if (form.get('_method') === 'delete') {
    const user = await getUser(request)
    const post = await db.post.findUnique({
      where: {
        id: params.postId
      }
    })
    
    if (!post) { throw new Error('Page not found')}
    if (user && post.userId === user.id) {
      await db.post.delete({
        where: {
          id: params.postId
        }
      })  
    }
  
    return redirect('/posts')
  }
}

const Post = () => {
  const { post, author, currentUser } = useLoaderData<{
    post: Post
    author: User
    currentUser: User
  }>()

  return (
    <div>
      <div className="page-header">
        <h1>{post.title} (By {author.username})</h1>
        <Link to='/posts' className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        {post.body}
      </div>

      {author.id === currentUser.id && (
        <div className="page-footer">
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Post
