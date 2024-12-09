/* eslint-disable prettier/prettier */
// api/price.ts
import axios from 'axios';

export const fetchPrices = async (token: string) => {
  try {
    const response = await axios.get('/price-watch', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

export const setPrice = async (token: string, price: number) => {
  try {
    const response = await axios.post(
      '/price-watch',
      { price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error setting price:', error);
    throw error;
  }
};
