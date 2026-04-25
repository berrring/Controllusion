import { useContext, useState } from 'react';
import { Eye, EyeOff, Link2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { addActivityEntry, addNotification } from '../../services/storage';
import { validateLogin } from '../../utils/validation';
import { UIContext } from '../../context/UIContext';
import { APP_BRAND } from '../../utils/constants';

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

  async function handleForgotPassword() {
    try {
      const response = await authService.requestPasswordReset(values.email);
      setValues((current) => ({
        ...current,
        password: response.temporaryPassword || current.password,
      }));
      showToast({
        title: 'Temporary password issued',
        description: response.message,
        type: 'info',
      });
    } catch (error) {
      showToast({
        title: 'Reset failed',
        description: error.response?.data?.message || 'Unable to reset this password.',
        type: 'error',
      });
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f9ff] px-4 py-10 font-ui">
      <div className="pointer-events-none absolute left-[-6%] top-0 h-[380px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(222,233,255,0.92)_0%,rgba(247,249,255,0)_67%)]" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-5%] h-[360px] w-[430px] rounded-full bg-[radial-gradient(circle,rgba(217,231,255,0.95)_0%,rgba(247,249,255,0)_68%)]" />

      <div className="relative w-full max-w-[340px] rounded-[10px] bg-white px-8 py-9 shadow-[0_22px_60px_-42px_rgba(31,42,68,0.35)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#4c42e8] text-white shadow-[0_12px_24px_-16px_rgba(76,66,232,0.8)]">
          <Link2 className="h-5 w-5" />
        </div>

        <div className="mt-5 text-center">
          <h1 className="text-[24px] font-black tracking-[-0.04em] text-[#17223b]">{APP_BRAND.name}</h1>
          <p className="mt-1.5 text-[12px] font-semibold text-[#70809a]">Sign in to your workspace</p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-[12px] font-semibold text-[#52627b]">Email Address</span>
            <input
              className="h-10 w-full rounded-[7px] border border-transparent bg-[#f6f8ff] px-3.5 text-[13px] font-medium text-[#17223b] outline-none placeholder:text-[#c4ccdc] focus:border-[#dce5fb]"
              name="email"
              onChange={handleChange}
              placeholder="name@company.com"
              type="email"
              value={values.email}
            />
            {errors.email ? <span className="mt-1 block text-[10px] font-medium text-[#ec6a60]">{errors.email}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-[12px] font-semibold text-[#52627b]">Password</span>
            <div className="relative">
              <input
                className="h-10 w-full rounded-[7px] border border-transparent bg-[#f6f8ff] px-3.5 pr-9 text-[13px] font-medium text-[#17223b] outline-none placeholder:text-[#c4ccdc] focus:border-[#dce5fb]"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
              />
              <button className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#8c99ae]" onClick={() => setShowPassword((current) => !current)} type="button">
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
            {errors.password ? <span className="mt-1 block text-[10px] font-medium text-[#ec6a60]">{errors.password}</span> : null}
          </label>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <label className="flex items-center gap-1.5 font-medium text-[#70809a]">
              <input
                checked={rememberMe}
                className="h-3 w-3 rounded border-[#dfe7f4] accent-[#4c42e8]"
                onChange={() => setRememberMe((current) => !current)}
                type="checkbox"
              />
              Remember Me
            </label>
            <button className="font-bold text-[#4c42e8]" onClick={handleForgotPassword} type="button">
              Forgot Password?
            </button>
          </div>

          {submitError ? <div className="rounded-[6px] bg-[#fff1ee] px-3 py-2 text-[10px] font-medium text-[#ec6a60]">{submitError}</div> : null}

          <button
            className="h-10 w-full rounded-[7px] bg-[#4c42e8] text-[13px] font-bold text-white shadow-[0_12px_24px_-16px_rgba(76,66,232,0.85)] transition hover:bg-[#4339d6]"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-7 text-center text-[12px] font-medium text-[#70809a]">
          Don&apos;t have an account?{' '}
          <Link className="font-bold text-[#4c42e8]" to="/register">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
