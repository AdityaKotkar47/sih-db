import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Plus, Users, Hotel } from 'lucide-react';

// Collection configurations
const COLLECTIONS = {
  users: {
    name: 'Users',
    icon: Users,
    fields: [
      { name: 'username', type: 'text', label: 'Username', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'password', type: 'password', label: 'Password', required: true }
    ],
    bulkData: [
      { username: 'techExplorer42', email: 'tech.explorer42@email.com', password: 'TE#x9$mK2p' },
      { username: 'dataWizard89', email: 'data.wizard89@email.com', password: 'DW#8pL$n3m' },
      { username: 'cloudNinja55', email: 'cloud.ninja55@email.com', password: 'CN@5k#Jp7q' },
      { username: 'pixelMaster77', email: 'pixel.master77@email.com', password: 'PM&7n$Kw4x' },
      { username: 'codePhoenix23', email: 'code.phoenix23@email.com', password: 'CP#2j$Ht8v' },
      { username: 'webPioneer91', email: 'web.pioneer91@email.com', password: 'WP@9m#Ns5k' },
      { username: 'byteCrafter68', email: 'byte.crafter68@email.com', password: 'BC&6p$Lm3w' },
      { username: 'netArchitect34', email: 'net.architect34@email.com', password: 'NA#3h$Rt7j' },
      { username: 'appInventor82', email: 'app.inventor82@email.com', password: 'AI@8k#Mp4v' },
      { username: 'devSage45', email: 'dev.sage45@email.com', password: 'DS#4n$Bq9w' }
    ]
  },
  hotels: {
    name: 'Hotels',
    icon: Hotel,
    fields: [
      { name: 'name', type: 'text', label: 'Hotel Name', required: true },
      { name: 'image_url', type: 'url', label: 'Image URL', required: true },
      { name: 'map_url', type: 'url', label: 'Map URL', required: true },
      { name: 'rating', type: 'number', label: 'Rating', required: true, min: 0, max: 5, step: 0.1 }
    ],
    bulkData: [
      {
        name: "Hyatt Pune",
        image_url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/04/40/58/hyatt-pune.jpg?w=1000&h=-1&s=1",
        map_url: "https://maps.app.goo.gl/HSfEEK4uDwHSQs8NA",
        rating: 4.4
      },
      // Add more sample hotel data here if needed
    ]
  }
  // Add more collections here as needed
};

const App = () => {
  const [selectedCollection, setSelectedCollection] = useState('users');
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Initialize form data when collection changes
  React.useEffect(() => {
    const initialData = {};
    COLLECTIONS[selectedCollection].fields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, [selectedCollection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/${selectedCollection}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`Failed to add ${selectedCollection} entry`);

      showAlert('success', `${COLLECTIONS[selectedCollection].name} entry added successfully!`);
      
      // Reset form
      const initialData = {};
      COLLECTIONS[selectedCollection].fields.forEach(field => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    setLoading(true);
    const bulkData = COLLECTIONS[selectedCollection].bulkData;
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of bulkData) {
        try {
          const response = await fetch(`/api/${selectedCollection}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
          });

          if (!response.ok) throw new Error(`Failed to add ${selectedCollection} entry`);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error adding entry:`, error);
        }
      }

      showAlert('success', `Added ${successCount} entries successfully! ${errorCount ? `(${errorCount} failed)` : ''}`);
    } catch (error) {
      showAlert('error', 'Bulk add operation failed');
    } finally {
      setLoading(false);
    }
  };

  const CollectionIcon = COLLECTIONS[selectedCollection].icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CollectionIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Data Entry</h2>
          <p className="mt-2 text-gray-600">Add entries to Firestore database</p>
        </div>

        {/* Collection Selector */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Collection
          </label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {Object.entries(COLLECTIONS).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </div>

        {alert.show && (
          <div className={`mb-4 p-4 rounded-lg ${
            alert.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 inline mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 inline mr-2" />
            )}
            <span className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {alert.message}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          {COLLECTIONS[selectedCollection].fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </button>

            {COLLECTIONS[selectedCollection].bulkData && (
              <button
                type="button"
                onClick={handleBulkAdd}
                disabled={loading}
                className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Bulk Add
              </button>
            )}
          </div>
        </form>

        {loading && (
          <div className="mt-4 text-center text-gray-600">
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default App;