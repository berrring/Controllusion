import { useContext, useState } from 'react';
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
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#5c84f7] px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-8%] top-[12%] h-[280px] w-[280px] rounded-[90px] bg-white/6" />
        <div className="absolute right-[-4%] top-[8%] h-[360px] w-[320px] rounded-[110px] bg-[#6d93ff]/45" />
        <div className="absolute bottom-[-10%] left-[36%] h-[420px] w-[220px] rounded-[110px] bg-[#6a91ff]/35" />
      </div>
      <div className="relative w-full max-w-[460px] rounded-[30px] bg-white px-10 py-12 shadow-[0_30px_90px_-45px_rgba(17,24,39,0.55)]">
        <p className="text-center text-2xl font-black tracking-[-0.03em] text-[#20253a]">Login to Account</p>
        <p className="mt-3 text-center text-sm font-semibold text-[#8b93a8]">Please enter your email and password to continue</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#5f6a85]">Email address:</span>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="email" onChange={handleChange} placeholder="esteban_schiller@gmail.com" type="email" value={values.email} />
            {errors.email ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.email}</span> : null}
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#5f6a85]">Password</span>
            </div>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="password" onChange={handleChange} placeholder="........" type="password" value={values.password} />
            {errors.password ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.password}</span> : null}
          </div>

          {submitError ? <div className="rounded-[12px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{submitError}</div> : null}

          <button className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#5c84f7] text-sm font-extrabold text-white transition hover:bg-[#4f78ef]" disabled={submitting} type="submit">
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-[#8b93a8]">
          Don&apos;t have an account?{' '}
          <Link className="font-extrabold text-[#5c84f7]" to="/register">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
