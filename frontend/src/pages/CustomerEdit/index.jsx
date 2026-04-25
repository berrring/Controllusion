import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import CustomerForm from '../../components/forms/CustomerForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Button from '../../components/ui/Button';

function CustomerEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useContext(UIContext);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCustomer() {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load this customer.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomer();
  }, [id]);

  async function handleSubmit(payload) {
    const updatedCustomer = await customerService.updateCustomer(id, payload);
    addActivityEntry({
      title: 'Customer updated',
      description: `${updatedCustomer.fullName} record was updated successfully.`,
    });
    addNotification({
      title: 'Customer updated',
      message: `${updatedCustomer.fullName} details were updated.`,
      path: `/customers/${id}`,
    });
    showToast({
      title: 'Customer profile updated successfully',
      description: `${updatedCustomer.fullName} is up to date.`,
    });
    navigate(`/customers/${id}`);
  }

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error || !customer) {
    return <ErrorState description={error || 'Customer not found.'} onRetry={loadCustomer} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link className="text-[11px] font-bold text-[#52627b]" to="/customers">
            ← Back to Accounts
          </Link>
          <h1 className="mt-2 text-[24px] font-black tracking-[-0.05em] text-[#14213d]">Edit Customer: {customer.company}</h1>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate(`/customers/${id}`)} variant="secondary">
            Cancel
          </Button>
          <Button form="customer-edit-proxy" onClick={() => document.querySelector('form')?.requestSubmit()} type="button">
            Save Changes
          </Button>
        </div>
      </div>

      <CustomerForm initialValues={customer} onCancel={() => navigate(`/customers/${id}`)} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}

export default CustomerEditPage;
