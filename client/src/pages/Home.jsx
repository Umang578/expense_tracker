import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="container mx-auto max-w-3xl p-6 flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Budgets */}
        <Link to="/budgets" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <div className="card-body items-center text-center">
            <span className="text-5xl mb-2">💰</span>
            <h2 className="card-title mb-2">Budgets</h2>
            <p className="text-gray-500">Set and manage your monthly budgets for each category.</p>
          </div>
        </Link>
        {/* Expenses */}
        <Link to="/expenses" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <div className="card-body items-center text-center">
            <span className="text-5xl mb-2">📝</span>
            <h2 className="card-title mb-2">Expenses</h2>
            <p className="text-gray-500">Add, edit, and track your expenses easily.</p>
          </div>
        </Link>
        {/* Budget Summary */}
        <Link to="/summary" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200">
          <div className="card-body items-center text-center">
            <span className="text-5xl mb-2">📊</span>
            <h2 className="card-title mb-2">Budget Summary</h2>
            <p className="text-gray-500">See your remaining budget for each category at a glance.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;