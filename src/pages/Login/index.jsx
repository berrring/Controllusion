import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { validateLogin } from '../../utils/validation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/forms/FormField';
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
      await loginUser(values);
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
    <div className="page-shell flex min-h-screen items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="surface-panel mx-auto w-full max-w-xl p-8 sm:p-10">
          <Link className="mb-8 inline-flex items-center gap-3" to="/">
            <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-50 text-base font-extrabold text-brand-700">
              C
            </div>
            <div>
              <p className="font-extrabold text-brand-600">Controllusion</p>
              <p className="text-xs font-semibold text-muted">Sign in to your workspace</p>
            </div>
          </Link>

          <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Welcome back</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            Use your workspace email and password to continue into the rebuilt Controllusion admin dashboard.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormField error={errors.email} htmlFor="email" label="Email address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@company.com"
                  type="email"
                  value={values.email}
                />
              </div>
            </FormField>

            <FormField error={errors.password} htmlFor="password" label="Password">
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-11"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                />
              </div>
            </FormField>

            <div className="flex items-center justify-between text-sm font-semibold">
              <button
                className="text-brand-600"
                onClick={() =>
                  showToast({
                    title: 'Demo reset flow',
                    description: 'Use admin@controllusion.com / Admin@123 or create a new account from the register page.',
                    type: 'info',
                  })
                }
                type="button"
              >
                Forgot password?
              </button>
              <Link className="text-muted transition hover:text-brand-600" to="/register">
                Create an account
              </Link>
            </div>

            {submitError ? <div className="rounded-[18px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</div> : null}

            <Button fullWidth isLoading={submitting} size="lg" type="submit">
              Login
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="surface-panel overflow-hidden p-5 sm:p-6">
          <div className="rounded-[28px] bg-[linear-gradient(180deg,#f7faff_0%,#eff4ff_100%)] p-5 sm:p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-600">Dashboard preview</p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--text)]">
              The whole project now follows the same bright admin direction as the Figma dashboard kit.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              Sidebar, topbar, products, inbox, pricing, calendar, tables, and settings now share one visual language.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                'Admin demo: admin@controllusion.com / Admin@123',
                'User demo: sara@controllusion.com / User@1234',
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

export default LoginPage;
