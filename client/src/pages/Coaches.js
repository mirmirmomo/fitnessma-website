import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Clock, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import config from '../config';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isClient } = useAuth();
  const { t } = useLanguage();

  const fetchCoaches = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/coaches`);
      setCoaches(response.data);
    } catch (error) {
      setError(t('coaches.failedToLoad'));
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('coaches.loadingCoaches')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchCoaches} className="mt-4 btn-primary">
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('coaches.title')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('coaches.subtitle')}
        </p>
      </div>

      {coaches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">{t('coaches.noCoaches')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches.map((coach) => (
            <div key={coach.id} className="card-shadow bg-white rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-xl">
                      {coach.first_name[0]}{coach.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {coach.first_name} {coach.last_name}
                    </h3>
                    <p className="text-primary-600 font-medium">{coach.specialty}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{coach.bio}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{coach.experience_years} {t('coaches.yearsExperience')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    <span>${coach.hourly_rate}/{t('coaches.hour')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{coach.available_hours_start} - {coach.available_hours_end}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{t('coaches.availableDays')}</p>
                  <div className="flex flex-wrap gap-1">
                    {coach.available_days.split(',').map((day) => (
                      <span key={day} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {day.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {isAuthenticated && isClient ? (
                  <Link
                    to={`/book-appointment/${coach.id}`}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Calendar size={16} />
                    <span>{t('coaches.bookSession')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <span>{t('coaches.loginToBook')}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Coaches; 