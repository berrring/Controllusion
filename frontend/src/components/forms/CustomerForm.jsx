import { useEffect, useState } from 'react';
import { Building2, CircleDollarSign, MapPin, NotebookPen, Sparkles } from 'lucide-react';
import { STAGE_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { validateCustomer } from '../../utils/validation';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormField from './FormField';

const defaultValues = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  status: 'New',
  stage: 'Lead',
  dealValue: '',
  notes: '',
  location: '',
  industry: '',
};

function CustomerForm({
  initialValues = defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save customer',
  title,
  description,
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCustomer(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit({
        ...values,
        dealValue: Number(values.dealValue),
      });
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Unable to save customer right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-black text-[var(--text)]">{title}</h2>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField error={errors.fullName} htmlFor="fullName" label="Full name">
              <Input id="fullName" name="fullName" onChange={handleChange} placeholder="Ava Collins" value={values.fullName} />
            </FormField>

            <FormField error={errors.email} htmlFor="email" label="Email">
              <Input id="email" name="email" onChange={handleChange} placeholder="ava@company.com" type="email" value={values.email} />
            </FormField>

            <FormField error={errors.phone} htmlFor="phone" label="Phone">
              <Input id="phone" name="phone" onChange={handleChange} placeholder="+1 (555) 000-0000" value={values.phone} />
            </FormField>

            <FormField error={errors.company} htmlFor="company" label="Company">
              <Input id="company" name="company" onChange={handleChange} placeholder="Northline Studio" value={values.company} />
            </FormField>

            <FormField htmlFor="jobTitle" label="Job title">
              <Input id="jobTitle" name="jobTitle" onChange={handleChange} placeholder="Revenue Director" value={values.jobTitle} />
            </FormField>

            <FormField htmlFor="industry" label="Industry">
              <Input id="industry" name="industry" onChange={handleChange} placeholder="Software" value={values.industry} />
            </FormField>

            <FormField error={errors.status} htmlFor="status" label="Status">
              <Select id="status" name="status" onChange={handleChange} value={values.status}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField error={errors.stage} htmlFor="stage" label="Stage">
              <Select id="stage" name="stage" onChange={handleChange} value={values.stage}>
                {STAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField error={errors.dealValue} htmlFor="dealValue" label="Deal value">
              <Input
                id="dealValue"
                min="0"
                name="dealValue"
                onChange={handleChange}
                placeholder="24000"
                type="number"
                value={values.dealValue}
              />
            </FormField>

            <FormField htmlFor="location" label="Location">
              <Input id="location" name="location" onChange={handleChange} placeholder="Austin, TX" value={values.location} />
            </FormField>

            <div className="md:col-span-2">
              <FormField error={errors.notes} htmlFor="notes" label="Notes">
                <Input
                  as="textarea"
                  id="notes"
                  name="notes"
                  onChange={handleChange}
                  placeholder="Add customer context, priorities, and follow-up notes..."
                  rows={5}
                  value={values.notes}
                />
              </FormField>
            </div>
          </div>

          {submitError ? <div className="mt-6 rounded-[18px] bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitError}</div> : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={onCancel} type="button" variant="secondary">
              Cancel
            </Button>
            <Button isLoading={submitting} type="submit">
              {submitLabel}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-brand-50 text-brand-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-black text-[var(--text)]">Live summary</p>
                <p className="mt-1 text-sm text-muted">This side panel mirrors the account context while you edit.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-4">
                <p className="text-sm font-semibold text-muted">Contact</p>
                <p className="mt-2 text-lg font-black text-[var(--text)]">{values.fullName || 'Customer name'}</p>
                <p className="mt-1 text-sm text-muted">{values.email || 'name@company.com'}</p>
              </div>

              <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  Company
                </div>
                <p className="mt-2 text-base font-black text-[var(--text)]">{values.company || 'Company name'}</p>
                <p className="mt-1 text-sm text-muted">{values.jobTitle || 'Job title'}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <CircleDollarSign className="h-4 w-4 text-brand-600" />
                    Deal value
                  </div>
                  <p className="mt-2 text-base font-black text-[var(--text)]">
                    {values.dealValue ? `$${Number(values.dealValue).toLocaleString()}` : '$0'}
                  </p>
                </div>

                <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <MapPin className="h-4 w-4 text-brand-600" />
                    Location
                  </div>
                  <p className="mt-2 text-base font-black text-[var(--text)]">{values.location || 'Location'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted">
              <NotebookPen className="h-4 w-4 text-brand-600" />
              Notes preview
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              {values.notes ||
                'Use notes to capture immediate context, next actions, handoff details, and the signals the next teammate should see before speaking to this customer.'}
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default CustomerForm;
