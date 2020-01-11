import React from 'react';
// import { isLoggedIn } from '../auth/auth';

export default () => {
  // const content = isLoggedIn() === null ? 'logn in' : isLoggedIn;
  return (
    <>
      <form method="post">
        <label htmlFor="username">
          username:
          <br />
          <input type="text" name="username" />
        </label>
        <br />
        <label htmlFor="password">
          password:
          <br />
          <input type="password" name="password" />
        </label>
      </form>
    </>
  );
};
