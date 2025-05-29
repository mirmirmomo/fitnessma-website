import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Eye, EyeOff, Calendar, Star, Trash2, Edit, Plus, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [actionLoading, setActionLoading] = useState(null);
  
  // New user form
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'client'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Coach form
  const [showCoachForm, setShowCoachForm] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [coachForm, setCoachForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    specialty: '',
    bio: '',
    hourly_rate: '',
    experience_years: '',
    available_days: 'Monday, Tuesday, Wednesday, Thursday, Friday',
    available_hours_start: '09:00',
    available_hours_end: '17:00'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, appointmentsResponse, coachesResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/appointments'),
        axios.get('/api/admin/coaches')
      ]);
      setUsers(usersResponse.data);
      setAppointments(appointmentsResponse.data);
      setCoaches(coachesResponse.data);
    } catch (error) {
      setError('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      await axios.patch(`/api/admin/users/${userId}/status`, {
        status: newStatus
      });
      await fetchData();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('admin.users.confirmDelete'))) {
      return;
    }

    setActionLoading(userId);
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      await axios.post('/api/admin/users', {
        email: userForm.email,
        password: userForm.password,
        first_name: userForm.firstName,
        last_name: userForm.lastName,
        role: userForm.role
      });
      
      setUserForm({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client'
      });
      setShowUserForm(false);
      await fetchData();
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateCoach = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      if (editingCoach) {
        // Update existing coach
        await axios.put(`/api/admin/coaches/${editingCoach.id}`, coachForm);
      } else {
        // Create new coach
        await axios.post('/api/admin/coaches', coachForm);
      }
      
      resetCoachForm();
      await fetchData();
      
    } catch (error) {
      console.error('Error saving coach:', error);
      alert(error.response?.data?.message || 'Failed to save coach');
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetCoachForm = () => {
    setCoachForm({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      specialty: '',
      bio: '',
      hourly_rate: '',
      experience_years: '',
      available_days: 'Monday, Tuesday, Wednesday, Thursday, Friday',
      available_hours_start: '09:00',
      available_hours_end: '17:00'
    });
    setShowCoachForm(false);
    setEditingCoach(null);
  };

  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    setCoachForm({
      email: coach.email,
      password: '', // Don't populate password for security
      first_name: coach.first_name,
      last_name: coach.last_name,
      specialty: coach.specialty,
      bio: coach.bio,
      hourly_rate: coach.hourly_rate.toString(),
      experience_years: coach.experience_years.toString(),
      available_days: coach.available_days,
      available_hours_start: coach.available_hours_start,
      available_hours_end: coach.available_hours_end
    });
    setShowCoachForm(true);
  };

  const handleDeleteCoach = async (coachId) => {
    if (!window.confirm(t('admin.coaches.confirmDeleteCoach'))) {
      return;
    }

    setActionLoading(coachId);
    try {
      await axios.delete(`/api/admin/coaches/${coachId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting coach:', error);
      alert(error.response?.data?.message || 'Failed to delete coach');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'coach':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchData} className="btn-primary">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: users.length,
    totalClients: users.filter(u => u.role === 'client').length,
    totalCoaches: coaches.length,
    blockedUsers: users.filter(u => u.status === 'blocked').length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('admin.title')}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.stats.totalUsers')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.stats.coaches')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCoaches}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.stats.appointments')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <EyeOff className="w-8 h-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('admin.stats.blockedUsers')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.blockedUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.userManagement')}
            </button>
            <button
              onClick={() => setActiveTab('coaches')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'coaches'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.coachManagement')}
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'appointments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('admin.tabs.appointments')}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={() => setShowUserForm(!showUserForm)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus size={16} />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Create User Form */}
              {showUserForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={userForm.firstName}
                        onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={userForm.lastName}
                        onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="client">Client</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="btn-primary disabled:opacity-50"
                      >
                        {formSubmitting ? 'Creating...' : 'Create User'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUserForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.status === 'blocked' ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleBlockUser(user.id, user.status)}
                              disabled={actionLoading === user.id}
                              className={`p-1 rounded ${
                                user.status === 'blocked'
                                  ? 'text-green-600 hover:text-green-900' 
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                            >
                              {user.status === 'blocked' ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-1 text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'coaches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Coach Management</h2>
                <button
                  onClick={() => setShowCoachForm(!showCoachForm)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add New Coach</span>
                </button>
              </div>

              {/* Coach Form */}
              {showCoachForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingCoach ? 'Edit Coach' : 'Create New Coach'}
                    </h3>
                    <button
                      onClick={resetCoachForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleCreateCoach} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!editingCoach && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={coachForm.email}
                            onChange={(e) => setCoachForm({...coachForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                          <input
                            type="password"
                            required={!editingCoach}
                            value={coachForm.password}
                            onChange={(e) => setCoachForm({...coachForm, password: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder={editingCoach ? "Leave blank to keep current password" : ""}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={coachForm.first_name}
                        onChange={(e) => setCoachForm({...coachForm, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={coachForm.last_name}
                        onChange={(e) => setCoachForm({...coachForm, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <input
                        type="text"
                        required
                        value={coachForm.specialty}
                        onChange={(e) => setCoachForm({...coachForm, specialty: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., Weight Training & Strength"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={coachForm.hourly_rate}
                        onChange={(e) => setCoachForm({...coachForm, hourly_rate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={coachForm.experience_years}
                        onChange={(e) => setCoachForm({...coachForm, experience_years: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                      <input
                        type="text"
                        required
                        value={coachForm.available_days}
                        onChange={(e) => setCoachForm({...coachForm, available_days: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Monday, Tuesday, Wednesday, Thursday, Friday"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        required
                        value={coachForm.available_hours_start}
                        onChange={(e) => setCoachForm({...coachForm, available_hours_start: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        required
                        value={coachForm.available_hours_end}
                        onChange={(e) => setCoachForm({...coachForm, available_hours_end: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        rows={3}
                        value={coachForm.bio}
                        onChange={(e) => setCoachForm({...coachForm, bio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Coach bio and qualifications..."
                      />
                    </div>
                    <div className="md:col-span-2 flex space-x-3">
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="btn-primary disabled:opacity-50"
                      >
                        {formSubmitting ? 'Saving...' : editingCoach ? 'Update Coach' : 'Create Coach'}
                      </button>
                      <button
                        type="button"
                        onClick={resetCoachForm}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Coaches Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coaches.map((coach) => (
                      <tr key={coach.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {coach.first_name} {coach.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{coach.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{coach.specialty}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${coach.hourly_rate}/hr</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{coach.experience_years} years</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {coach.available_hours_start} - {coach.available_hours_end}
                          </div>
                          <div className="text-xs text-gray-500">
                            {coach.available_days.split(',').slice(0, 3).join(', ')}
                            {coach.available_days.split(',').length > 3 && '...'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditCoach(coach)}
                              className="p-1 text-blue-600 hover:text-blue-900"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCoach(coach.id)}
                              disabled={actionLoading === coach.id}
                              className="p-1 text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Appointment Management</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.client_first_name} {appointment.client_last_name}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.client_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.coach_first_name} {appointment.coach_last_name}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.coach_specialty}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(appointment.appointment_date + 'T00:00:00').toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(appointment.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 