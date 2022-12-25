import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders a button that increments a counter when clicked', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText('Click me');
  expect(buttonElement).toBeInTheDocument();

  fireEvent.click(buttonElement);
  const counterElement = getByText('Counter: 1');
  expect(counterElement).toBeInTheDocument();
});

test('renders a form that submits a message', () => {
  const { getByLabelText, getByText } = render(<App />);
  const inputElement = getByLabelText('Message:');
  const buttonElement = getByText('Submit');

  fireEvent.change(inputElement, { target: { value: 'Hello world' } });
  fireEvent.click(buttonElement);
  const messageElement = getByText('Submitted message: Hello world');
  expect(messageElement).toBeInTheDocument();
});
