import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import PageHeader from '../../components/common/PageHeader';
import CustomerForm from '../../components/forms/CustomerForm';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';

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
    showToast({
      title: 'Customer updated',
      description: `${updatedCustomer.fullName} has been updated successfully.`,
    });
    navigate(`/customers/${id}`);
  }

  if (loading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (error || !customer) {
    return <ErrorState description={error || 'Customer not found.'} onRetry={loadCustomer} title="Unable to edit customer" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Customers', to: '/customers' },
          { label: customer.fullName, to: `/customers/${id}` },
          { label: 'Edit' },
        ]}
        description="Update customer details, stage, status, and notes while keeping the CRM record current."
        title={`Edit ${customer.fullName}`}
      />

      <CustomerForm
        description="Refine account details and preserve a realistic editing workflow with validation and success feedback."
        initialValues={customer}
        onCancel={() => navigate(`/customers/${id}`)}
        onSubmit={handleSubmit}
        submitLabel="Update customer"
        title="Edit customer information"
      />
    </div>
  );
}

export default CustomerEditPage;
