import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
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
      title: 'Customer created successfully',
      description: `${customer.fullName} is ready for follow-up.`,
    });
    navigate(`/customers/${customer.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold text-[#52627b]">Accounts › Create New Customer</p>
          <h1 className="mt-2 text-[24px] font-black tracking-[-0.05em] text-[#14213d]">Create New Customer</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Enter the details below to onboard a new account into the CRM.</p>
        </div>
      </div>

      <CustomerForm onCancel={() => navigate('/customers')} onSubmit={handleSubmit} submitLabel="Save Customer" />
    </div>
  );
}

export default CustomerCreatePage;
