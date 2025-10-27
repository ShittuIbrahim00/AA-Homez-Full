import React from 'react';

export default function PropertyDetails({ register, errors }) {
  return (
    <>
      <div>
        <label>Property Name</label>
        <input {...register('name')} />
        <p>{errors.name?.message}</p>
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} />
        <p>{errors.description?.message}</p>
      </div>

      <div>
        <label>Location</label>
        <input {...register('location')} />
        <p>{errors.location?.message}</p>
      </div>

      <div>
        <label>Year Built</label>
        <input {...register('yearBuilt')} />
        <p>{errors.yearBuilt?.message}</p>
      </div>

      <div>
        <label>Type</label>
        <select {...register('type')}>
          <option value="">Select Type</option>
          <option value="Rent">Rent</option>
          <option value="Industrial">Industrial</option>
          {/* add more types as needed */}
        </select>
        <p>{errors.type?.message}</p>
      </div>

      <div>
        <label>Listing Status</label>
        <select {...register('listingStatus')}>
          <option value="">Select Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
        </select>
        <p>{errors.listingStatus?.message}</p>
      </div>
    </>
  );
}
