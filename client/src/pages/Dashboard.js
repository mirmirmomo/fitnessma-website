import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Settings, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isCoach, isClient } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          {isAdmin && "Manage your gym from the admin dashboard."}
          {isCoach && "View your upcoming appointments and manage your schedule."}
          {isClient && "Book new appointments and track your fitness journey."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isClient && (
          <>
            <Link to="/coaches" className="card-shadow p-6 rounded-lg bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Users className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Browse Coaches</h3>
                  <p className="text-gray-600">Find and book with expert trainers</p>
                </div>
              </div>
            </Link>
            
            <Link to="/my-appointments" className="card-shadow p-6 rounded-lg bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">My Appointments</h3>
                  <p className="text-gray-600">View and manage your bookings</p>
                </div>
              </div>
            </Link>
          </>
        )}

        {isCoach && (
          <Link to="/my-appointments" className="card-shadow p-6 rounded-lg bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">My Schedule</h3>
                <p className="text-gray-600">Manage your appointments and clients</p>
              </div>
            </div>
          </Link>
        )}

        {isAdmin && (
          <>
            <Link to="/admin" className="card-shadow p-6 rounded-lg bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Settings className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Admin Panel</h3>
                  <p className="text-gray-600">Manage users and system settings</p>
                </div>
              </div>
            </Link>
            
            <Link to="/admin" className="card-shadow p-6 rounded-lg bg-white hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BarChart3 className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Analytics</h3>
                  <p className="text-gray-600">View gym statistics and reports</p>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="card-shadow p-6 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium">
                {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="card-shadow p-6 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Dashboard accessed</p>
            <p>• Profile information up to date</p>
            <p>• Account in good standing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 