import React, { useState } from 'react';

const predefinedUsers = [
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
];

const App = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add user');

      showAlert('success', 'User added successfully!');
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const user of predefinedUsers) {
        try {
          const response = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
          });

          if (!response.ok) throw new Error(`Failed to add user ${user.username}`);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Error adding user ${user.username}:`, error);
        }
      }

      showAlert('success', `Added ${successCount} users successfully! ${errorCount ? `(${errorCount} failed)` : ''}`);
    } catch (error) {
      showAlert('error', 'Bulk add operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">User Data Entry</h2>
          <p className="mt-2 text-gray-600">Add users to Firestore database</p>
        </div>

        {alert.show && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <span className={`text-xl ${
              alert.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {alert.type === 'success' ? '✔' : '✘'}
            </span>
            <p className={alert.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {alert.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Add User
            </button>

            <button
              type="button"
              onClick={handleBulkAdd}
              disabled={loading}
              className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Bulk Add
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