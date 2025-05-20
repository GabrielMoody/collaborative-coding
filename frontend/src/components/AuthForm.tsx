'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (type === 'register' && password !== password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    try {
      let body;
      if (type === 'register') {
        body = { username : username, password : password, password_confirmation: password_confirmation };
      } else {
        body = { username, password };
      }
      const res = await fetch(`${apiBaseUrl}/auth/${type}`, {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if(res.ok && type === 'login') {
        const data = await res.json();
        localStorage.setItem('access_token', data.access_token);
      }

      if (!res.ok) throw new Error(await res.text());
      router.push('/code');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              {type === 'login' ? 'Log in' : 'Sign up'}
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="my-12 border-b text-center">
                <div
                  className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  {type === 'login'
                    ? 'Log in with your username and password'
                    : 'Sign up with a username and password'}
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {type === 'register' && (
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password Confirmation"
                      value={password_confirmation}
                      onChange={(e) => setPassword_confirmation(e.target.value)}
                    />
                  )}
                  <button
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">
                      {type === 'login' ? 'Log In' : 'Sign Up'}
                    </span>
                  </button>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by templatana&apos;s
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Terms of Service
                    </a>
                    and its
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Privacy Policy
                    </a>
                  </p>
                  <p className="mt-6 text-sm text-gray-600 text-center">
                    {type === 'login' ? (
                      <>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-indigo-500 hover:underline">
                          Sign up
                        </Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-500 hover:underline">
                          Log in
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}