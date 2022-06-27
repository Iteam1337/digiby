import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from './components/Layout';
import Search from './pages/Search';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/departures" element={<p>Departures</p>} />
            <Route path="/results" element={<p>Results</p>} />
            {/* <Route component={NotFound} /> */}
          </Routes>
        </BrowserRouter>
      </Layout>
    </QueryClientProvider>
  );
}

export default App;
