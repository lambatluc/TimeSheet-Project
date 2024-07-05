import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Router } from './routes';
import store from '@/store/store';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/provider/ThemeProvider';
function App (): JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <>
            <Router />
            <Toaster/>
          </>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}
export default App;
