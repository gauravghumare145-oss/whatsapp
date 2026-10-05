import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2, User, Sparkles, X } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
];

export const AuthModal: React.FC = () => {
  const { loginWithEmail, loginWithPhone, isAuthModalOpen, setIsAuthModalOpen, currentUser, savedProfiles, switchToProfile } = useWhatsApp();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  // Email form state
  const [emailInput, setEmailInput] = useState('gauravghumare145@gmail.com');
  const [emailName, setEmailName] = useState('Gaurav');
  const [emailStep, setEmailStep] = useState<'form' | 'verify'>('form');
  const [emailOtp, setEmailOtp] = useState(['', '', '', '']);

  // Phone form state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [phoneStep, setPhoneStep] = useState<'form' | 'verify'>('form');
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);

  if (!isAuthModalOpen && currentUser) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setEmailStep('verify');
  };

  const handleVerifyEmail = () => {
    loginWithEmail(emailInput, emailName);
    setEmailStep('form');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 6) return;
    setPhoneStep('verify');
  };

  const handleVerifyPhone = () => {
    loginWithPhone(phoneInput, countryCode, phoneName);
    setPhoneStep('form');
  };

  const handleQuickGauravLogin = () => {
    loginWithEmail('gauravghumare145@gmail.com', 'Gaurav');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#111b21] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header with WhatsApp branding */}
        <div className="bg-[#008069] dark:bg-[#202c33] p-6 text-white relative">
          {currentUser && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors"
            >
              <X size={20} />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg viewBox="0 0 32 32" className="w-8 h-8 fill-[#25d366]">
                <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.2-1.9A13.9 13.9 0 1 0 16 2zm0 25.5a11.5 11.5 0 0 1-5.9-1.6l-.4-.3-4.4 1.2 1.2-4.3-.3-.5a11.6 11.6 0 1 1 9.8 5.5zm6.4-8.6c-.3-.2-2-.9-2.3-1s-.5-.2-.8.2-.9 1-1.1 1.2-.4.2-.7 0a9.2 9.2 0 0 1-2.7-1.7 10.2 10.2 0 0 1-1.9-2.3c-.2-.3 0-.5.2-.7s.4-.4.5-.6.2-.4.3-.6 0-.4 0-.6-.8-2-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7a1.4 1.4 0 0 0-1 .5 4.3 4.3 0 0 0-1.3 3.2 7.6 7.6 0 0 0 1.6 4 17.5 17.5 0 0 0 6.7 5.9c2.8 1.2 3.4 1 4 1a3.4 3.4 0 0 0 2.3-1.6 2.8 2.8 0 0 0 .2-1.6c-.2-.2-.5-.3-.9-.5z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">WhatsApp Web</h2>
              <p className="text-xs text-white/80">Log in with Gmail or Mobile Number</p>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111b21]">
          <button
            onClick={() => {
              setActiveTab('email');
              setEmailStep('form');
            }}
            className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'email'
                ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-[#202c33]'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            <Mail size={16} />
            <span>Gmail / Email</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('phone');
              setPhoneStep('form');
            }}
            className={`flex-1 py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'phone'
                ? 'border-[#00a884] text-[#00a884] bg-white dark:bg-[#202c33]'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            <Phone size={16} />
            <span>Mobile Number</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-6">
          {activeTab === 'email' ? (
            <div>
              {emailStep === 'form' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  {/* Quick Google one-tap account badge */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Google Account</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">gauravghumare145@gmail.com</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickGauravLogin}
                      className="px-3 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Continue
                    </button>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="grow border-t border-neutral-200 dark:border-neutral-800"></div>
                    <span className="shrink mx-3 text-xs text-neutral-400">or enter email</span>
                    <div className="grow border-t border-neutral-200 dark:border-neutral-800"></div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-neutral-400" size={18} />
                      <input
                        type="text"
                        value={emailName}
                        onChange={(e) => setEmailName(e.target.value)}
                        placeholder="e.g. Gaurav"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Continue with Email</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-[#00a884]">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      Verify Your Email
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      We sent a 4-digit verification code to <span className="font-semibold text-neutral-700 dark:text-neutral-300">{emailInput}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 my-4">
                    {emailOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`email-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextOtp = [...emailOtp];
                          nextOtp[idx] = val;
                          setEmailOtp(nextOtp);
                          if (val && idx < 3) {
                            document.getElementById(`email-otp-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-11 h-12 text-center text-lg font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirm & Enter WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailStep('form')}
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Edit Email Address
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {phoneStep === 'form' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Country & Code
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:border-[#00a884]"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.country} ({item.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-neutral-500 font-mono text-sm">
                        {countryCode}
                      </span>
                      <input
                        type="tel"
                        required
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="98765 43210"
                        className="w-full pl-16 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Profile Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-neutral-400" size={18} />
                      <input
                        type="text"
                        value={phoneName}
                        onChange={(e) => setPhoneName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 text-sm focus:outline-hidden focus:border-[#00a884]"
                      />
                    </div>
                  </div>

                  <p className="text-2xs text-neutral-500 dark:text-neutral-400">
                    Carrier SMS charges may apply. WhatsApp will send a one-time passcode to confirm your phone number.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Request SMS Code</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-[#00a884]">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      Enter 6-digit Code
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Enter the 6-digit code sent to <span className="font-semibold text-neutral-700 dark:text-neutral-300">{countryCode} {phoneInput}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-1.5 my-4">
                    {phoneOtp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`phone-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const nextOtp = [...phoneOtp];
                          nextOtp[idx] = val;
                          setPhoneOtp(nextOtp);
                          if (val && idx < 5) {
                            document.getElementById(`phone-otp-${idx + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-12 text-center text-lg font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#202c33] text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyPhone}
                    className="w-full py-2.5 px-4 bg-[#00a884] hover:bg-[#008f6f] text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 size={16} />
                    <span>Verify & Continue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhoneStep('form')}
                    className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Saved Profiles Switcher */}
          {savedProfiles.length > 0 && (
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
              <p className="text-2xs text-neutral-400 mb-2 flex items-center justify-center gap-1 font-semibold">
                <Sparkles size={12} className="text-emerald-500" />
                Select from Saved Profiles
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {savedProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => switchToProfile(p.id)}
                    className="px-2.5 py-1 text-2xs rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
