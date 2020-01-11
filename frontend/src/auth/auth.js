import { generate } from 'randomstring';
import { navigate } from 'gatsby';

const isBrowser = typeof window !== 'undefined';

// setInterval(() => {
//   auth.key = generate();
// }, 1800000);

const auth = {
  username: 'user',
  password: 'pass',
  key: generate(),
};

export const isLoggedIn = () => {
  if (isBrowser && localStorage.getItem('auth-key')) {
    const key = localStorage.getItem('auth-key');
    if (key) return key === auth.key;
  }
  return null;
};

export const handleLogin = ({ username, password }) => {
  if (username === auth.username && password === auth.password)
    localStorage.setItem('auth-key', auth.key);
};

export const logout = (callback = () => navigate('/')) => {
  localStorage.setItem('auth-key', null);
  callback();
};

