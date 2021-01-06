import React from 'react';
import axios from 'axios';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Async from './Async';

jest.mock('axios');

const hits = [
  { objectID: 1, title: 'React' },
  { objectID: 2, title: 'Vue' },
]

describe('Async', () => {
  it('fetch news from API', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: {hits} }));
    const { getByRole, findAllByRole } = render(<Async />);
    userEvent.click(getByRole('button'));
    const items = await findAllByRole('listitem');
    expect(items).toHaveLength(2);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('http://hn.algolia.com/api/v1/search?query=React');
  });

  it('fetch news from API with error', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error()));
    const { getByRole, findByText } = render(<Async />);
    userEvent.click(getByRole('button'));
    const message = await findByText(/Something went wrong/);
    expect(message).toBeInTheDocument();
  });
  
  // Альтернативный первому вариант
  it('fetch news from API with act', async () => {
    const promise = Promise.resolve({ data: { hits } });
    axios.get.mockImplementationOnce(() => promise);
    const { getByRole, getAllByRole } = render(<Async />);
    userEvent.click(getByRole('button'));
    await act(() => promise);
    
    expect(getAllByRole('listitem')).toHaveLength(2);
  });
})