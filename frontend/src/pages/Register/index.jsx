import { useContext, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegister } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';

function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { showToast } = useContext(UIContext);
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = useMemo(
    () => [
      {
        label: 'At least 8 characters',
        valid: values.password.length >= 8,
      },
      {
        label: 'Contains a number or symbol',
        valid: /[\d\W_]/.test(values.password),
      },
      {
        label: 'Contains an uppercase letter',
        valid: /[A-Z]/.test(values.password),
      },
    ],
    [values.password],
  );

  const passwordScore = passwordChecks.filter((item) => item.valid).length;
  const passwordLabel = ['Weak', 'Fair', 'Strong'][Math.max(passwordScore - 1, 0)] || 'Weak';

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateRegister(values);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const currentUser = await registerUser(values);
      addActivityEntry({
        title: 'Account created',
        description: `${currentUser.fullName} created a new Controllusion account.`,
      });
      addNotification({
        title: 'Account ready',
        message: `${currentUser.fullName} joined Controllusion successfully.`,
        path: '/dashboard',
      });
      showToast({
        title: 'Account created',
        description: 'Your session is active and ready to use.',
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8ff] px-4 py-10">
      <div className="pointer-events-none absolute left-[-10%] top-[6%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(76,66,232,0.16)_0%,rgba(76,66,232,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(111,179,255,0.18)_0%,rgba(111,179,255,0)_72%)]" />

      <div className="relative w-full max-w-[430px] overflow-hidden rounded-[24px] border border-[#edf0fb] bg-white shadow-[0_30px_70px_-42px_rgba(17,24,39,0.24)]">
        <div className="h-1.5 bg-[linear-gradient(90deg,#4c42e8_0%,#5a49f4_100%)]" />

        <div className="px-7 py-8 sm:px-8 sm:py-9">
          <div className="text-center">
            <h1 className="text-[34px] font-black tracking-[-0.04em] text-[#1f2a44] sm:text-[36px]">Controllusion</h1>
            <p className="mt-2 text-sm text-[#7b86a0]">Create your workspace</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4f5d78]">Full Name</span>
              <input
                className="h-12 w-full rounded-[12px] border border-[#cdd6e8] bg-white px-4 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#c0c7d7] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                name="fullName"
                onChange={handleChange}
                placeholder="Jane Doe"
                value={values.fullName}
              />
              {errors.fullName ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.fullName}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4f5d78]">Email Address</span>
              <input
                className="h-12 w-full rounded-[12px] border border-[#cdd6e8] bg-white px-4 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#c0c7d7] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                name="email"
                onChange={handleChange}
                placeholder="jane@company.com"
                type="email"
                value={values.email}
              />
              {errors.email ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.email}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4f5d78]">Password</span>
              <div className="relative">
                <input
                  className="h-12 w-full rounded-[12px] border border-[#cdd6e8] bg-[#eef2ff] px-4 pr-12 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#c0c7d7] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                  name="password"
                  onChange={handleChange}
                  placeholder="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                />
                <button
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[10px] text-[#7f8aa3] transition hover:bg-white"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                <span className="text-[#4f5d78]">{passwordLabel}</span>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2">
                {passwordChecks.map((item) => (
                  <span
                    className={`h-1.5 rounded-full ${item.valid ? 'bg-[#4c42e8]' : 'bg-[#dbe5ff]'}`}
                    key={item.label}
                  />
                ))}
              </div>

              <div className="mt-3 space-y-1.5">
                {passwordChecks.map((item) => {
                  const Icon = item.valid ? CheckCircle2 : XCircle;
                  return (
                    <div
                      className={`flex items-center gap-2 text-xs font-medium ${
                        item.valid ? 'text-[#2e8a5f]' : 'text-[#ec6a60]'
                      }`}
                      key={item.label}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {errors.password ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.password}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#4f5d78]">Confirm Password</span>
              <input
                className="h-12 w-full rounded-[12px] border border-[#cdd6e8] bg-white px-4 text-sm font-medium text-[#1f2a44] outline-none transition placeholder:text-[#c0c7d7] focus:border-[#cfd7ff] focus:ring-4 focus:ring-[#eef2ff]"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Repeat password"
                type="password"
                value={values.confirmPassword}
              />
              {errors.confirmPassword ? <span className="mt-2 block text-sm font-medium text-[#ec6a60]">{errors.confirmPassword}</span> : null}
            </label>

            {submitError ? <div className="rounded-[14px] bg-[#fff1ee] px-4 py-3 text-sm font-medium text-[#ec6a60]">{submitError}</div> : null}

            <button
              className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(76,66,232,0.85)] transition hover:translate-y-[-1px]"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
              {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#7b86a0]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#4c42e8]" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
