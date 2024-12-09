/* eslint-disable prettier/prettier */
import axios from 'axios';
import { Alert } from 'react-native';

// Create a function that handles the API call for saving the assessment
export const saveAssessment = async (
  formData: any, // The form data to be sent in the request
  accessToken: string, // The access token for authorization
  onRefresh: () => void, // Callback for refreshing the data
  handleCloseAssessmentModal: () => void // Callback to close the modal after successful save
) => {
  try {
    // Making the POST request to save the assessment
    const response = await axios.post('/assessment', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200) {
      console.log('Assessment saved successfully:', response.data);
      Alert.alert('Success', 'Assessment saved successfully!');
      handleCloseAssessmentModal(); // Close the modal on success
      return response.data; // Return the response data
    } else if (response.data?.error && response.data?.details) {
      console.error('Error saving assessment:', response.data.error, response.data.details);
      Alert.alert(
        'Error',
        `Failed to save assessment: ${response.data.error}\nDetails: ${response.data.details}`
      );
    } else {
      console.error('Unexpected response:', response.data);
      Alert.alert('Error', 'Failed to save assessment. Please try again.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        `Failed to save assessment: ${error.response?.data?.error || error.message}`
      );
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  } finally {
    onRefresh(); // Refresh the data after the request is completed
  }
};
