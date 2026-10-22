import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AddEntry, EditEntry } from './pages/AddEntry';
import { EntryPage } from './pages/EntryPage';
import { Feed } from './pages/Feed';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';

// HashRouter keeps URLs like /#/entry/123, so the app works on GitHub Pages
// and any static host without server-side routing rules.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="entry/:id" element={<EntryPage />} />
          <Route path="entry/:id/edit" element={<EditEntry />} />
          <Route path="add" element={<AddEntry />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
