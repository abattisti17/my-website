import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders without crashing', () => {
  render(<App />);
});

test('renders main app structure', () => {
  render(<App />);
  // Check that the app container is rendered
  const appContainer = document.querySelector('.App');
  expect(appContainer).toBeInTheDocument();
});
