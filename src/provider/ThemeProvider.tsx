import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

interface IThemeProps {
  children: JSX.Element
}
const ThemeProvider = ({ children }: IThemeProps): JSX.Element => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  useEffect(() => {
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.documentElement.classList.remove(className);
      }
    });
    if (themeColor !== '') {
      document.documentElement.classList.add(themeColor);
    }
  }, [themeColor]);

  return children;
};

export default ThemeProvider;
