import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import styles from './TradingChallenge.module.css';

const TradingChallenge = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Setup
    country: '',
    accountType: '',
    profitTarget: '',
    platform: '',
    accountSize: '',
    
    // Billing Details
    firstName: '',
    lastName: '',
    billingCountry: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    couponCode: '',
    
    // Order Summary
    agreeToTerms: false
  });

  const accountSizes = [
    { value: '5k', label: '$5,000', price: 29 },
    { value: '10k', label: '$10,000', price: 55 },
    { value: '25k', label: '$25,000', price: 129 },
    { value: '50k', label: '$50,000', price: 249 },
    { value: '100k', label: '$100,000', price: 449 },
    { value: '200k', label: '$200,000', price: 849 }
  ];

  const countries = [
    'United States', 'Canada','India', 'United Kingdom', 'Germany', 'France', 
    'Australia', 'Japan', 'Singapore', 'Switzerland', 'Netherlands'
  ];

  const accountTypes = [
    ' 1 Step  -------  12% Phase 1','2 Step  --------10% Phase 1, 5% Phase 2'
  ];

  const profitTargets = [
     '10% Phase 1, 5% Phase 2', '12% Phase 1'
  ];

  const platforms = [
      'GainVault'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSelectedAccountPrice = () => {
    const selected = accountSizes.find(size => size.value === formData.accountSize);
    return selected ? selected.price : 0;
  };

  const applyCoupon = () => {
    // Placeholder for coupon logic
    alert('Coupon functionality would be implemented here');
  };

  const handleConfirmOrder = () => {
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }
    alert('Order confirmed! This would integrate with payment processing.');
  };

  const renderAccountSetup = () => (
    <div className={styles.stepContent}>
      <h2>Account Setup</h2>
      
      <div className={styles.formGrid}>
        {/* <div className={styles.formGroup}>
          <label>Country</label>
          <select 
            value={formData.country} 
            onChange={(e) => handleInputChange('country', e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div> */}

        <div className={styles.formGroup}>
          <label>Account Type</label>
          <select 
            value={formData.accountType} 
            onChange={(e) => handleInputChange('accountType', e.target.value)}
          >
            <option value="">Select Account Type</option>
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* <div className={styles.formGroup}>
          <label>Profit Target</label>
          <select 
            value={formData.profitTarget} 
            onChange={(e) => handleInputChange('profitTarget', e.target.value)}
          >
            <option value="">Select Profit Target</option>
            {profitTargets.map(target => (
              <option key={target} value={target}>{target}</option>
            ))}
          </select>
        </div> */}

        <div className={styles.formGroup}>
          <label>Platform</label>
          <select 
            value={formData.platform} 
            onChange={(e) => handleInputChange('platform', e.target.value)}
          >
            <option value="">Select Platform</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.accountSizeSection}>
        <label>Account Size</label>
        <div className={styles.accountSizeGrid}>
          {accountSizes.map(size => (
            <button
              key={size.value}
              className={`${styles.accountSizeCard} ${
                formData.accountSize === size.value ? styles.selected : ''
              }`}
              onClick={() => handleInputChange('accountSize', size.value)}
            >
              <div className={styles.accountSizeLabel}>{size.label}</div>
              <div className={styles.accountSizePrice}>${size.price}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stepNavigation}>
        <button 
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={ !formData.accountType || !formData.accountSize || !formData.platform }
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderBillingDetails = () => (
    <div className={styles.stepContent}>
      <h2>Billing Details</h2>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* <div className={styles.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
          />
        </div> */}

        <div className={styles.formGroup}>
          <label>Country</label>
          <input
            type="text"
            value={formData.billingCountry}
            onChange={(e) => handleInputChange('billingCountry', e.target.value)}
            placeholder="Enter your country"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Billing Address</label>
          <input
            type="text"
            value={formData.billingAddress}
            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
            placeholder="Enter your billing address"
          />
        </div>

        <div className={styles.formGroup}>
          <label>City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Postal Code</label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="Enter your postal code"
          />
        </div>
      </div>

      <div className={styles.couponSection}>
        <div className={styles.formGroup}>
          <label>Coupon Code</label>
          <div className={styles.couponInput}>
            <input
              type="text"
              value={formData.couponCode}
              onChange={(e) => handleInputChange('couponCode', e.target.value)}
              placeholder="Enter coupon code"
            />
            <button className={styles.btnSecondary} onClick={applyCoupon}>
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className={styles.stepNavigation}>
        <button className={styles.btnSecondary} onClick={handleBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button 
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={!formData.firstName  || !formData.billingAddress}
        >
          Proceed to Summary <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className={styles.stepContent}>
      <h2>Order Summary</h2>
      
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h3>Challenge Details</h3>
        </div>
        
        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
            <span>Challenge Type:</span>
            <span>{formData.accountType}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Platform:</span>
            <span>{formData.platform}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Account Size:</span>
            <span>{accountSizes.find(size => size.value === formData.accountSize)?.label}</span>
          </div>
          {/* <div className={styles.summaryRow}>
            <span>Profit Target:</span>
            <span>{formData.profitTarget}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Country:</span>
            <span>{formData.country}</span>
          </div> */}
        </div>

        <div className={styles.summaryTotal}>
          <div className={styles.totalRow}>
            <span>Total Cost:</span>
            <span className={styles.totalPrice}>${getSelectedAccountPrice()}</span>
          </div>
        </div>
      </div>

      <div className={styles.termsSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          />
          <span className={styles.checkmark}></span>
          I have read and agree to the Rules and Conditions
        </label>
      </div>

      <div className={styles.stepNavigation}>
        <button className={styles.btnSecondary} onClick={handleBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button 
          className={styles.btnSuccess}
          onClick={handleConfirmOrder}
          disabled={!formData.agreeToTerms}
        >
          <Check size={17} /> Confirm Order
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.tradingChallenge}>
      <div className={styles.container}>
        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {[1, 2, 3].map(step => (
              <div 
                key={step}
                className={`${styles.progressStep} ${
                  step <= currentStep ? styles.active : ''
                }`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && 'Account Setup'}
                  {step === 2 && 'Billing Details'}
                  {step === 3 && 'Order Summary'}
                </div>
              </div>
            ))}
          </div>
          <div 
            className={styles.progressLine}
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          ></div>
        </div>

        <div className={styles.stepContainer}>
          {currentStep === 1 && renderAccountSetup()}
          {currentStep === 2 && renderBillingDetails()}
          {currentStep === 3 && renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default TradingChallenge;