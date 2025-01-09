import React from 'react'
import '../../App.css'
import { useState, useEffect } from 'react';
import {Link, useLocation} from 'react-router-dom'

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export const Info = () => {
    const location = useLocation();
    const [currentCert, setCurrentCert] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [certificateDetails, setCertificateDetails] = useState(null);

    useEffect(() => {
        const API_KEY = '011ba11bdcad4fa396660c2ec447ef14';
        const fetchData = async () => {
            setLoading(true);
            try {
                // Получаем список заказов
                const ordersResponse = await fetch('http://localhost:3001/api/orders', {
                    headers: {
                        'x-api-key': API_KEY
                    }
                });
                
                if (!ordersResponse.ok) {
                    throw new Error('Ошибка при получении данных о заказах');
                }
                
                const orders = await ordersResponse.json();
                
                if (orders && orders.length > 0) {
                    const lastOrder = orders[orders.length - 1];
                    
                    // Если есть данные пользователя, заполняем поля
                    if (lastOrder.userData) {
                        setName(lastOrder.userData.name || '');
                        setPhone(lastOrder.userData.phone || '');
                        setEmail(lastOrder.userData.email || '');
                    }

                    // Получаем детали сертификата
                    const certificatesResponse = await fetch('http://localhost:3001/api/certificates', {
                        headers: {
                            'x-api-key': API_KEY
                        }
                    });
                    
                    if (!certificatesResponse.ok) {
                        throw new Error('Ошибка при получении данных о сертификате');
                    }
                    
                    const certificates = await certificatesResponse.json();
                    const certificate = certificates.find(cert => cert.id === lastOrder.certificateId);
                    
                    if (certificate) {
                        setCertificateDetails(certificate);
                        setCurrentCert(certificate.price.toString());
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                setError('Ошибка при загрузке данных: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const validateName = (value) => {
        if (!value.trim()) {
            setErrors(prev => ({...prev, name: 'Поле ФИО обязательно для заполнения'}));
        } else if (!/^[а-яА-ЯёЁ\s]+$/.test(value)) {
            setErrors(prev => ({...prev, name: 'ФИО должно содержать только русские буквы'}));
        } else {
            setErrors(prev => ({...prev, name: ''}));
        }
    };

    const validatePhone = (value) => {
        if (!value) {
            setErrors(prev => ({...prev, phone: 'Номер телефона обязателен для заполнения'}));
        } else if (value.length < 11) {
            setErrors(prev => ({...prev, phone: 'Введите корректный номер телефона'}));
        } else {
            setErrors(prev => ({...prev, phone: ''}));
        }
    };

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
            setErrors(prev => ({...prev, email: 'Почта обязательна для заполнения'}));
        } else if (!emailRegex.test(value)) {
            setErrors(prev => ({...prev, email: 'Введите корректный email'}));
        } else {
            setErrors(prev => ({...prev, email: ''}));
        }
    };

    const isFormValid = () => {
        return name && phone && email && 
               !errors.name && !errors.phone && !errors.email;
    };

    const handleSubmit = async () => {
        const API_KEY = '011ba11bdcad4fa396660c2ec447ef14';
        try {
            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    certificateId: certificateDetails.id,
                    price: parseInt(currentCert),
                    userData: {
                        name,
                        phone,
                        email
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении данных');
            }
        } catch (error) {
            setError('Ошибка при сохранении: ' + error.message);
            console.error('Ошибка:', error);
        }
    };

    return (
        <div class="glass-container">
            {loading && (
                <div className="loader-container">
                    <div className="spinner">
                        <style>
                            {`
                                .loader-container {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    padding: 20px;
                                }
                                .spinner {
                                    width: 50px;
                                    height: 50px;
                                    border: 5px solid #f3f3f3;
                                    border-top: 5px solid rgb(218, 132, 35);
                                    border-radius: 50%;
                                    animation: spin 1s linear infinite;
                                }
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}
                        </style>
                    </div>
                </div>
            )}
            {!loading && (
                <>
                    <h1>Купить сертификат за {currentCert}руб</h1> 
                    <h1>ФИО <span>*</span></h1>
                    <input 
                        type='text' 
                        placeholder='Введите...'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            validateName(e.target.value);
                        }}
                    />
                    {errors.name && <p className="error-text" style={{color: 'red'}}>{errors.name}</p>}
                    
                    <h1>Номер телефона <span>*</span></h1>
                    <PhoneInput
                        international
                        defaultCountry="RU"
                        value={phone}
                        onChange={(value) => {
                            setPhone(value);
                            validatePhone(value);
                        }}
                        placeholder="Введите номер телефона"
                    />
                    {errors.phone && <p className="error-text" style={{color: 'red'}}>{errors.phone}</p>}
                    
                    <h1>Почта <span>*</span></h1>
                    <input 
                        type='email' 
                        placeholder='Введите...'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                        }}
                    />
                    {errors.email && <p className="error-text" style={{color: 'red'}}>{errors.email}</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    
                    <div className='flex-row'>
                        <Link to={`/`}>
                            <button className='back'>Назад</button>
                        </Link>
                        {isFormValid() && (
                            <Link to="/Pay" onClick={handleSubmit}>
                                <button className='back'>Перейти к оплате</button>
                            </Link>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Info