import React, { useEffect, useState } from 'react';
import useExpenseStore from '../app/expenseStore';
import { axiosInstance } from '../utils/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const CATEGORIES = ["Food", "Rent", "Transport", "Shopping", "Bills", "Other"];

const Expenses = () => {
  const {
    expenses,
    loading,
    error,
    setExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    setLoading,
    setError,
    clearError,
    getTotalExpenses
  } = useExpenseStore();

  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/expense');
      setExpenses(response.data);
      toast.success('Expenses loaded successfully!');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError(error.message);
      toast.error('Failed to fetch expenses. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingExpense) {
        // Update existing expense
        const response = await axiosInstance.put(`/expense/${editingExpense._id}`, {
          ...formData,
          amount: Number(formData.amount)
        });
        updateExpense(response.data);
        toast.success('Expense updated successfully!');
      } else {
        // Add new expense
        const response = await axiosInstance.post('/expense', {
          ...formData,
          amount: Number(formData.amount)
        });
        addExpense(response.data);
        toast.success('Expense added successfully!');
      }
      
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense. Please try again.');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/expense/${expenseId}`);
      deleteExpense(expenseId);
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingExpense(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-lg md:text-3xl font-bold">Expense Management</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Total Expenses: <span className="font-semibold text-primary">{formatCurrency(getTotalExpenses())}</span>
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          Add Expense
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button onClick={clearError} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
      )}

      {/* Expenses List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No expenses found</p>
              <p className="text-gray-400">Start by adding your first expense!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id}>
                      <td className="font-medium">{expense.description}</td>
                      <td className="font-semibold text-primary">{formatCurrency(expense.amount)}</td>
                      <td>
                        <div className="badge badge-outline">{expense.category}</div>
                      </td>
                      <td>{formatDate(expense.date)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleEdit(expense)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(expense._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter expense description"
                  className="input input-bordered w-full"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;