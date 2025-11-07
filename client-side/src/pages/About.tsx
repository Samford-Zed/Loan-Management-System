import React from 'react';
import { Users, Target, Eye, Heart, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About LoanPro</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted financial partner dedicated to making lending simple, transparent, and accessible.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To provide accessible financial solutions that empower individuals and businesses to achieve their goals through transparent, 
                fair, and innovative lending practices.
              </p>
            </div>
            <div className="text-center">
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the most trusted financial partner by revolutionizing the lending experience with technology, 
                integrity, and customer-centric solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We believe in transparent, honest dealings with all our customers and partners.
              </p>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service and operations.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">
                Our customers' success is our success. We put their needs at the forefront.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg mb-6">
              Founded in 2015, LoanPro started with a simple mission: to make the loan process easier and more transparent. 
              What began as a small team of financial experts and technologists has grown into a trusted platform serving 
              thousands of customers nationwide.
            </p>
            <p className="text-gray-600 text-lg">
              Today, we continue to innovate and expand our services while staying true to our core values of integrity, 
              transparency, and customer satisfaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;