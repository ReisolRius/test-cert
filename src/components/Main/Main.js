import React from 'react'
import '../../App.css'
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'

export const Main = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentCert, setCurrentCert] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const API_KEY = '011ba11bdcad4fa396660c2ec447ef14';
        const API_URL = 'http://localhost:3001/api/certificates';

        const OSGetGoodList = async () => {
            setLoading(true);
            setError('');
            
            try {
                // Получаем список всех сертификатов
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'x-api-key': API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProducts(data);

                // Проверяем сохраненные заказы в API
                const ordersResponse = await fetch('http://localhost:3001/api/orders', {
                    method: 'GET',
                    headers: {
                        'x-api-key': API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                if (ordersResponse.ok) {
                    const orders = await ordersResponse.json();
                    if (orders && orders.length > 0) {
                        const lastOrder = orders[orders.length - 1];
                        const savedProduct = data.find(product => product.id === lastOrder.certificateId);
                        if (savedProduct) {
                            setSelectedProduct(savedProduct);
                            setCurrentCert(savedProduct.price.toString());
                        }
                    }
                }
                
            } catch (error) {
                setError('Ошибка при получении сертификатов: ' + error.message);
                console.error('Ошибка:', error);
            } finally {
                setLoading(false);
            }
        };

        OSGetGoodList();

        return () => {
            setProducts([]);
        };
    }, []);

    const handleSelect = async (event) => {
        const selectedPrice = parseInt(event.target.value);
        setCurrentCert(selectedPrice);
        
        const product = products.find(product => product.price === selectedPrice);
        if (product) {
            setSelectedProduct(product);

            try {
                const API_KEY = '011ba11bdcad4fa396660c2ec447ef14';
                const response = await fetch('http://localhost:3001/api/orders', {
                    method: 'POST',
                    headers: {
                        'x-api-key': API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        certificateId: product.id,
                        price: selectedPrice
                    })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при сохранении данных о сертификате');
                }
            } catch (error) {
                setError('Ошибка при сохранении: ' + error.message);
                console.error('Ошибка:', error);
            }
        }
    };

    return (
        <div class="glass-container">
            <h1>Выберите сертификат</h1>
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
            {error && <p style={{color: 'red'}}>{error}</p>}
            {!loading && !error && (
                <>
                    <select value={currentCert} onChange={handleSelect} class="glass-select">
                        <option value="" disabled hidden>Нажми меня</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.price}>
                                {product.name} {product.price}
                            </option>
                        ))}
                    </select>
                    <p className={currentCert ? 'price' : 'hidden'}>Цена: {currentCert}р.</p>
                    {selectedProduct && (
                        <Link to={`/Info`} state={{ product: selectedProduct }}>
                            <button>Купить</button>
                        </Link>
                    )}
                </>
            )}
        </div>
    )
}

export default Main;