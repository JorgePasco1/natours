/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings= async (data, type) => {
  try {
    const url = `/api/v1/users/${type === 'password' ? 'updateMyPassword' : 'updateMe'}`

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated succesfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
