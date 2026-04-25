import { useEffect, useState } from 'react';
import { Building2, Lightbulb, MapPin, UserRound } from 'lucide-react';
import { STAGE_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { validateCustomer } from '../../utils/validation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormField from './FormField';

const defaultValues = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  status: 'Active',
  stage: 'Qualified',
  dealValue: '',
  notes: '',
  location: '',
  industry: '',
};

function Section({ children, icon: Icon, subtitle, title }) {
  return (
    <Card className="rounded-[9px] p-6">
      <div className="mb-5 flex items-center gap-3 border-b border-[#edf2fb] pb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#eef2ff] text-[#4c42e8]">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div>
          <h3 className="text-[14px] font-black text-[#14213d]">{title}</h3>
          {subtitle ? <p className="mt-1 text-[11px] font-medium text-[#70809a]">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </Card>
  );
}

function CustomerForm({ initialValues = defaultValues, onSubmit, onCancel, submitLabel = 'Save Customer' }) {
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
    <form className="grid gap-6 xl:grid-cols-[1fr_260px]" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <Section icon={Building2} subtitle="Basic information about the organization." title="Company Profile">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField error={errors.company} htmlFor="company" label="Company Name *">
                <Input id="company" name="company" onChange={handleChange} placeholder="e.g. Acme Corporation" value={values.company} />
              </FormField>
            </div>
            <FormField htmlFor="industry" label="Industry">
              <Select id="industry" name="industry" onChange={handleChange} value={values.industry}>
                <option value="">Select industry...</option>
                {['Technology', 'Software', 'Manufacturing', 'Financial Services', 'Healthcare', 'Retail', 'AI', 'SaaS'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField htmlFor="jobTitle" label="Company Size">
              <Input id="jobTitle" name="jobTitle" onChange={handleChange} placeholder="Select size" value={values.jobTitle} />
            </FormField>
            <div className="md:col-span-2">
              <FormField htmlFor="notes" label="Website">
                <Input id="notes" name="notes" onChange={handleChange} placeholder="https://www.example.com" value={values.notes} />
              </FormField>
            </div>
          </div>
        </Section>

        <Section icon={UserRound} subtitle="Primary point of communication for this account." title="Key Contact">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField error={errors.fullName} htmlFor="fullName" label="Full Name *">
              <Input id="fullName" name="fullName" onChange={handleChange} placeholder="Jane Doe" value={values.fullName} />
            </FormField>
            <FormField htmlFor="status" label="Current Stage">
              <Select id="status" name="status" onChange={handleChange} value={values.status}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField error={errors.email} htmlFor="email" label="Email Address *">
              <Input id="email" name="email" onChange={handleChange} placeholder="contact@company.com" type="email" value={values.email} />
            </FormField>
            <FormField error={errors.phone} htmlFor="phone" label="Phone Number">
              <Input id="phone" name="phone" onChange={handleChange} placeholder="+1 (555) 000-0000" value={values.phone} />
            </FormField>
          </div>
        </Section>

        <Section icon={MapPin} subtitle="Primary billing and physical address." title="Headquarters">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="md:col-span-4">
              <FormField htmlFor="location" label="Street Address">
                <Input id="location" name="location" onChange={handleChange} placeholder="123 Innovation Way, Suite 400" value={values.location} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField htmlFor="city" label="City">
                <Input id="city" name="city" placeholder="San Francisco" />
              </FormField>
            </div>
            <FormField htmlFor="state" label="State / Province">
              <Input id="state" name="state" placeholder="CA" />
            </FormField>
            <FormField htmlFor="zip" label="ZIP / Postal">
              <Input id="zip" name="zip" placeholder="94105" />
            </FormField>
          </div>
        </Section>
      </div>

      <div className="space-y-5">
        <Card className="rounded-[9px] bg-[#eef4ff] p-5">
          <h3 className="text-[12px] font-black uppercase tracking-[0.08em] text-[#52627b]">Account Setup Tips</h3>
          <div className="mt-4 space-y-4 text-[11px] leading-5 text-[#52627b]">
            {[
              'Ensure the company domain matches their primary email addresses for automatic lead association.',
              'Designating a key contact now helps prioritize communication workflows later.',
              'You can add secondary addresses and billing details from Account Settings after creation.',
            ].map((tip) => (
              <div className="flex gap-2" key={tip}>
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4c42e8]" />
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[9px] bg-[#eef4ff] p-5">
          <h3 className="text-[12px] font-black uppercase tracking-[0.08em] text-[#52627b]">Pipeline Details</h3>
          <div className="mt-4 space-y-4">
            <FormField error={errors.stage} htmlFor="stage" label="Stage">
              <Select id="stage" name="stage" onChange={handleChange} value={values.stage}>
                {STAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField error={errors.dealValue} htmlFor="dealValue" label="Projected Value">
              <Input id="dealValue" min="0" name="dealValue" onChange={handleChange} placeholder="45000" type="number" value={values.dealValue} />
            </FormField>
          </div>
        </Card>
      </div>

      {submitError ? <div className="xl:col-span-2 rounded-[8px] bg-[#fff1ee] px-4 py-3 text-sm text-[#ec6a60]">{submitError}</div> : null}

      <div className="xl:col-span-2 flex justify-end gap-3">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button isLoading={submitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CustomerForm;
