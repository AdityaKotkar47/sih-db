import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Plus, Users, Hotel, Trash2 } from 'lucide-react';

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
      // Existing bulk data can be removed or retained as needed
    ]
  },
  itenaries: {
    name: 'Itenaries',
    icon: Hotel,
    fields: [
      { name: 'location', type: 'text', label: 'Location', required: true },
      {
        name: 'hotels',
        type: 'array',
        label: 'Hotels',
        fields: [
          { name: 'name', type: 'text', label: 'Hotel Name', required: true },
          { name: 'address', type: 'text', label: 'Address', required: true },
          { name: 'map_url', type: 'url', label: 'Map URL', required: true },
          { name: 'image_url', type: 'url', label: 'Image URL', required: true },
          { name: 'ratings', type: 'number', label: 'Ratings', required: true, min: 0, max: 5, step: 0.1 }
        ]
      },
      {
        name: 'tourist_spots',
        type: 'array',
        label: 'Tourist Spots',
        fields: [
          { name: 'name', type: 'text', label: 'Spot Name', required: true },
          { name: 'address', type: 'text', label: 'Address', required: true },
          { name: 'map_url', type: 'url', label: 'Map URL', required: true },
          { name: 'image_url', type: 'url', label: 'Image URL', required: true },
          { name: 'ratings', type: 'number', label: 'Ratings', required: true, min: 0, max: 5, step: 0.1 }
        ]
      },
      {
        name: 'restaurants',
        type: 'array',
        label: 'Restaurants',
        fields: [
          { name: 'name', type: 'text', label: 'Restaurant Name', required: true },
          { name: 'address', type: 'text', label: 'Address', required: true },
          { name: 'map_url', type: 'url', label: 'Map URL', required: true },
          { name: 'image_url', type: 'url', label: 'Image URL', required: true },
          { name: 'ratings', type: 'number', label: 'Ratings', required: true, min: 0, max: 5, step: 0.1 }
        ]
      },
      {
        name: 'market_places',
        type: 'array',
        label: 'Market Places',
        fields: [
          { name: 'name', type: 'text', label: 'Market Place Name', required: true },
          { name: 'address', type: 'text', label: 'Address', required: true },
          { name: 'map_url', type: 'url', label: 'Map URL', required: true },
          { name: 'image_url', type: 'url', label: 'Image URL', required: true },
          { name: 'ratings', type: 'number', label: 'Ratings', required: true, min: 0, max: 5, step: 0.1 }
        ]
      }
    ],
    bulkData: [
      // Remove or leave empty as bulk add is being removed
    ]
  }
  // Remove other collections if any
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
      if (field.type === 'array') {
        initialData[field.name] = [];
      } else {
        initialData[field.name] = '';
      }
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

  const handleNestedInputChange = (e, fieldName, index, nestedField) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedArray = [...(prev[fieldName] || [])];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: value
      };
      return {
        ...prev,
        [fieldName]: updatedArray
      };
    });
  };

  const addNestedItem = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), {}]
    }));
  };

  const removeNestedItem = (fieldName, index) => {
    setFormData(prev => {
      const updatedArray = [...(prev[fieldName] || [])];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [fieldName]: updatedArray
      };
    });
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
        if (field.type === 'array') {
          initialData[field.name] = [];
        } else {
          initialData[field.name] = '';
        }
      });
      setFormData(initialData);
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const CollectionIcon = COLLECTIONS[selectedCollection].icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CollectionIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Data Entry</h2>
          <p className="mt-2 text-gray-600">Add entries to Pravaah database</p>
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
            field.type !== 'array' ? (
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
            ) : (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {(formData[field.name] || []).map((item, index) => (
                  <div key={index} className="mb-4 border p-4 rounded-lg relative">
                    <button
                      type="button"
                      onClick={() => removeNestedItem(field.name, index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      title="Remove Item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    {field.fields.map(nestedField => (
                      <div key={nestedField.name} className="mb-2">
                        <label htmlFor={`${field.name}.${index}.${nestedField.name}`} className="block text-sm font-medium text-gray-700">
                          {nestedField.label}
                        </label>
                        <input
                          type={nestedField.type}
                          id={`${field.name}.${index}.${nestedField.name}`}
                          name={nestedField.name}
                          value={item[nestedField.name] || ''}
                          onChange={(e) => handleNestedInputChange(e, field.name, index, nestedField)}
                          required={nestedField.required}
                          min={nestedField.min}
                          max={nestedField.max}
                          step={nestedField.step}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addNestedItem(field.name)}
                  className="mt-2 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {field.label.slice(0, -1)}
                </button>
              </div>
            )
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