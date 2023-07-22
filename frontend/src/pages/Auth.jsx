import React, { useState, useContext, useEffect } from 'react';
import authContext from '../context/auth-context';
import { Form, useActionData, useNavigation } from 'react-router-dom';
import classes from './Auth.module.css';
import Spinner from '../components/Spinner/Spinner';

const AuthPage = () => {

  const actionData = useActionData();
  const { state } = useNavigation();
  const [isLogin, setLogin] = useState(true);
  const authCtx = useContext(authContext);
  const { errors = null } = actionData ? actionData : {};

  useEffect(() => {
    if (isLogin && !authCtx.token && actionData && actionData.login && !actionData.errors) {
      authCtx.login(actionData.login)
    }
  }, [isLogin, authCtx, actionData]);

  return (
    <>
      {state === 'loading' && <Spinner />}
      <Form className={classes['auth-form']} method='POST'>
        <h1>{isLogin ? 'Login' : 'Signup'}</h1>
        {
          (!isLogin && actionData && actionData.createUser) &&
          <h3 style={{ textAlign: 'center', color: 'green' }}>Your now successfully signed up, Please Login.</h3>
        }
        <div className={`${classes['form-control']} ${(errors && errors['email']) && classes['invalid']}`}>
          <label htmlFor='email'>E-Mail</label>
          <input type='email' id='email' name='email' required />
          {(errors && errors['email']) && <p>{errors['email'].message}</p>}
        </div>
        <div className={`${classes['form-control']} ${(errors && errors['password']) && classes['invalid']}`}>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' name='password' required />
          {(errors && errors['password']) && <p>{errors['password'].message}</p>}
        </div>
        <div className={classes['form-actions']}>
          <button onClick={() => { setLogin(!isLogin) }} type='button'>{isLogin ? 'Signup' : 'Login'}</button>
          <button type='submit' name='intent' value={isLogin ? 'Login' : 'Signup'}>Submit</button>
        </div>
        {
          (errors && Object.keys(errors).length > 0) &&
          <ul className={classes['form-errors']}>
            {Object.keys(errors).map(key =>
              ((!['email', 'password'].includes(key)) && <li key={key}>{errors[key].message}</li>)
            )}
          </ul>
        }
      </Form>
    </>
  )
}

export default AuthPage

export async function action({ request, params, context }) {
  const errors = {}
  try {
    const formData = await request.formData();
    const intent = formData.get('intent');
    const userData = {
      email: formData.get('email'),
      password: formData.get('password')
    }
    if (userData.email.trim().length === 0 || userData.password.trim().length === 0) {
      if (userData.email.trim().length === 0) {
        errors['email'] = {
          field: 'email',
          message: 'Email is required'
        }
      }
      if (userData.password.trim().length === 0) {
        errors['password'] = {
          field: 'password',
          message: 'Password is required'
        }
      }
      return { errors }
    }
    if (userData.password.trim().length < 8) {
      errors['password'] = {
        field: 'password',
        message: 'Password should be of minimum 8 characters'
      }
      return { errors }
    }
    let requestBody
    if (intent === 'Login') {
      requestBody = {
        query: `
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
            }
        } 
        `,
        variables: {
          email: userData.email,
          password: userData.password
        }
      }
    }
    if (intent === 'Signup') {
      requestBody = {
        query: `
            mutation createUser($email: String!, $password: String!){
                  createUser(userInput: { email: $email, password: $password }) {
                      _id
                      email
              }
          } 
        `,
        variables: {
          email: userData.email,
          password: userData.password
        }
      };
    }
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed!');
    }
    const result = await response.json();
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((error, index) => { errors[`${index}-${index}`] = { message: error.message } });
      return { errors };
    }
    return result.data
  } catch (err) {
    errors['error'] = { message: 'user creation failed!' };
    return { errors };
  }
}
