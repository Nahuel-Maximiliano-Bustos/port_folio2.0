import { Outlet } from 'react-router-dom';
import Header from '../components/public/Header';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-grow w-full relative">
        <Outlet />
      </main>
    </div>
  );
}
