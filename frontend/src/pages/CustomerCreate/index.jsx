import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import PageHeader from '../../components/common/PageHeader';
import CustomerForm from '../../components/forms/CustomerForm';

function CustomerCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useContext(UIContext);

  async function handleSubmit(payload) {
    const customer = await customerService.createCustomer(payload);
    addActivityEntry({
      title: 'Customer created',
      description: `${customer.fullName} was added to the CRM.`,
    });
    addNotification({
      title: 'Customer created',
      message: `${customer.fullName} was added successfully.`,
      path: `/customers/${customer.id}`,
    });
    showToast({
      title: 'Customer created',
      description: `${customer.fullName} has been added to the CRM.`,
    });
    navigate(`/customers/${customer.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Customers', to: '/customers' },
          { label: 'Create customer' },
        ]}
        description="Create a new customer profile with contact details, pipeline stage, and account context."
        title="Create customer"
      />

      <CustomerForm
        description="Save a complete customer record so the team can track status, stage, and account history consistently."
        onCancel={() => navigate('/customers')}
        onSubmit={handleSubmit}
        submitLabel="Save customer"
        title="Customer information"
      />
    </div>
  );
}

export default CustomerCreatePage;
