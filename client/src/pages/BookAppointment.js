import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BookAppointment = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCoaches();
  }, []);

  useEffect(() => {
    if (coachId && coaches.length > 0) {
      const coach = coaches.find(c => c.id === parseInt(coachId));
      setSelectedCoach(coach);
    }
  }, [coachId, coaches]);

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('/api/coaches');
      setCoaches(response.data);
    } catch (error) {
      setError('Failed to load coaches');
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    if (!selectedCoach) return [];
    
    const slots = [];
    const start = parseInt(selectedCoach.available_hours_start.split(':')[0]);
    const end = parseInt(selectedCoach.available_hours_end.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (selectedCoach) {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const availableDays = selectedCoach.available_days.split(',').map(d => d.trim());
        
        if (availableDays.includes(dayName)) {
          dates.push(date.toISOString().split('T')[0]);
        }
      }
    }
    
    return dates;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const appointmentData = {
        coach_id: selectedCoach.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: notes.trim()
      };

      await axios.post('/api/appointments', appointmentData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('booking.booked')}</h2>
          <p className="text-gray-600 mb-4">{t('booking.bookedDesc')}</p>
          <p className="text-sm text-gray-500">{t('booking.redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft size={20} />
          <span>{t('common.back')}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('booking.title')}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Coach Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <User className="inline w-4 h-4 mr-2" />
              {t('booking.selectCoach')}
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {coaches.map((coach) => (
                <div
                  key={coach.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCoach?.id === coach.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCoach(coach)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">
                        {coach.first_name[0]}{coach.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {coach.first_name} {coach.last_name}
                      </h3>
                      <p className="text-sm text-primary-600">{coach.specialty}</p>
                      <p className="text-sm text-gray-600">${coach.hourly_rate}/hour</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCoach && (
            <>
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {t('booking.selectDate')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getAvailableDates().map((date) => (
                    <button
                      key={date}
                      type="button"
                      className={`p-3 border rounded-lg text-sm transition-colors ${
                        selectedDate === date
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Clock className="inline w-4 h-4 mr-2" />
                    {t('booking.selectTime')}
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          selectedTime === time
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.notes')} ({t('common.optional')})
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any specific requirements or notes for your session..."
                />
              </div>

              {/* Summary */}
              {selectedDate && selectedTime && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('booking.summary')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Coach:</span>
                      <span>{selectedCoach.first_name} {selectedCoach.last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('common.date')}:</span>
                      <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('common.time')}:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Rate:</span>
                      <span>${selectedCoach.hourly_rate}/hour</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedCoach || !selectedDate || !selectedTime || submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('booking.booking') : t('common.book') + ' ' + t('appointments.bookAppointment')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookAppointment; 