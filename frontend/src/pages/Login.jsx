import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearAuthError } from '../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.password) next.password = 'Password is required';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) dispatch(loginUser(form));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#15191E] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-[#F6F4F0]">
            Roster<span className="text-[#D98E3F]">.</span>
          </h1>
          <p className="mt-1 text-sm text-[#9b9385]">Employee Management System</p>
        </div>

        <div className="rounded-xl bg-[#FBF9F6] p-6 shadow-xl">
          <h2 className="mb-4 font-display text-lg font-semibold text-[#15191E]">Log in to your account</h2>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#D98E3F] ${
                  fieldErrors.email ? 'border-red-400' : 'border-[#dcd6cb]'
                }`}
                placeholder="you@company.com"
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#6b6258]">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-[#D98E3F] ${
                  fieldErrors.password ? 'border-red-400' : 'border-[#dcd6cb]'
                }`}
                placeholder="••••••••"
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-md bg-[#15191E] px-4 py-2.5 text-sm font-medium text-[#F6F4F0] transition hover:bg-[#D98E3F] disabled:opacity-60"
            >
              {status === 'loading' ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-[#6b6258]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-[#15191E] hover:text-[#D98E3F]">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
