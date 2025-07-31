import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from '../shared/components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import News from './pages/News';
import Services from './pages/services';
import Documents from './pages/Documents';
import Contact from './pages/Contact';
import About from './pages/About';

// Import Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Import Detail pages
import Detailnews from './pages/Detailnews';
import CreateNews from './pages/CreateNews';

// Import sub-pages
import OnlineServices from './pages/services/OnlineServices';
import Support from './pages/services/Support';
import Feedback from './pages/services/Feedback';
import FAQ from './pages/services/FAQ';
import Procedures from './pages/services/Procedures';

const ClientApp = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<Detailnews />} />
            <Route
              path="/news/create"
              element={
                <ProtectedRoute requireAuth={true}>
                  <CreateNews />
                </ProtectedRoute>
              }
            />

            <Route path="/services" element={<Services />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />

            {/* Service sub-routes */}
            <Route path="/services/online" element={<OnlineServices />} />
            <Route path="/services/support" element={<Support />} />
            <Route path="/services/feedback" element={<Feedback />} />
            <Route path="/services/faq" element={<FAQ />} />
            <Route path="/services/procedures" element={<Procedures />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

// 404 Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Trang không tìm thấy</h1>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Về trang chủ
        </a>
      </div>
    </div>
  );
};

export default ClientApp;
