import { useContext, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Grid2x2, LockKeyhole, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addActivityEntry, addNotification } from '../../services/storage';
import { validateLogin } from '../../utils/validation';
import { UIContext } from '../../context/UIContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const { showToast } = useContext(UIContext);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateLogin(values);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const currentUser = await loginUser(values);
      addActivityEntry({
        title: 'Signed in',
        description: `${currentUser.fullName} signed in to Controllusion.`,
      });
      addNotification({
        title: 'Welcome back',
        message: `Signed in as ${currentUser.fullName}.`,
        path: '/dashboard',
      });
      showToast({
        title: 'Welcome back',
        description: 'Your CRM workspace is ready.',
      });
      navigate(redirectTo, { replace: true, state: { rememberMe } });
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8ff] px-4 py-10">
      <div className="pointer-events-none absolute left-[-10%] top-[6%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(76,66,232,0.16)_0%,rgba(76,66,232,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(111,179,255,0.18)_0%,rgba(111,179,255,0)_72%)]" />

      <div className="relative w-full max-w-[420px] rounded-[24px] border border-[#edf0fb] bg-white px-7 py-8 shadow-[0_30px_70px_-42px_rgba(17,24,39,0.24)] sm:px-8 sm:py-9">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-white shadow-[0_14px_28px_-18px_rgba(76,66,232,0.75)] sm:hidden">
          <Grid2x2 className="h-5 w-5" />
        </div>

        <div className="text-center">
          <h1 className="text-[34px] font-black tracking-[-0.04em] text-[#1f2a44] sm:text-[36px]">Controllusion</h1>
          <p className="mt-2 text-sm text-[#7b86a0]">Secure Enterprise Hub Access</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#4f5d78]">Email address</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa5bd]" />
              <input
                className="h-12 w-full rounded-[12px] border border-[#edf0fb] bg-white pl-11 pr-4 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#bcc4d5] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                name="email"
                onChange={handleChange}
                placeholder="name@company.com"
                type="email"
                value={values.email}
              />
            </div>
            {errors.email ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.email}</span> : null}
          </label>

          <label className="block">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[#4f5d78]">Password</span>
              <button className="text-xs font-semibold text-[#4c42e8]" type="button">
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa5bd]" />
              <input
                className="h-12 w-full rounded-[12px] border border-[#edf0fb] bg-white pl-11 pr-12 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#bcc4d5] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
              />
              <button
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[10px] text-[#7f8aa3] transition hover:bg-[#f6f8ff]"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.password}</span> : null}
          </label>

          <label className="flex items-center gap-2 text-sm text-[#6d7890]">
            <input
              checked={rememberMe}
              className="h-4 w-4 rounded border-[var(--border)] accent-[#4c42e8]"
              onChange={() => setRememberMe((current) => !current)}
              type="checkbox"
            />
            <span>Remember Me</span>
          </label>

          {submitError ? <div className="rounded-[14px] bg-[#fff1ee] px-4 py-3 text-sm font-medium text-[#ec6a60]">{submitError}</div> : null}

          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(76,66,232,0.85)] transition hover:translate-y-[-1px]"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
            {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <div className="mt-7 border-t border-[#edf0fb] pt-6 sm:hidden">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#a0aac0]">Or continue with</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="h-11 rounded-[12px] border border-[#edf0fb] bg-white text-sm font-semibold text-[#1f2a44]" type="button">
              Google
            </button>
            <button className="h-11 rounded-[12px] border border-[#edf0fb] bg-white text-sm font-semibold text-[#1f2a44]" type="button">
              Apple
            </button>
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-[#7b86a0]">
          Don&apos;t have an account?{' '}
          <Link className="font-semibold text-[#4c42e8]" to="/register">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
