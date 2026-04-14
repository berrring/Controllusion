import { useContext, useState } from 'react';
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#5c84f7] px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[8%] h-[260px] w-[280px] rounded-[90px] bg-white/6" />
        <div className="absolute right-[-5%] top-[10%] h-[340px] w-[300px] rounded-[110px] bg-[#6d93ff]/45" />
        <div className="absolute bottom-[-10%] left-[34%] h-[420px] w-[220px] rounded-[110px] bg-[#6a91ff]/35" />
      </div>
      <div className="relative w-full max-w-[460px] rounded-[30px] bg-white px-10 py-12 shadow-[0_30px_90px_-45px_rgba(17,24,39,0.55)]">
        <p className="text-center text-2xl font-black tracking-[-0.03em] text-[#20253a]">Create an Account</p>
        <p className="mt-3 text-center text-sm font-semibold text-[#8b93a8]">
          Set up your account to enter the dashboard. New workspaces start empty so you can add your own customers and profile details.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#5f6a85]">Full Name</span>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="fullName" onChange={handleChange} placeholder="Jordan Blake" value={values.fullName} />
            {errors.fullName ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.fullName}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#5f6a85]">Email address</span>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="email" onChange={handleChange} placeholder="name@company.com" type="email" value={values.email} />
            {errors.email ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.email}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#5f6a85]">Password</span>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="password" onChange={handleChange} placeholder="Create a strong password" type="password" value={values.password} />
            {errors.password ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.password}</span> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#5f6a85]">Confirm Password</span>
            <input className="h-12 w-full rounded-[10px] border border-[#e7ebf3] bg-[#f7f9fd] px-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b6bfd0]" name="confirmPassword" onChange={handleChange} placeholder="Repeat your password" type="password" value={values.confirmPassword} />
            {errors.confirmPassword ? <span className="mt-2 block text-sm font-semibold text-[#ff6b6b]">{errors.confirmPassword}</span> : null}
          </label>

          {submitError ? <div className="rounded-[12px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{submitError}</div> : null}

          <button className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#5c84f7] text-sm font-extrabold text-white transition hover:bg-[#4f78ef]" disabled={submitting} type="submit">
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-[#8b93a8]">
          Already have an account?{' '}
          <Link className="font-extrabold text-[#5c84f7]" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
