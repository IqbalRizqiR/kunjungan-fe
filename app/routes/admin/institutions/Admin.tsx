import { useEffect, useState } from 'react';
import { toast } from 'sonner';;
import AdminLayout from '../root';
import { api } from '~/components/lib/api';

interface PackageOption {
  id?: string;
  name: string;
  value: string;
  price: number;
}

interface Institution {
  id: string;
  name: string;
  isPaid: boolean;
  price: number;
  packages: PackageOption[];
}

const ManageInstitutions = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [name, setName] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState<number>(0);
  
  // Package management state
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
  const [packageName, setPackageName] = useState('');
  const [packageValue, setPackageValue] = useState('');
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [showPackageModal, setShowPackageModal] = useState(false);

  const fetchInstitutions = async () => {
    try {
      const res = await api.get('/institutions');
      setInstitutions(res.data);
    } catch (error) {
      toast.error('Failed to fetch institutions');
    }
  };

  const handleAddInstitution = async () => {
    if (!name) {
      toast.error('Institution name is required');
      return;
    }
    
    try {
      await api.post('/institutions', { 
        name, 
        isPaid, 
        price: isPaid ? price : 0 
      });
      toast.success('Institution Added');
      setName('');
      setIsPaid(false);
      setPrice(0);
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to add institution');
    }
  };

  const handleUpdateInstitution = async (id: string, updatedData: Partial<Institution>) => {
    try {
      await api.patch(`/institutions/${id}`, updatedData);
      toast.success('Institution Updated');
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to update institution');
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    if (!confirm('Are you sure you want to delete this institution?')) return;
    
    try {
      await api.delete(`/institutions/${id}`);
      toast.success('Institution Deleted');
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to delete institution');
    }
  };

  const handleAddPackage = async () => {
    if (!packageName || !packageValue || !selectedInstitutionId) {
      toast.error('All package fields are required');
      return;
    }
    
    try {
      await api.post(`/institutions/${selectedInstitutionId}/packages`, {
        name: packageName,
        value: packageValue,
        price: packagePrice
      });
      toast.success('Package Added');
      setPackageName('');
      setPackageValue('');
      setPackagePrice(0);
      setShowPackageModal(false);
      fetchInstitutions();
    } catch (error) {
      toast.error('Failed to add package');
    }
  };

  const openPackageModal = (institutionId: string) => {
    setSelectedInstitutionId(institutionId);
    setShowPackageModal(true);
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Institutions</h1>

      <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Add New Institution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Institution Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
              <span>Paid Institution</span>
            </label>
            {isPaid && (
              <input
                type="number"
                placeholder="Base Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border p-2 rounded"
                min="0"
              />
            )}
          </div>
        </div>
        <button
          onClick={handleAddInstitution}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Institution
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Base Price</th>
              <th className="p-3 text-left">Packages</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{institution.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    institution.isPaid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {institution.isPaid ? 'Paid' : 'Free'}
                  </span>
                </td>
                <td className="p-3">
                  {institution.isPaid ? `Rp ${institution.price?.toLocaleString('id-ID') || 0}` : 'Free'}
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    {institution.packages?.map((pkg, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded">
                        {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                      </div>
                    )) || <span className="text-gray-500">No packages</span>}
                    <button
                      onClick={() => openPackageModal(institution.id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      + Add Package
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDeleteInstitution(institution.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {institutions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No institutions found. Add your first institution above.
          </div>
        )}
      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Package</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Package Name"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Package Value/Code"
                value={packageValue}
                onChange={(e) => setPackageValue(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="Package Price"
                value={packagePrice}
                onChange={(e) => setPackagePrice(Number(e.target.value))}
                className="border p-2 rounded w-full"
                min="0"
              />
            </div>
            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleAddPackage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Package
              </button>
              <button
                onClick={() => {
                  setShowPackageModal(false);
                  setPackageName('');
                  setPackageValue('');
                  setPackagePrice(0);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageInstitutions;
