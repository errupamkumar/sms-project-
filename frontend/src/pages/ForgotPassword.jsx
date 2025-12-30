import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            const response = await axios.post(`http://localhost:8081/api/v1/auth/forgot-password?identifier=${identifier}`);
            setSuccess(true);
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please check your email/mobile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
            <div className="bg-dark-card w-full max-w-md p-8 rounded-2xl shadow-xl border border-dark-border">
                {success ? (
                    <div className="text-center animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">OTP Sent!</h2>
                        <p className="text-gray-400 mb-8">{message}</p>
                        <p className="text-sm text-gray-500 mb-6">Check the backend console logs for the OTP code (Development Mode)</p>
                        <Link
                            to="/login"
                            className="inline-block w-full bg-dark-bg hover:bg-dark-border border border-dark-border text-white font-medium py-2.5 rounded-lg transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                                <FiArrowLeft /> Back to Login
                            </Link>
                            <h1 className="text-3xl font-bold text-teal-primary mb-2">Forgot Password?</h1>
                            <p className="text-gray-400">Enter your email or mobile to receive an OTP.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email or Mobile</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                        className="w-full bg-dark-bg border border-dark-border text-white text-sm rounded-lg focus:ring-teal-primary focus:border-teal-primary block w-full pl-10 p-2.5 placeholder-gray-500 focus:outline-none transition-colors"
                                        placeholder="admin@school.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-dark-bg bg-teal-primary hover:bg-teal-hover focus:ring-4 focus:outline-none focus:ring-teal-primary/30 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
