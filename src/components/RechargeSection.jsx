import React, { useState, useEffect } from 'react';
import { rechargeService } from '../api/services';
import { useAuth } from '../context/AuthContext';

const plans = {
  mobile: {
    prepaid: {
      Jio: [
        { amount: 149, desc: '1GB/day, Unlimited Calls, 28 days' },
        { amount: 239, desc: '1.5GB/day, Unlimited Calls, 28 days' },
        { amount: 299, desc: '2GB/day, Unlimited Calls, 28 days' },
        { amount: 479, desc: '2.5GB/day, Unlimited Calls, 56 days' },
        { amount: 666, desc: '2GB/day, Unlimited Calls, 84 days' },
        { amount: 999, desc: '3GB/day, Unlimited Calls, 84 days' },
      ],
      Airtel: [
        { amount: 155, desc: '1GB/day, Unlimited Calls, 28 days' },
        { amount: 265, desc: '1.5GB/day, Unlimited Calls, 28 days' },
        { amount: 299, desc: '2GB/day, Unlimited Calls, 28 days' },
        { amount: 489, desc: '2.5GB/day, Unlimited Calls, 56 days' },
        { amount: 699, desc: '2GB/day, Unlimited Calls, 84 days' },
        { amount: 1099, desc: '3GB/day, Unlimited Calls, 84 days' },
      ],
      Vi: [
        { amount: 149, desc: '1GB/day, Unlimited Calls, 28 days' },
        { amount: 249, desc: '1.5GB/day, Unlimited Calls, 28 days' },
        { amount: 299, desc: '2GB/day, Unlimited Calls, 28 days' },
        { amount: 449, desc: '2GB/day, Unlimited Calls, 56 days' },
        { amount: 649, desc: '1.5GB/day, Unlimited Calls, 84 days' },
        { amount: 999, desc: '2GB/day, Unlimited Calls, 84 days' },
      ],
      BSNL: [
        { amount: 107, desc: '1GB/day, Unlimited Calls, 22 days' },
        { amount: 187, desc: '2GB/day, Unlimited Calls, 28 days' },
        { amount: 247, desc: '3GB/day, Unlimited Calls, 30 days' },
        { amount: 397, desc: '2GB/day, Unlimited Calls, 60 days' },
        { amount: 599, desc: '2GB/day, Unlimited Calls, 90 days' },
        { amount: 999, desc: '3GB/day, Unlimited Calls, 90 days' },
      ],
    },
    postpaid: {
      Jio: [
        { amount: 349, desc: '75GB Data, Unlimited Calls, 1 Month' },
        { amount: 449, desc: '100GB Data, Unlimited Calls, 1 Month' },
        { amount: 599, desc: '150GB Data, Unlimited Calls, 1 Month' },
        { amount: 999, desc: 'Unlimited Data, Unlimited Calls, 1 Month' },
      ],
      Airtel: [
        { amount: 399, desc: '75GB Data, Unlimited Calls, 1 Month' },
        { amount: 499, desc: '100GB Data, Unlimited Calls, 1 Month' },
        { amount: 699, desc: '150GB Data, Unlimited Calls, 1 Month' },
        { amount: 1099, desc: 'Unlimited Data, Unlimited Calls, 1 Month' },
      ],
      Vi: [
        { amount: 399, desc: '75GB Data, Unlimited Calls, 1 Month' },
        { amount: 499, desc: '100GB Data, Unlimited Calls, 1 Month' },
        { amount: 699, desc: '150GB Data, Unlimited Calls, 1 Month' },
        { amount: 999, desc: 'Unlimited Data, Unlimited Calls, 1 Month' },
      ],
      BSNL: [
        { amount: 299, desc: '50GB Data, Unlimited Calls, 1 Month' },
        { amount: 399, desc: '100GB Data, Unlimited Calls, 1 Month' },
        { amount: 599, desc: '150GB Data, Unlimited Calls, 1 Month' },
      ],
    },
  },
  dth: {
    'Tata Play': [
      { amount: 153, desc: 'Basic SD Pack - 200+ channels, 1 Month' },
      { amount: 249, desc: 'Standard HD Pack - 300+ channels, 1 Month' },
      { amount: 349, desc: 'Premium HD Pack - 400+ channels, 1 Month' },
      { amount: 499, desc: 'Binge HD Pack - 500+ channels + OTT, 1 Month' },
      { amount: 999, desc: 'Annual Basic Pack - 200+ channels, 12 Months' },
    ],
    'Airtel DTH': [
      { amount: 149, desc: 'Basic SD Pack - 200+ channels, 1 Month' },
      { amount: 249, desc: 'Standard HD Pack - 300+ channels, 1 Month' },
      { amount: 349, desc: 'Premium HD Pack - 400+ channels, 1 Month' },
      { amount: 549, desc: 'Xstream HD Pack - 500+ channels + OTT, 1 Month' },
      { amount: 1099, desc: 'Annual Basic Pack - 200+ channels, 12 Months' },
    ],
    'Dish TV': [
      { amount: 129, desc: 'Basic SD Pack - 150+ channels, 1 Month' },
      { amount: 199, desc: 'Standard Pack - 250+ channels, 1 Month' },
      { amount: 299, desc: 'Super Pack - 350+ channels, 1 Month' },
      { amount: 449, desc: 'Super Plus HD Pack - 400+ channels, 1 Month' },
      { amount: 899, desc: 'Annual Basic Pack - 150+ channels, 12 Months' },
    ],
    'Sun Direct': [
      { amount: 99, desc: 'Basic SD Pack - 100+ channels, 1 Month' },
      { amount: 199, desc: 'Standard Pack - 200+ channels, 1 Month' },
      { amount: 299, desc: 'HD Pack - 300+ channels, 1 Month' },
      { amount: 399, desc: 'Premium HD Pack - 400+ channels, 1 Month' },
    ],
    'D2H (Videocon)': [
      { amount: 129, desc: 'Basic Pack - 150+ channels, 1 Month' },
      { amount: 229, desc: 'Standard Pack - 250+ channels, 1 Month' },
      { amount: 329, desc: 'Premium Pack - 350+ channels, 1 Month' },
      { amount: 429, desc: 'HD Pack - 400+ channels, 1 Month' },
    ],
  },
  datacard: {
    JioFi: [
      { amount: 239, desc: '1.5GB/day, 28 days' },
      { amount: 399, desc: '3GB/day, 28 days' },
      { amount: 599, desc: '5GB/day, 56 days' },
    ],
    'Airtel 4G Hotspot': [
      { amount: 265, desc: '1.5GB/day, 28 days' },
      { amount: 449, desc: '3GB/day, 28 days' },
      { amount: 699, desc: '5GB/day, 56 days' },
    ],
    'BSNL Broadband': [
      { amount: 449, desc: '100GB, Unlimited Speed, 1 Month' },
      { amount: 699, desc: '200GB, Unlimited Speed, 1 Month' },
      { amount: 999, desc: 'Unlimited Data, 1 Month' },
    ],
    'ACT Fibernet': [
      { amount: 599, desc: '100Mbps, 100GB, 1 Month' },
      { amount: 799, desc: '200Mbps, 200GB, 1 Month' },
      { amount: 1099, desc: '300Mbps, Unlimited, 1 Month' },
    ],
  },
};

const operatorsByType = {
  mobile: ['Jio', 'Airtel', 'Vi', 'BSNL'],
  dth: ['Tata Play', 'Airtel DTH', 'Dish TV', 'Sun Direct', 'D2H (Videocon)'],
  datacard: ['JioFi', 'Airtel 4G Hotspot', 'BSNL Broadband', 'ACT Fibernet'],
};

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem', background: '#f0f4ff', minHeight: '500px' },
  title: { textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem', color: '#2d3748' },
  subtitle: { textAlign: 'center', color: '#718096', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  label: { display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#4a5568', fontSize: '0.9rem' },
  select: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1rem', background: 'white' },
  input: { width: '100%', padding: '0.6rem 0.8rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1rem', boxSizing: 'border-box' },
  tabRow: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  planGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' },
  planCard: (selected) => ({
    border: selected ? '2px solid #667eea' : '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.6rem',
    cursor: 'pointer',
    background: selected ? '#ebf4ff' : 'white',
    transition: 'all 0.2s',
  }),
  planAmount: { fontWeight: '700', color: '#667eea', fontSize: '1rem' },
  planDesc: { fontSize: '0.72rem', color: '#718096', marginTop: '2px' },
  btn: (color) => ({
    width: '100%', background: color, color: 'white', border: 'none',
    padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600',
  }),
  modeBtn: (active) => ({
    flex: 1, padding: '0.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer',
    background: active ? '#667eea' : '#e2e8f0', color: active ? 'white' : '#4a5568',
    fontWeight: active ? '600' : '400', transition: 'all 0.2s',
  }),
  typeBtn: (active) => ({
    padding: '0.5rem 1rem', border: 'none', borderRadius: '20px', cursor: 'pointer',
    background: active ? '#667eea' : '#e2e8f0', color: active ? 'white' : '#4a5568',
    fontWeight: active ? '600' : '400', fontSize: '0.85rem',
  }),
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
    background: color, color: 'white', fontSize: '0.75rem', fontWeight: '600',
  }),
  historyTable: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: { padding: '0.7rem', textAlign: 'left', background: '#667eea', color: 'white' },
  td: { padding: '0.7rem', borderBottom: '1px solid #e2e8f0' },
  offlineBox: { marginTop: '0.8rem', padding: '0.7rem', background: '#fff3cd', borderRadius: '8px', fontSize: '0.85rem', color: '#856404' },
};

function RechargeSection() {
  // Make auth optional - component works without login too
  let isAuthenticated = false;
  let user = null;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    user = auth.user;
  } catch (error) {
    // Auth not available, continue without it
    console.log('Auth not available, recharge will require login');
  }
  
  const [rechargeType, setRechargeType] = useState('mobile');
  const [mobileType, setMobileType] = useState('prepaid'); // prepaid / postpaid
  const [operator, setOperator] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('online');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch recharge history on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingHistory(true);
      const response = await rechargeService.getRecharges({ limit: 10 });
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Don't show error to user, just log it
    } finally {
      setLoadingHistory(false);
    }
  };

  const getPlans = () => {
    if (!operator) return [];
    if (rechargeType === 'mobile') return plans.mobile[mobileType]?.[operator] || [];
    if (rechargeType === 'dth') return plans.dth[operator] || [];
    if (rechargeType === 'datacard') return plans.datacard[operator] || [];
    return [];
  };

  const finalAmount = selectedPlan ? selectedPlan.amount : customAmount;

  const handleTypeChange = (type) => {
    setRechargeType(type);
    setOperator('');
    setSelectedPlan(null);
    setCustomAmount('');
    setAccountNo('');
  };

  const handleOperatorChange = (op) => {
    setOperator(op);
    setSelectedPlan(null);
    setCustomAmount('');
  };

  const handleRecharge = async () => {
    if (!accountNo.trim()) { alert('Please enter mobile number / customer ID!'); return; }
    if (!operator) { alert('Please select an operator!'); return; }
    if (!finalAmount) { alert('Please select a plan or enter amount!'); return; }

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please login to continue with recharge!');
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);

      const rechargeData = {
        rechargeType,
        mobileType: rechargeType === 'mobile' ? mobileType : undefined,
        operator,
        accountNumber: accountNo,
        planDescription: selectedPlan?.desc || 'Custom Amount',
        amount: parseFloat(finalAmount),
        paymentMethod: paymentMode,
        notes: `${rechargeType} recharge for ${operator}`
      };

      const response = await rechargeService.createRecharge(rechargeData);

      if (response.success) {
        if (paymentMode === 'online') {
          alert(`✅ Recharge Successful!\n\nOperator: ${operator}\nNumber: ${accountNo}\nAmount: ₹${finalAmount}\nPlan: ${rechargeData.planDescription}\nTransaction ID: ${response.data.transactionId}`);
        } else {
          alert(`📋 Offline Recharge Request Submitted!\n\nPlease visit our shop and pay ₹${finalAmount} in cash.\n📍 Puranpur Salhapur (Post. Garhmeerpur)\n⏰ Timings: 9AM - 8PM\nReference ID: ${response.data.transactionId}`);
        }

        // Reset form
        setAccountNo('');
        setSelectedPlan(null);
        setCustomAmount('');

        // Refresh history
        fetchHistory();
      }
    } catch (error) {
      console.error('Recharge error:', error);
      alert('Error processing recharge: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const currentPlans = getPlans();
  const accountLabel = rechargeType === 'mobile' ? 'Mobile Number' : rechargeType === 'dth' ? 'DTH Customer ID / Registered Mobile' : 'Account Number / ID';

  return (
    <div style={s.page}>
      <h1 style={s.title}>📱 Recharge & Bill Payment Center</h1>
      <p style={s.subtitle}>Mobile • DTH • Data Card — Online & Offline</p>

      {/* Payment Mode */}
      <div style={{ ...s.tabRow, justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button style={s.modeBtn(paymentMode === 'online')} onClick={() => setPaymentMode('online')}>💳 Online (UPI/Card)</button>
        <button style={s.modeBtn(paymentMode === 'offline')} onClick={() => setPaymentMode('offline')}>💵 Offline (Cash at Shop)</button>
      </div>

      <div style={s.grid}>
        {/* Form Card */}
        <div style={s.card}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>New Recharge</h3>

          {/* Recharge Type Tabs */}
          <label style={s.label}>Recharge Type</label>
          <div style={s.tabRow}>
            <button style={s.typeBtn(rechargeType === 'mobile')} onClick={() => handleTypeChange('mobile')}>📱 Mobile</button>
            <button style={s.typeBtn(rechargeType === 'dth')} onClick={() => handleTypeChange('dth')}>📺 DTH</button>
            <button style={s.typeBtn(rechargeType === 'datacard')} onClick={() => handleTypeChange('datacard')}>💻 Data Card</button>
          </div>

          {/* Prepaid / Postpaid (only for mobile) */}
          {rechargeType === 'mobile' && (
            <>
              <label style={s.label}>Connection Type</label>
              <div style={{ ...s.tabRow, marginBottom: '1rem' }}>
                <button style={s.modeBtn(mobileType === 'prepaid')} onClick={() => { setMobileType('prepaid'); setSelectedPlan(null); }}>📶 Prepaid</button>
                <button style={s.modeBtn(mobileType === 'postpaid')} onClick={() => { setMobileType('postpaid'); setSelectedPlan(null); }}>📄 Postpaid</button>
              </div>
            </>
          )}

          {/* Operator */}
          <label style={s.label}>Select Operator</label>
          <div style={s.tabRow}>
            {operatorsByType[rechargeType].map(op => (
              <button key={op} style={s.typeBtn(operator === op)} onClick={() => handleOperatorChange(op)}>{op}</button>
            ))}
          </div>

          {/* Account Number */}
          <label style={s.label}>{accountLabel}</label>
          <input
            style={s.input}
            type="text"
            value={accountNo}
            onChange={e => setAccountNo(e.target.value)}
            placeholder={rechargeType === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter Customer ID'}
          />

          {/* Plans */}
          {operator && currentPlans.length > 0 && (
            <>
              <label style={s.label}>Select Plan</label>
              <div style={s.planGrid}>
                {currentPlans.map((plan, i) => (
                  <div
                    key={i}
                    style={s.planCard(selectedPlan?.amount === plan.amount && selectedPlan?.desc === plan.desc)}
                    onClick={() => { setSelectedPlan(plan); setCustomAmount(''); }}
                  >
                    <div style={s.planAmount}>₹{plan.amount}</div>
                    <div style={s.planDesc}>{plan.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Custom Amount */}
          <label style={s.label}>Or Enter Custom Amount (₹)</label>
          <input
            style={s.input}
            type="number"
            value={customAmount}
            onChange={e => { setCustomAmount(e.target.value); setSelectedPlan(null); }}
            placeholder="Enter custom amount"
            min="1"
          />

          {/* Summary */}
          {finalAmount && operator && (
            <div style={{ background: '#ebf4ff', borderRadius: '8px', padding: '0.8rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <strong>Summary:</strong> {operator} | ₹{finalAmount}
              {selectedPlan && <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '2px' }}>{selectedPlan.desc}</div>}
            </div>
          )}

          <button style={s.btn('#667eea')} onClick={handleRecharge} disabled={loading}>
            {loading ? '⏳ Processing...' : (paymentMode === 'online' ? '💳 Pay & Recharge' : '📋 Request Offline Recharge')}
          </button>

          {paymentMode === 'offline' && (
            <div style={s.offlineBox}>
              🏪 Visit: Puranpur Salhapur (Post. Garhmeerpur)<br />
              ⏰ Timings: 9AM – 8PM | 📞 +91 9012675213
            </div>
          )}
        </div>

        {/* Offers Card */}
        <div style={s.card}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>🔥 Popular Plans</h3>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>📱 Mobile Prepaid</div>
            {[
              { op: 'Jio', plan: '₹239 — 1.5GB/day, 28 days' },
              { op: 'Airtel', plan: '₹299 — 2GB/day, 28 days' },
              { op: 'Vi', plan: '₹249 — 1.5GB/day, 28 days' },
              { op: 'BSNL', plan: '₹187 — 2GB/day, 28 days' },
            ].map(item => (
              <div key={item.op} style={{ padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' }}>
                <strong>{item.op}:</strong> {item.plan}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>📺 DTH</div>
            {[
              { op: 'Tata Play', plan: '₹249 — Standard HD, 1 Month' },
              { op: 'Airtel DTH', plan: '₹249 — Standard HD, 1 Month' },
              { op: 'Dish TV', plan: '₹199 — Standard, 1 Month' },
              { op: 'Sun Direct', plan: '₹199 — Standard, 1 Month' },
            ].map(item => (
              <div key={item.op} style={{ padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' }}>
                <strong>{item.op}:</strong> {item.plan}
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: '600', color: '#667eea', marginBottom: '0.5rem' }}>💻 Data Card</div>
            {[
              { op: 'JioFi', plan: '₹239 — 1.5GB/day, 28 days' },
              { op: 'Airtel Hotspot', plan: '₹265 — 1.5GB/day, 28 days' },
            ].map(item => (
              <div key={item.op} style={{ padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.88rem' }}>
                <strong>{item.op}:</strong> {item.plan}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.2rem', padding: '0.8rem', background: '#f0fff4', borderRadius: '8px', fontSize: '0.85rem', color: '#276749' }}>
            💡 <strong>Tip:</strong> Recharge karne ke liye operator select karein, phir plan choose karein ya custom amount enter karein.
          </div>
        </div>
      </div>

      {/* History */}
      {isAuthenticated && history.length > 0 && (
        <div style={{ ...s.card, marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>📜 Recent Recharge History</h3>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>⏳ Loading history...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={s.historyTable}>
                <thead>
                  <tr>
                    {['Date', 'Type', 'Number/ID', 'Operator', 'Plan', 'Amount', 'Mode', 'Status'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map(rec => (
                    <tr key={rec._id || rec.id}>
                      <td style={s.td}>{new Date(rec.createdAt || rec.date).toLocaleString('en-IN')}</td>
                      <td style={s.td}>{rec.rechargeType || rec.type}</td>
                      <td style={s.td}>{rec.accountNumber || rec.number}</td>
                      <td style={s.td}>{rec.operator}</td>
                      <td style={s.td} title={rec.planDescription || rec.plan}>{(rec.planDescription || rec.plan || '').length > 30 ? (rec.planDescription || rec.plan).substring(0, 30) + '...' : (rec.planDescription || rec.plan)}</td>
                      <td style={s.td}><strong>₹{rec.amount}</strong></td>
                      <td style={s.td}>{rec.paymentMethod === 'online' || rec.paymentMode === 'online' ? '💳 Online' : '💵 Offline'}</td>
                      <td style={s.td}>
                        <span style={s.badge(rec.status === 'completed' || rec.status === 'Completed' ? '#38a169' : rec.status === 'failed' ? '#e53e3e' : '#d69e2e')}>
                          {rec.status === 'completed' || rec.status === 'Completed' ? '✅ Done' : rec.status === 'failed' ? '❌ Failed' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RechargeSection;
