import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Inbox from './pages/admin/Inbox';
import ProjectsCMS from './pages/admin/ProjectsCMS';
import ContentEditor from './pages/admin/ContentEditor';
import Settings from './pages/admin/Settings';
import PageTracker from './components/PageTracker';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
  return (
    <PortfolioProvider>
      <Router>
        <PageTracker />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="projects" element={<ProjectsCMS />} />
          <Route path="content" element={<ContentEditor />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Login is separate from AdminLayout to avoid sidebar/header */}
        <Route path="/login" element={<Login />} />
      </Routes>
      </Router>
    </PortfolioProvider>
  );
}

export default App;
