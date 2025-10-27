import React from 'react';

export default function PriceInputs({ register, errors }) {
  return (
    <>
      <div>
        <label>Price (Number)</label>
        <input type="number" {...register('price')} />
        <p>{errors.price?.message}</p>
      </div>

      <div>
        <label>Price Start</label>
        <input {...register('priceStart')} />
        <p>{errors.priceStart?.message}</p>
      </div>

      <div>
        <label>Price End</label>
        <input {...register('priceEnd')} />
        <p>{errors.priceEnd?.message}</p>
      </div>
    </>
  );
}
