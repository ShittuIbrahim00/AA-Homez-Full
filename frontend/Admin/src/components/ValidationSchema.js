import * as yup from 'yup';

export const propertySchema = yup.object().shape({
  name: yup.string().required('Property name is required'),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  priceStart: yup.string().required('Starting price is required'),
  priceEnd: yup.string().required('Ending price is required'),
  yearBuilt: yup.string().matches(/^\d{4}$/, 'Year built must be 4 digits').required('Year built is required'),
  type: yup.string().required('Property type is required'),
  listingStatus: yup.string().oneOf(['available', 'sold', 'pending']).required('Listing status is required'),
  mapLink: yup.string().url('Must be a valid URL').required('Map link is required'),
  landMark: yup.string().required('Landmark is required'),
  images: yup.array().of(yup.string().url('Invalid image URL')).min(1, 'At least one image is required'),
});
