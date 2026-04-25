import { useContext, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegister } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import { APP_BRAND } from '../../utils/constants';

function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { showToast } = useContext(UIContext);
  const [values, setValues] = useState({
    fullName: '',
    workspaceName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = useMemo(
    () => [values.password.length >= 8, /[\d\W_]/.test(values.password), /[A-Z]/.test(values.password)],
    [values.password],
  );
  const passwordScore = passwordChecks.filter(Boolean).length;
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f9ff] px-4 py-10 font-ui">
      <div className="pointer-events-none absolute left-[-6%] top-0 h-[380px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(222,233,255,0.92)_0%,rgba(247,249,255,0)_67%)]" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-5%] h-[360px] w-[430px] rounded-full bg-[radial-gradient(circle,rgba(217,231,255,0.95)_0%,rgba(247,249,255,0)_68%)]" />

      <div className="relative w-full max-w-[260px] rounded-[7px] bg-white px-6 py-7 shadow-[0_22px_60px_-42px_rgba(31,42,68,0.35)]">
        <div className="text-center">
          <h1 className="text-[17px] font-black tracking-[-0.04em] text-[#17223b]">{APP_BRAND.name}</h1>
          <p className="mt-1 text-[10px] font-semibold text-[#70809a]">Set up your CRM workspace</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold text-[#52627b]">Full Name</span>
            <input className="h-8 w-full rounded-[5px] border border-[#edf2fb] bg-white px-3 text-[11px] outline-none focus:border-[#dce5fb]" name="fullName" onChange={handleChange} value={values.fullName} />
            {errors.fullName ? <span className="mt-1 block text-[10px] text-[#ec6a60]">{errors.fullName}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold text-[#52627b]">Workspace Name</span>
            <input className="h-8 w-full rounded-[5px] border border-[#edf2fb] bg-white px-3 text-[11px] outline-none focus:border-[#dce5fb]" name="workspaceName" onChange={handleChange} value={values.workspaceName} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold text-[#52627b]">Email Address</span>
            <input className="h-8 w-full rounded-[5px] border border-[#edf2fb] bg-white px-3 text-[11px] outline-none focus:border-[#dce5fb]" name="email" onChange={handleChange} type="email" value={values.email} />
            {errors.email ? <span className="mt-1 block text-[10px] text-[#ec6a60]">{errors.email}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold text-[#52627b]">Password</span>
            <div className="relative">
              <input
                className="h-8 w-full rounded-[5px] border border-[#edf2fb] bg-white px-3 pr-8 text-[11px] outline-none focus:border-[#dce5fb]"
                name="password"
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                value={values.password}
              />
              <button className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-[#8c99ae]" onClick={() => setShowPassword((current) => !current)} type="button">
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((index) => (
                <span className={`h-1 rounded-full ${index < passwordScore ? 'bg-[#4c42e8]' : 'bg-[#dfe7f4]'}`} key={index} />
              ))}
            </div>
            <p className="mt-1 text-right text-[9px] font-bold text-[#52627b]">{passwordLabel}</p>
            {errors.password ? <span className="mt-1 block text-[10px] text-[#ec6a60]">{errors.password}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold text-[#52627b]">Confirm Password</span>
            <input className="h-8 w-full rounded-[5px] border border-[#edf2fb] bg-white px-3 text-[11px] outline-none focus:border-[#dce5fb]" name="confirmPassword" onChange={handleChange} type="password" value={values.confirmPassword} />
            {errors.confirmPassword ? <span className="mt-1 block text-[10px] text-[#ec6a60]">{errors.confirmPassword}</span> : null}
          </label>

          {submitError ? <div className="rounded-[6px] bg-[#fff1ee] px-3 py-2 text-[10px] text-[#ec6a60]">{submitError}</div> : null}

          <button className="h-9 w-full rounded-[6px] bg-[#4c42e8] text-[11px] font-bold text-white shadow-[0_12px_24px_-16px_rgba(76,66,232,0.85)]" disabled={submitting} type="submit">
            {submitting ? 'Creating Workspace...' : 'Create Workspace +'}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] font-medium text-[#70809a]">
          Already have an account?{' '}
          <Link className="font-bold text-[#4c42e8]" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
