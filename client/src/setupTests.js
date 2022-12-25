// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom/extend-expect';

// jest-fetch-mock adds mock functions for testing API calls.
import 'jest-fetch-mock';

// jest-date-mock adds mock functions for testing time-based logic.
import 'jest-date-mock';

// Set up the global fetch mock.
fetchMock.enableMocks();

// Custom matcher for testing the content of a DOM element.
expect.extend({
  toHaveTextContentCaseInsensitive(received, expected) {
    const receivedText = received.textContent.trim().toLowerCase();
    const expectedText = expected.trim().toLowerCase();
    const pass = receivedText === expectedText;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to have text content matching "${expected}"`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to have text content matching "${expected}", but it was "${receivedText}"`,
        pass: false,
      };
    }
  },
});
