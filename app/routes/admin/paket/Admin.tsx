import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';

interface PackageOption {
  id: string;
  name: string;
  value: string;
  price: number;
  institution?: {
    id: string;
    name: string;
  };
}

interface Institution {
  id: string;
  name: string;
  isPaid: boolean;
  price: number;
}

const ManagePackages = () => {
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  
  // Edit state
  const [editingPackage, setEditingPackage] = useState<PackageOption | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/institutions/packages');
      console.log(res.data)
      setPackages(res.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    }
  };

  const fetchInstitutions = async () => {
    try {
      const res = await api.get('/institutions');
      setInstitutions(res.data);
    } catch (error) {
      toast.error('Failed to fetch institutions');
    }
  };

  const handleAddPackage = async () => {
    if (!name || !value || !selectedInstitutionId) {
      toast.error('All fields are required');
      return;
    }
    
    try {
      await api.post(`/institutions/${selectedInstitutionId}/packages`, {
        name,
        value,
        price
      });
      toast.success('Package Added');
      setName('');
      setValue('');
      setPrice(0);
      setSelectedInstitutionId('');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to add package');
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage || !name || !value) {
      toast.error('All fields are required');
      return;
    }
    
    try {
      await api.patch(`/packages/${editingPackage.id}`, {
        name,
        value,
        price,
        institutionId: selectedInstitutionId
      });
      toast.success('Package Updated');
      setShowEditModal(false);
      resetForm();
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update package');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Package Deleted');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const openEditModal = (pkg: PackageOption) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setValue(pkg.value);
    setPrice(pkg.price);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setName('');
    setValue('');
    setPrice(0);
    setSelectedInstitutionId('');
    setEditingPackage(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  useEffect(() => {
    fetchPackages();
    fetchInstitutions();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Packages</h1>

      <div className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Add New Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedInstitutionId}
            onChange={(e) => setSelectedInstitutionId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Institution</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Package Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          
          <input
            type="text"
            placeholder="Package Value/Code"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded w-full"
          />
          
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-2 rounded w-full"
            min="0"
          />
        </div>
        
        <button
          onClick={handleAddPackage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Package
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Institution</th>
              <th className="p-3 text-left">Package Name</th>
              <th className="p-3 text-left">Value/Code</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">
                    {pkg.institution?.name || 'Unknown Institution'}
                  </span>
                </td>
                <td className="p-3">{pkg.name}</td>
                <td className="p-3">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {pkg.value}
                  </code>
                </td>
                <td className="p-3">
                  <span className="font-semibold text-green-600">
                    Rp {pkg.price.toLocaleString('id-ID')}
                  </span>
                </td>
                <td className="p-3">
                  <div className="space-x-2">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
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
        
        {packages.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No packages found. Add your first package above.
          </div>
        )}
      </div>

      {/* Edit Package Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Package</h3>
            <div className="space-y-4">
              <select
                value={selectedInstitutionId}
                onChange={(e) => setSelectedInstitutionId(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Institution</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Package Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              
              <input
                type="text"
                placeholder="Package Value/Code"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="border p-2 rounded w-full"
              />
              
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="border p-2 rounded w-full"
                min="0"
              />
            </div>
            
            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleUpdatePackage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update Package
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Packages</h3>
          <p className="text-2xl font-bold text-blue-600">{packages.length}</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Average Price</h3>
          <p className="text-2xl font-bold text-green-600">
            Rp {packages.length > 0 
              ? Math.round(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length).toLocaleString('id-ID')
              : '0'
            }
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Institutions with Packages</h3>
          <p className="text-2xl font-bold text-purple-600">
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManagePackages;
