
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const BudgetSummary = () => {
  const [budgetSummary, setBudgetSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const CATEGORIES = ["Food", "Rent", "Transport", "Shopping", "Bills", "Other"];

  useEffect(() => {
    fetchBudgetSummary();
  }, []);

  const fetchBudgetSummary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/user/budget-summary');
      setBudgetSummary(response.data);
      toast.success('Budget summary loaded successfully!');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch budget summary. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex-grow flex justify-center items-center">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Budget Summary</h1>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((category) => {
          const remaining = budgetSummary[category];
          const isOver = typeof remaining === 'number' && remaining < 0;
          return (
            <div key={category} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="card-title text-lg">{category}</h3>
                  {typeof remaining === 'number' && (
                    <div className={`badge ${isOver ? 'badge-error' : 'badge-success'}`}>
                      {isOver ? 'Over Budget' : 'Within Budget'}
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold mb-2">
                  {typeof remaining === 'number' ? formatCurrency(remaining) : 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  Remaining {category} budget
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8">
        <button 
          className="btn btn-primary btn-wide"
          onClick={fetchBudgetSummary}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default BudgetSummary;