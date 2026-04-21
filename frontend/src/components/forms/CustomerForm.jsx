import { useEffect, useState } from 'react';
import { STAGE_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { validateCustomer } from '../../utils/validation';
import Badge from '../ui/Badge';
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
      <Card className="rounded-[18px]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-[36px] font-black tracking-tight text-[#1f2a44]">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6d7890]">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={values.dealValue > 50000 ? 'warning' : 'default'}>
              {values.dealValue > 50000 ? 'HIGH VALUE' : 'STANDARD'}
            </Badge>
            <Badge variant={values.status === 'Active' || values.status === 'VIP' ? 'brand' : 'default'}>{values.status.toUpperCase()}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.62fr_1.38fr]">
        <div className="space-y-12 px-2 pt-2">
          <div>
            <h3 className="text-[28px] font-black text-[#1f2a44]">Basic Information</h3>
            <p className="mt-2 text-sm leading-7 text-[#6d7890]">
              Primary contact details for this account. This information is used for billing and critical communications.
            </p>
          </div>

          <div>
            <h3 className="text-[28px] font-black text-[#1f2a44]">Company Details</h3>
            <p className="mt-2 text-sm leading-7 text-[#6d7890]">
              Organizational context to help us tailor our services and understand account scale.
            </p>
          </div>

          <div>
            <h3 className="text-[28px] font-black text-[#1f2a44]">Internal Details</h3>
            <p className="mt-2 text-sm leading-7 text-[#6d7890]">
              Add pipeline metadata and internal notes so the next teammate has the right context before reaching out.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-[18px]">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField error={errors.fullName} htmlFor="fullName" label="Full Name">
                  <Input id="fullName" name="fullName" onChange={handleChange} value={values.fullName} />
                </FormField>
              </div>

              <FormField error={errors.email} htmlFor="email" label="Email Address">
                <Input id="email" name="email" onChange={handleChange} type="email" value={values.email} />
              </FormField>

              <FormField error={errors.phone} htmlFor="phone" label="Phone Number">
                <Input id="phone" name="phone" onChange={handleChange} value={values.phone} />
              </FormField>
            </div>
          </Card>

          <Card className="rounded-[18px]">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FormField error={errors.company} htmlFor="company" label="Legal Company Name">
                  <Input id="company" name="company" onChange={handleChange} value={values.company} />
                </FormField>
              </div>

              <FormField htmlFor="industry" label="Industry Sector">
                <Select id="industry" name="industry" onChange={handleChange} value={values.industry}>
                  <option value="">Select industry</option>
                  {['Software', 'Manufacturing', 'Financial Services', 'Healthcare', 'Retail', 'AI', 'SaaS'].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField htmlFor="jobTitle" label="Company Size / Job Title">
                <Input id="jobTitle" name="jobTitle" onChange={handleChange} value={values.jobTitle} />
              </FormField>

              <div className="md:col-span-2">
                <FormField htmlFor="location" label="Website URL / Location">
                  <Input id="location" name="location" onChange={handleChange} value={values.location} />
                </FormField>
              </div>
            </div>
          </Card>

          <Card className="rounded-[18px]">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField error={errors.status} htmlFor="status" label="Status">
                <Select id="status" name="status" onChange={handleChange} value={values.status}>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField error={errors.stage} htmlFor="stage" label="Pipeline Stage">
                <Select id="stage" name="stage" onChange={handleChange} value={values.stage}>
                  {STAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField error={errors.dealValue} htmlFor="dealValue" label="Deal Value">
                <Input id="dealValue" min="0" name="dealValue" onChange={handleChange} type="number" value={values.dealValue} />
              </FormField>

              <FormField htmlFor="industryReadOnly" label="Industry Label">
                <Input disabled id="industryReadOnly" value={values.industry || 'Not specified'} />
              </FormField>

              <div className="md:col-span-2">
                <FormField error={errors.notes} htmlFor="notes" label="Internal Notes">
                  <Input as="textarea" id="notes" name="notes" onChange={handleChange} rows={5} value={values.notes} />
                </FormField>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {submitError ? <div className="rounded-[16px] bg-[#fff1ee] px-4 py-3 text-sm text-[#ec6a60]">{submitError}</div> : null}

      <div className="sticky bottom-4 z-10 flex justify-end gap-3 rounded-[18px] border border-[var(--border)] bg-white/92 px-4 py-4 backdrop-blur sm:px-6">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel Changes
        </Button>
        <Button isLoading={submitting} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CustomerForm;
