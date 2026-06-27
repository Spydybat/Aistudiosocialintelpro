/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, BillingInvoice } from '../types';
import { 
  Check, 
  Sparkles, 
  CreditCard, 
  Percent, 
  FileCheck, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import { motion } from 'motion/react';

interface PricingSectionProps {
  user: User | null;
  onUpgradePlan: (plan: 'Free' | 'Pro' | 'Team', interval: 'monthly' | 'yearly') => void;
  openAuth: () => void;
  invoices: BillingInvoice[];
}

export default function PricingSection({
  user,
  onUpgradePlan,
  openAuth,
  invoices
}: PricingSectionProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<null | 'Pro' | 'Team'>(null);
  
  // Checkout states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('321');
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutFinished, setCheckoutFinished] = useState(false);

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'SI50') {
      setDiscountPercent(50);
      setCouponSuccess('Coupon applied: 50% Off Lifetime Pro or Team subscription!');
    } else if (code === 'TRIALFREE') {
      setDiscountPercent(100);
      setCouponSuccess('Trial voucher validated: 14 Days Unlimited Access!');
    } else {
      setCouponError('Invalid voucher code. Try coupon: "SI50" or "TRIALFREE"');
    }
  };

  const getPrice = (plan: 'Free' | 'Pro' | 'Team') => {
    let base = 0;
    if (plan === 'Pro') base = billingInterval === 'monthly' ? 29 : 19;
    if (plan === 'Team') base = billingInterval === 'monthly' ? 89 : 59;
    
    if (discountPercent > 0) {
      base = base * (1 - discountPercent / 100);
    }
    return Math.floor(base);
  };

  const getSlashedPrice = (plan: 'Free' | 'Pro' | 'Team') => {
    if (discountPercent === 0) return null;
    return billingInterval === 'monthly' 
      ? (plan === 'Pro' ? 29 : 89)
      : (plan === 'Pro' ? 19 : 59);
  };

  const initCheckout = (planName: 'Pro' | 'Team') => {
    if (!user) {
      openAuth();
      return;
    }
    setSelectedPlanToBuy(planName);
    setCheckoutFinished(false);
  };

  const handleStripeCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanToBuy) return;
    
    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutFinished(true);
      setTimeout(() => {
        onUpgradePlan(selectedPlanToBuy, billingInterval);
        setSelectedPlanToBuy(null);
        setCheckoutFinished(false);
      }, 1500);
    }, 2000);
  };

  const freeItems = [
    'Save single Reels, Photos, or Audio loops',
    'Supports Instagram, Twitter, and YouTube assets',
    '3 explorer scans per 24 hours',
    'Export logs as standard JSON strings',
    'Active download velocity limit: 1 MB/s',
  ];

  const proItems = [
    'ALL Downloader extraction (Unlocks video, cover, captions with 1 click)',
    'Unlocks TikTok, Threads, and Snapchat downloads',
    'Unlimited Profile Account Explorer searches',
    'Download structures with Multi-folder ZIP bundles',
    'Export metadata inside JSON, CSV, and Microsoft Excel formats',
    'Turbo downloader queue speeds (up to 40 MB/s concurrent)',
    '14-day trial period included',
  ];

  const teamItems = [
    'Everything included in Pro package edition',
    'Multi-user session key allocations (Up to 5 devices concurrent)',
    'Priority scheduling API queue allocation',
    'Automated caption translations with custom AI triggers',
    'Corporate compliance download reports generation',
    'Dedicated account manager support SLA',
  ];

  return (
    <div id="pricing-view" className="p-6 md:p-8 space-y-10 select-none max-w-5xl mx-auto">
      
      {/* 1. Header description */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Enterprise Licensing Plans
        </span>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Supercharge your media metadata harvesting
        </h2>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Upgrade your plan to unlock unlimited Account Explorer scans, custom ZIP download structures, advanced XLSX spreadsheet outputs, and concurrent rapid streams.
        </p>

        {/* MONTHLY / YEARLY TOGGLE */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs ${billingInterval === 'monthly' ? 'font-bold text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>Monthly Billing</span>
          <button
            id="billing-interval-toggle-btn"
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-zinc-200 dark:bg-zinc-850 p-1 relative flex items-center transition"
          >
            <motion.div
              animate={{ x: billingInterval === 'yearly' ? '24px' : '0px' }}
              className="w-4 h-4 rounded-full bg-orange-500 shadow"
            />
          </button>
          <span className={`text-xs flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'font-bold text-zinc-800 dark:text-zinc-200' : 'text-zinc-400'}`}>
            Yearly Billed
            <span className="text-[9px] font-black font-mono px-1.5 py-0.5 bg-emerald-550/10 text-emerald-500 rounded uppercase">Save 35%</span>
          </span>
        </div>
      </div>

      {/* COUPLON / DISCOUNTS BAR */}
      <div className="max-w-md mx-auto p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl flex items-center gap-3">
        <Percent className="w-4 h-4 text-orange-500 shrink-0" />
        <input
          id="discount-code-input"
          type="text"
          placeholder="Apply promo (Try SI50 or TRIALFREE)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="bg-transparent text-xs text-zinc-900 dark:text-zinc-100 flex-1 outline-none font-semibold uppercase placeholder-zinc-400"
        />
        <button
          id="apply-coupon-btn"
          onClick={applyCoupon}
          className="text-[10px] font-bold text-orange-500 hover:text-orange-600 transition tracking-wide shrink-0 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
        >
          Validate Code
        </button>
      </div>

      {couponSuccess && (
        <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold max-w-sm mx-auto">{couponSuccess}</p>
      )}
      {couponError && (
        <p className="text-center text-xs text-red-500 font-semibold max-w-sm mx-auto">{couponError}</p>
      )}

      {/* 2. THREE CORE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* FREE CARD */}
        <div id="pricing-card-free" className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest font-mono">Free Tier</span>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">Starter Core</h3>
              <p className="text-[11px] text-zinc-500 leading-normal">Perfect for personal single-link basic archiving.</p>
            </div>
            
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-2xl font-black">$0</span>
              <span className="text-[10px] text-zinc-400">/ forever</span>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 space-y-2.5">
              {freeItems.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-650 dark:text-zinc-400">
                  <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              id="pricing-free-activate-btn"
              disabled={user?.plan === 'Free'}
              className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-850 font-bold text-xs text-zinc-800 dark:text-zinc-200 rounded-xl transition disabled:opacity-50"
            >
              {user?.plan === 'Free' ? 'Active Subscription' : 'Downgrade to Starter'}
            </button>
          </div>
        </div>

        {/* PRO CARD (RECOMMENDED ACCENT) */}
        <div id="pricing-card-pro" className="p-6 bg-zinc-950 border-2 border-orange-500 rounded-2xl flex flex-col justify-between relative text-white">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 py-0.5 px-3 bg-orange-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest leading-relaxed">
            Most Popular
          </div>

          <div className="space-y-4">
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest font-mono">Power Marketer</span>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold flex items-center gap-1.5">
                Socialintel
                <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '4s' }} />
              </h3>
              <p className="text-[11px] text-zinc-400 leading-normal">Everything a scaling content team or analyst requires.</p>
            </div>

            <div className="flex items-baseline gap-1.5 pt-1">
              {getSlashedPrice('Pro') && (
                <span className="text-zinc-500 line-through text-xs">${getSlashedPrice('Pro')}</span>
              )}
              <span className="text-3xl font-black">${getPrice('Pro')}</span>
              <span className="text-[10px] text-zinc-400">/ month {billingInterval === 'yearly' && 'billed annually'}</span>
            </div>

            <div className="border-t border-zinc-900 pt-4 space-y-2.5">
              {proItems.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-350">
                  <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              id="pricing-pro-activate-btn"
              onClick={() => initCheckout('Pro')}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white rounded-xl transition shadow-lg shadow-orange-500/20"
            >
              {user?.plan === 'Pro' ? 'Manage Active Subscription' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* TEAM CARD */}
        <div id="pricing-card-team" className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest font-mono">Agencies & Corporate</span>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">Enterprise Team</h3>
              <p className="text-[11px] text-zinc-500 leading-normal">For multi-node metadata downloads and legal compliance auditing.</p>
            </div>

            <div className="flex items-baseline gap-1.5 pt-1">
              {getSlashedPrice('Team') && (
                <span className="text-zinc-550 line-through text-xs">${getSlashedPrice('Team')}</span>
              )}
              <span className="text-2xl font-black">${getPrice('Team')}</span>
              <span className="text-[10px] text-zinc-400">/ month {billingInterval === 'yearly' && 'billed annually'}</span>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4 space-y-2.5">
              {teamItems.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-650 dark:text-zinc-400">
                  <Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              id="pricing-team-activate-btn"
              onClick={() => initCheckout('Team')}
              className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-800 text-white hover:bg-zinc-800 font-bold text-xs rounded-xl transition"
            >
              {user?.plan === 'Team' ? 'Manage Active Subscription' : 'Upgrade to Team'}
            </button>
          </div>
        </div>

      </div>

      {/* STRIPE INTERACTIVE CHECKOUT MODAL OVERLAY */}
      {selectedPlanToBuy && (
        <div id="stripe-checkout-modal" className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-150 border border-zinc-250 dark:border-zinc-900 rounded-2xl shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-orange-500 animate-pulse" />
                <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">Stripe Payment Desk</span>
              </div>
              <button
                id="cancel-checkout-btn"
                onClick={() => setSelectedPlanToBuy(null)}
                className="text-xs text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 transition"
              >
                Cancel
              </button>
            </div>

            {checkoutFinished ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 mx-auto rounded-full flex items-center justify-center">
                  <FileCheck className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-555">Upgrade Certified</h4>
                  <p className="text-[11px] text-zinc-500">Invoice generation & webhook logging success. Upgrading account state...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStripeCheckoutSubmit} className="space-y-4">
                
                <div className="text-xs space-y-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
                  <div className="flex justify-between font-semibold">
                    <span>Package:</span>
                    <span className="text-orange-500">{selectedPlanToBuy} License</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span>Interval:</span>
                    <span className="capitalize">{billingInterval} Billed</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-850 pt-2 text-zinc-850 dark:text-zinc-200 font-bold">
                    <span>Amount Due:</span>
                    <span>${getPrice(selectedPlanToBuy)}</span>
                  </div>
                </div>

                {/* Simulated fields */}
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Card Holder Email</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded text-xs text-zinc-900 dark:text-zinc-100 font-medium"
                      defaultValue={user?.email || 'customer@agency.com'}
                      readOnly
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">Credit Card Details</label>
                    <div className="relative">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-9 p-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Expires</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full p-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">CVC</label>
                      <input
                        type="password"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full p-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 flex gap-1 items-start">
                  <AlertCircle className="w-3.5 h-3.5 text-zinc-450 shrink-0 mt-0.5" />
                  <span>Stripe integration running in secure trial sandbox. Press submit to confirm purchase logic.</span>
                </div>

                <button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={checkoutProcessing}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                >
                  {checkoutProcessing ? 'Authorizing Credit Card...' : `Charge $${getPrice(selectedPlanToBuy)} to Secure Card`}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      {/* 3. MOCK INVOICE COPIES */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-900 space-y-4">
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">Invoices History Ledger</h3>
        </div>

        {invoices.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No payments recorded yet. Standard free sandbox accounts do not emit invoice tickets.</p>
        ) : (
          <div className="overflow-hidden border border-zinc-200 dark:border-zinc-900 rounded-xl bg-white dark:bg-zinc-950">
            <table className="w-full border-collapse text-left text-xs font-medium">
              <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 select-none">
                <tr>
                  <th className="p-3">Receipt ID</th>
                  <th className="p-3">Transaction Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Webhook Status</th>
                  <th className="p-3 text-right">PDF File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-900 dark:text-zinc-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="p-3 font-mono text-[10px]">{inv.id}</td>
                    <td className="p-3">{inv.date}</td>
                    <td className="p-3 font-bold">{inv.amount}</td>
                    <td className="p-3">
                      <span className="py-0.5 px-2 bg-emerald-500/10 text-emerald-500 font-mono text-[10px] rounded-full uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-500 font-bold hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Downloading secure PDF receipt receipt-${inv.id}.pdf`);
                        }}
                      >
                        Download PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
