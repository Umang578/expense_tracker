import React, { useEffect, useState } from 'react'
import useBudgetStore from '../app/budgetStore'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { axiosInstance } from '../utils/axios'

const Budgets = () => {
    const { state, setBudgets, setBudget } = useBudgetStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({ ...state })
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    const navigate = useNavigate()

    const fetchBudgets = async () => {
        try {
            const response = await axiosInstance.get('/user/budgets')
            setBudgets(response.data)
            toast.success("Budgets fetched successfully!")
        } catch (error) {
            console.error("Error fetching budgets:", error)
            toast.error("Failed to fetch budgets. Please try again.")
            navigate('/login')
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchBudgets()
        setLoading(false)
    }, [])

    const handleEdit = () => {
        setIsEditing(true)
        setFormData({ ...state })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setFormData({ ...state })
    }

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveLoading(true)
        try {
            console.log({formData})
            const response = await axiosInstance.post('/user/budgets', {budgets: formData})
            setBudgets(response.data);
            toast.success("Budgets saved successfully!")
        } catch (error) {
            console.error("Error saving budgets ::", error);
            toast.error("Error saving budgets. Please try again.")
        } finally {
            setSaveLoading(false);
            setIsEditing(false);
        }
    }

    const handleInputChange = (category, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: Number(value)
        }))
    }

    return (
        loading ? (
            <div className='flex-grow flex justify-center items-center'>
                <span className="loading loading-spinner text-primary"></span>
            </div>) : (
            <div className="container mx-auto p-6 max-w-2xl">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-6">Budget Management</h2>

                        <div className="space-y-4">
                            {
                                Object.entries(formData).map(([category, amount]) => (
                                    <div key={category} className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">{category}</span>
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="input input-bordered w-full"
                                            value={isEditing ? formData[category] : state[category]}
                                            onChange={(e) => handleInputChange(category, e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                ))}
                        </div>

                        <div className="card-actions justify-end mt-6">
                            {!isEditing ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-outline"
                                        onClick={handleCancel}
                                        disabled={saveLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleSave}
                                        disabled={saveLoading}
                                    >
                                        {saveLoading && <span className='loading loading-spinner'></span>}
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    )
}

export default Budgets