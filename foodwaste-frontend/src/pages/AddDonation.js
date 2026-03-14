import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import donationService from '../services/donationService';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const EMPTY = {
  foodName: '', description: '', quantity: '',
  quantityUnit: 'servings', foodType: 'VEG',
  bestBefore: '', pickupAddress: '', city: '', pickupTime: '',
};

const AddDonation = () => {
  const navigate   = useNavigate();
  const { id }     = useParams();          // present when editing
  const isEdit     = Boolean(id);

  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (isEdit) {
      donationService.getById(id).then((d) => {
        setForm({
          foodName:      d.foodName     || '',
          description:   d.description  || '',
          quantity:      d.quantity     || '',
          quantityUnit:  d.quantityUnit || 'servings',
          foodType:      d.foodType     || 'VEG',
          bestBefore:    d.bestBefore   ? d.bestBefore.slice(0, 16) : '',
          pickupAddress: d.pickupAddress || '',
          city:          d.city          || '',
          pickupTime:    d.pickupTime    ? d.pickupTime.slice(0, 16) : '',
        });
      });
    }
  }, [id, isEdit]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        quantity:   parseInt(form.quantity),
        bestBefore: form.bestBefore  || null,
        pickupTime: form.pickupTime  || null,
      };
      if (isEdit) {
        await donationService.updateDonation(id, payload);
        toast.success('Donation updated!');
      } else {
        await donationService.addDonation(payload);
        toast.success('Donation posted successfully!');
      }
      navigate('/donor');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: '680px' }}>
      <h1 style={styles.title}>{isEdit ? 'Edit Donation' : 'Post a Food Donation'}</h1>
      <p style={styles.sub}>
        {isEdit ? 'Update your donation details below.' : 'Fill in the details about the food you want to donate.'}
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <form onSubmit={submit}>
          <div className="grid-2">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Food Name *</label>
              <input name="foodName" className="form-control" placeholder="e.g. Biryani, Bread, Fruits"
                value={form.foodName} onChange={handle} required />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input name="quantity" type="number" min="1" className="form-control" placeholder="e.g. 50"
                value={form.quantity} onChange={handle} required />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="quantityUnit" className="form-control" value={form.quantityUnit} onChange={handle}>
                <option value="servings">Servings</option>
                <option value="kg">Kg</option>
                <option value="packets">Packets</option>
                <option value="boxes">Boxes</option>
                <option value="litres">Litres</option>
              </select>
            </div>

            <div className="form-group">
              <label>Food Type</label>
              <select name="foodType" className="form-control" value={form.foodType} onChange={handle}>
                <option value="VEG">🥦 Vegetarian</option>
                <option value="NON_VEG">🍗 Non-Vegetarian</option>
                <option value="VEGAN">🌱 Vegan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Best Before</label>
              <input name="bestBefore" type="datetime-local" className="form-control"
                value={form.bestBefore} onChange={handle} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea name="description" className="form-control"
                placeholder="Any details about the food, packaging, allergens, etc."
                value={form.description} onChange={handle} />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Pickup Address *</label>
              <input name="pickupAddress" className="form-control"
                placeholder="Full address where food can be picked up"
                value={form.pickupAddress} onChange={handle} required />
            </div>

            <div className="form-group">
              <label>City</label>
              <input name="city" className="form-control" placeholder="Hyderabad"
                value={form.city} onChange={handle} />
            </div>

            <div className="form-group">
              <label>Preferred Pickup Time</label>
              <input name="pickupTime" type="datetime-local" className="form-control"
                value={form.pickupTime} onChange={handle} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : isEdit ? 'Update Donation' : 'Post Donation'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/donor')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '6px' },
  sub:   { color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' },
};

export default AddDonation;
