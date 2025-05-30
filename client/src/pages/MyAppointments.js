import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MessageSquare, X, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import config from '../config';

const MyAppointments = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/appointments/my`);
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to load appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm(t('appointments.confirmCancel'))) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      await axios.delete(`${config.API_URL}/api/appointments/${appointmentId}`);
      await fetchAppointments(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingId(null);
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

  const isPastAppointment = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime < new Date();
  };

  const canCancelAppointment = (appointment) => {
    return appointment.status !== 'cancelled' && 
           appointment.status !== 'completed' && 
           !isPastAppointment(appointment.appointment_date, appointment.appointment_time);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchAppointments} className="btn-primary">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('appointments.title')}</h1>
        <Link to="/book-appointment" className="btn-primary flex items-center space-x-2">
          <Plus size={16} />
          <span>{t('appointments.bookNew')}</span>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('appointments.noAppointments')}</h3>
          <p className="text-gray-600 mb-6">{t('appointments.noAppointmentsDesc')}</p>
          <Link to="/book-appointment" className="btn-primary">
            {t('appointments.bookAppointment')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-bold">
                        {appointment.coach_first_name[0]}{appointment.coach_last_name[0]}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.coach_first_name} {appointment.coach_last_name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-primary-600 font-medium mb-3">{appointment.coach_specialty}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(appointment.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-4 h-4 mt-0.5 text-gray-400" />
                            <p className="text-sm text-gray-600 italic">{appointment.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end space-y-2">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${appointment.coach_hourly_rate}/hour</p>
                    {isPastAppointment(appointment.appointment_date, appointment.appointment_time) && (
                      <p className="text-xs text-gray-500">{t('appointments.pastAppointment')}</p>
                    )}
                  </div>
                  
                  {canCancelAppointment(appointment) && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={cancellingId === appointment.id}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      <X size={14} />
                      <span>{cancellingId === appointment.id ? t('appointments.cancelling') : t('common.cancel')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments; 