import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Users, Star, Clock, MapPin, Phone, Dumbbell, Target, Zap } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-xl bg-white bg-opacity-20 flex items-center justify-center mr-4">
                <Dumbbell size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="text-white">Fitness</span>
                  <span className="text-yellow-300">MA</span>
                </h1>
              </div>
            </div>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-4xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link to="/coaches" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg fitness-shadow">
                  {t('home.hero.browseCoaches')}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg fitness-shadow">
                    {t('home.hero.startJourney')}
                  </Link>
                  <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-lg">
                    {t('home.hero.signIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.features.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl fitness-shadow hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 pulse-primary">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('home.features.booking.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.booking.description')}
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl fitness-shadow hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('home.features.coaches.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.coaches.description')}
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl fitness-shadow hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-6">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('home.features.experience.title')}</h3>
              <p className="text-gray-600">
                {t('home.features.experience.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.stats.title')}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-primary-600 mb-2">1,200+</div>
              <div className="text-gray-600 font-medium">{t('home.stats.members')}</div>
              <div className="w-12 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-secondary-600 mb-2">25+</div>
              <div className="text-gray-600 font-medium">{t('home.stats.coaches')}</div>
              <div className="w-12 h-1 bg-secondary-600 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-accent-600 mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">{t('home.stats.sessions')}</div>
              <div className="w-12 h-1 bg-accent-600 mx-auto mt-3 rounded-full"></div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-primary-600 mb-2">98.5%</div>
              <div className="text-gray-600 font-medium">{t('home.stats.satisfaction')}</div>
              <div className="w-12 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.services.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl fitness-shadow">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Dumbbell className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.services.strength.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.services.strength.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Powerlifting & Olympic Lifting</li>
                <li>• Bodybuilding & Hypertrophy</li>
                <li>• Functional Strength Training</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl fitness-shadow">
              <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mb-4">
                <Target className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.services.weight.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.services.weight.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fat Loss Programs</li>
                <li>• Nutrition Coaching</li>
                <li>• Metabolic Training</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl fitness-shadow">
              <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.services.hiit.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.services.hiit.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• High-Intensity Interval Training</li>
                <li>• Circuit Training</li>
                <li>• Cardiovascular Conditioning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">{t('home.cta.title')}</h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg fitness-shadow">
                {t('home.cta.start')}
              </Link>
              <Link to="/coaches" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-lg">
                {t('home.cta.meetCoaches')}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('home.contact.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.contact.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                <MapPin className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.contact.location')}</h3>
              <p className="text-gray-600">Avenue Mohammed V<br />Casablanca, Morocco 20000</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mb-4">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.contact.hours')}</h3>
              <p className="text-gray-600">Monday - Friday: 5:00 AM - 11:00 PM<br />Saturday - Sunday: 7:00 AM - 9:00 PM</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mb-4">
                <Phone className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('home.contact.contact')}</h3>
              <p className="text-gray-600">Phone: +212 522 123 456<br />Email: info@fitnessma.ma</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 