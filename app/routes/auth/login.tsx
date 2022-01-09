import { ActionFunction, json, useActionData } from "remix"
import { db } from "~/utils/db.server"
import { createUserSession, login, register } from "~/utils/session.server"

type AuthForm = {
  loginType: string
  username: string
  password: string
}

const badRequest = (data: {
  fields: AuthForm,
  fieldErrors: AuthForm
}) => (
  json(data, { status: 400 })
)

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const loginType = form.get('loginType') as string
  const username = form.get('username') as string
  const password = form.get('password') as string
  
  const fields = {
    loginType,
    username,
    password
  }

  const fieldErrors = {
    loginType: '',
    username: !username || username?.length < 3 ? 'Username should be at least 3 characters long' : '',
    password: !password || password?.length < 3 ? 'Password should be at least 3 characters long' : '',
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors})
  }

  switch (loginType) {
    case 'login': {
      // Find User
      const user = await login({ username, password })

      // Check User
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: {
            ...fieldErrors,
            username: 'Invalid Credentials'
          }
        })
      }

      // Create User Session
      return createUserSession(user.id, '/posts')
    }
      
    case 'register': {
      // Check if user exists
      const userCheck = await db.user.findFirst({
        where: {
          username
        }
      })

      if (userCheck) {
        return badRequest({
          fields,
          fieldErrors: {
            ...fieldErrors,
            username: `User ${username} already exists`
          }
        })
      }

      // Create user
      const user = await register({
        username,
        password
      })

      if (!user) {
        return badRequest({
          fields,
          fieldErrors: {
            ...fieldErrors,
            username: `Something Went Wrong :(`
          }
        })
      }

      // Create user Session
      return createUserSession(user.id, '/posts')
    }
      
    default: {
      return badRequest({
        fields,
        fieldErrors
      })
    }
  }
}


const Login = () => {
  const { fields, fieldErrors } = useActionData<{
    fields: AuthForm,
    fieldErrors: AuthForm
  }>() || {}

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="POST">
          <fieldset>
              <legend>Login or Register</legend>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value='login'
                  defaultChecked={!fields?.loginType || fields?.loginType === 'login'}
                />
                Login
              </label>

              <label>
                <input
                  type="radio"
                  name="loginType"
                  value='register'
                  defaultChecked={fields?.loginType === 'register'}
                />
                Register
              </label>
          </fieldset>

          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" defaultValue={fields?.username} />
            <div className="error">
              <p>{fieldErrors?.username && fieldErrors?.username}</p>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" defaultValue={fields?.password} />
            <div className="error">
              <p>{fieldErrors?.password && fieldErrors?.password}</p>
            </div>
          </div>

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
