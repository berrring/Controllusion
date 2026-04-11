import { useContext, useState } from 'react';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { validateRegister } from '../../utils/validation';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/forms/FormField';

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
      await registerUser(values);
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
    <div className="page-shell flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="surface-panel order-2 mx-auto w-full max-w-xl p-8 sm:p-10 lg:order-1">
          <Link className="mb-8 inline-flex items-center gap-3" to="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-50 text-base font-extrabold text-brand-700">
              C
            </div>
            <div>
              <p className="font-extrabold text-brand-600">Controllusion</p>
              <p className="text-xs font-semibold text-muted">Create your workspace</p>
            </div>
          </Link>

          <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Create an account</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            Start with a new user account and move straight into the redesigned admin dashboard experience.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormField error={errors.fullName} htmlFor="fullName" label="Full name">
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" id="fullName" name="fullName" onChange={handleChange} placeholder="Jordan Blake" value={values.fullName} />
              </div>
            </FormField>

            <FormField error={errors.email} htmlFor="email" label="Email address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" id="email" name="email" onChange={handleChange} placeholder="jordan@company.com" type="email" value={values.email} />
              </div>
            </FormField>

            <FormField error={errors.password} htmlFor="password" label="Password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-11" id="password" name="password" onChange={handleChange} placeholder="Create a strong password" type="password" value={values.password} />
              </div>
            </FormField>

            <FormField error={errors.confirmPassword} htmlFor="confirmPassword" label="Confirm password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  type="password"
                  value={values.confirmPassword}
                />
              </div>
            </FormField>

            {submitError ? <div className="rounded-[18px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</div> : null}

            <Button fullWidth isLoading={submitting} size="lg" type="submit">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-sm font-semibold text-muted">
            Already have an account?{' '}
            <Link className="text-brand-600" to="/login">
              Login
            </Link>
          </p>
        </div>

        <div className="order-1 surface-panel overflow-hidden p-5 sm:p-6 lg:order-2">
          <div className="rounded-[28px] bg-[linear-gradient(180deg,#f7faff_0%,#eff4ff_100%)] p-5 sm:p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Get started</p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--text)]">
              Create a session and enter the updated dashboard kit without extra setup.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Registration activates a user session immediately, so the first screen after signup is the rebuilt Controllussion shell.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                'Shared blue-and-white admin theme',
                'Responsive dashboard and tables',
                'Products, inbox, and pricing pages',
                'Settings and account management views',
              ].map((item) => (
                <div className="rounded-[18px] bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-[0_20px_40px_-32px_rgba(17,24,39,0.18)]" key={item}>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-white/80 bg-white p-3 shadow-[0_28px_50px_-34px_rgba(17,24,39,0.18)]">
              <img alt="Dashboard preview" className="w-full rounded-[18px]" src="/figma-dashboard-preview.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
