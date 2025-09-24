import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [modoMottu, setModoMottu] = useState(false);

  const toggleModoEscuro = () => setModoEscuro(prev => !prev);
  const toggleModoMottu = () => setModoMottu(prev => !prev);

  // Define as cores de acordo com o modo ativo
  const colors = modoEscuro
    ? {
        background: '#1e1e1e',
        text: '#ffffff',
        card: '#2c2c2c',
        switchTrack: '#ffffffff',
        switchThumb: '#000000ff',
        logoutButton: '#c0392b',
      }
    : modoMottu
    ? {
        background: '#e6f4ea',
        text: '#185f02',
        card: '#d0f0c0',
        switchTrack: '#75ebaaff',
        switchThumb: '#185f02',
        logoutButton: '#2e7d32',
      }
    : {
        background: '#f0f4f8',
        text: '#2c3e50',
        card: '#ffffff',
        switchTrack: '#fcfcfcff',
        switchThumb: '#bfd1aeff',
        logoutButton: '#e74c3c',
      };

  // Aqui passamos **tudo** para o contexto
  return (
    <ThemeContext.Provider
      value={{ modoEscuro, modoMottu, toggleModoEscuro, toggleModoMottu, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);