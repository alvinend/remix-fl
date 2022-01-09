import { Request } from "@remix-run/node"
import { ActionFunction, json, Link, redirect, useActionData } from "remix"
import { db } from "~/utils/db.server"
import { getUser } from "~/utils/session.server"

const validateTitle = (title: string) => {
  if (typeof title !== 'string' || title.length < 3) {
    return 'Title should be at least 3 characters long'
  }
}

const validateBody = (body: string) => {
  if (typeof body !== 'string' || body.length < 10) {
    return 'Body should be at least 10 characters long'
  }
}

export const action: ActionFunction = async ({
  request
}) => {
  const form = await request.formData()
  const title = form.get('title') as string
  const body = form.get('body') as string
  const user = await getUser(request)

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body)
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return json({
      fieldErrors,
      fields: { title, body}
    }, { status: 400 })
  }


  const post = await db.post.create({
    data: {
      title,
      body,
      userId: user!.id
    }
  })

  return redirect(`/posts/${post.id}`)
}

type CreatePostForm = {
  title: string,
  body: string
}

const NewPosts = () => {
  const {
    fieldErrors,
    fields
  } = useActionData<{
    fieldErrors: CreatePostForm,
    fields: CreatePostForm
  }>() || {}

  return (
    <>
      <div className="page-header">
        <h1>New Posts</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name='title' id='title' defaultValue={fields?.title} />
          </div>

          <div className="error">
            <p>{fieldErrors?.title && fieldErrors?.title}</p>
          </div>

          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name='body' id='body' defaultValue={fields?.body} />
          </div>

          <div className="error">
            <p>{fieldErrors?.body && fieldErrors?.body}</p>
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}

export default NewPosts
