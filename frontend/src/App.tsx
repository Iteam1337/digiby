import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Search from './pages/Search';
import Departures from './pages/Departures';

function App() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/departures" element={<Departures />} />
          <Route path="/results" element={<p>Results</p>} />
          {/* <Route component={NotFound} /> */}
        </Routes>
    </Layout>
      </BrowserRouter>
  );
}

export default App;
