import React from 'react'
import '../../App.css'
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom'

export const Pay = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState({});
  const [showFields, setShowFields] = useState({
    cardNumber: true,
    expiryDate: false,
    cvc: false,
    cardName: false
  });

  const validateCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length === 16 && /^\d+$/.test(cleaned)) {
      setErrors(prev => ({...prev, cardNumber: ''}));
      setShowFields(prev => ({...prev, expiryDate: true}));
      return true;
    }
    setErrors(prev => ({...prev, cardNumber: 'Введите 16 цифр номера карты'}));
    return false;
  };

  const validateExpiryDate = (value) => {
    if (!value) {
      setErrors(prev => ({...prev, expiryDate: 'Введите дату'}));
      return false;
    }

    const [month, year] = value.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    const inputYear = parseInt(year);
    const inputMonth = parseInt(month);

    if (isNaN(inputMonth) || isNaN(inputYear) || 
        inputMonth < 1 || inputMonth > 12) {
      setErrors(prev => ({...prev, expiryDate: 'Неверный формат даты (ММ/ГГ)'}));
      return false;
    }

    if (inputYear < currentYear || 
        (inputYear === currentYear && inputMonth < currentMonth)) {
      setErrors(prev => ({...prev, expiryDate: 'Карта просрочена'}));
      return false;
    }

    setErrors(prev => ({...prev, expiryDate: ''}));
    setShowFields(prev => ({...prev, cvc: true}));
    return true;
  };

  const validateCVC = (value) => {
    if (/^\d{3}$/.test(value)) {
      setErrors(prev => ({...prev, cvc: ''}));
      setShowFields(prev => ({...prev, cardName: true}));
      return true;
    }
    setErrors(prev => ({...prev, cvc: 'Введите 3 цифры'}));
    return false;
  };

  const validateCardName = (value) => {
    if (/^[A-Z\s]+$/.test(value)) {
      setErrors(prev => ({...prev, cardName: ''}));
      return true;
    }
    setErrors(prev => ({...prev, cardName: 'Только заглавные латинские буквы'}));
    return false;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^\d\s]/g, '');
    if (value.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatCardNumber(value));
      validateCardNumber(value);
    }
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value;
    if (value.length === 2 && expiryDate.length === 1) {
      value += '/';
    }
    if (value.length <= 5) {
      setExpiryDate(value);
      validateExpiryDate(value);
    }
  };

  return (
    <div className="glass-container">
      <h1>Оплата</h1>
      <div className='card--number' style={{opacity: showFields.cardNumber ? 1 : 0.5, transition: 'opacity 0.3s'}}>
        <p className='pay--text'>Номер карты</p>
        <input 
          type='text' 
          placeholder='0000 0000 0000 0000'
          value={cardNumber}
          onChange={handleCardNumberChange}
        />
        {errors.cardNumber && <p className="error-text" style={{color: 'red'}}>{errors.cardNumber}</p>}
      </div>
      <div className='card-info'>
        <div className='flex-column card-info--small-block' style={{opacity: showFields.expiryDate ? 1 : 0.5, transition: 'opacity 0.3s'}}>
          <p className='pay--text'>Дата</p>
          <input 
            type='text' 
            placeholder='MM/YY'
            value={expiryDate}
            onChange={handleExpiryDateChange}
          />
          {errors.expiryDate && <p className="error-text" style={{color: 'red'}}>{errors.expiryDate}</p>}
        </div>
        <div className='flex-column card-info--small-block' style={{opacity: showFields.cvc ? 1 : 0.5, transition: 'opacity 0.3s'}}>
          <p className='pay--text'>CVC</p>
          <input 
            type='password' 
            placeholder='000'
            maxLength={3}
            value={cvc}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 3) {
                setCvc(value);
                validateCVC(value);
              }
            }}
          />
          {errors.cvc && <p className="error-text" style={{color: 'red'}}>{errors.cvc}</p>}
        </div>
        <div className='flex-column card-info--big-block' style={{opacity: showFields.cardName ? 1 : 0.5, transition: 'opacity 0.3s'}}>
          <p className='pay--text'>Имя</p>
          <input 
            type='text' 
            placeholder='IVAN IVANOVICH'
            value={cardName}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              setCardName(value);
              validateCardName(value);
            }}
          />
          {errors.cardName && <p className="error-text" style={{color: 'red'}}>{errors.cardName}</p>}
        </div>
      </div>

      <div className='flex-row'>
        <Link to={`/Info`}>
          <button className='buy'>Назад</button>
        </Link>
        <button 
          className='buy'
          disabled={!cardNumber || !expiryDate || !cvc || !cardName || Object.keys(errors).length > 0}
        >
          Оплатить
        </button>
      </div>
    </div>
  )
}

export default Pay