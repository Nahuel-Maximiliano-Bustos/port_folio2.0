import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config.js';

const PortfolioContext = createContext();

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({ children }) {
  const [content, setContent] = useState({});
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contentRes, projectsRes] = await Promise.all([
          fetch(`${API_URL}/api/cms/content/public`),
          fetch(`${API_URL}/api/cms/projects`)
        ]);
        
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContent(contentData);
        }
        
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.filter(p => p.is_active !== 0)); // Only active projects publically
        }
      } catch (err) {
        console.error('Error fetching public portfolio content:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <PortfolioContext.Provider value={{ content, projects, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}
