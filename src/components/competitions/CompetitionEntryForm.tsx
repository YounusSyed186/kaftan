'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Gift } from 'lucide-react';

interface CompetitionEntryFormProps {
  competitionId: string;
  competitionTitle: string;
  prizeSummary: string;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  retailer: string;
  receiptNumber: string;
  stylePreference: string;
  destinationNote: string;
  termsAccepted: boolean;
  newsletterOptIn: boolean;
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  retailer: 'Fashion Spectrum Online',
  receiptNumber: '',
  stylePreference: 'Full-Length Silk Maxi Kaftan',
  destinationNote: '',
  termsAccepted: false,
  newsletterOptIn: true,
};

export function CompetitionEntryForm({
  competitionId,
  competitionTitle,
  prizeSummary,
}: CompetitionEntryFormProps) {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    entryId: string;
    submittedAt: string;
    participantName: string;
    email: string;
    stylePreference: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!formData.termsAccepted) {
      setErrorMessage('Please confirm that you are an Australian resident aged 18+ and accept the Terms & Conditions.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/competitions/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competition_id: competitionId,
          participant_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          form_answers: {
            retailer: formData.retailer,
            receipt_number: formData.receiptNumber.trim() || 'READER_ENTRY',
            style_preference: formData.stylePreference,
            destination_note: formData.destinationNote.trim(),
            newsletter_opt_in: formData.newsletterOptIn,
            entered_at: new Date().toISOString(),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit entry. Please try again.');
      }

      setSuccessData({
        entryId: result.entry?.id || result.entry_id || `KAF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        submittedAt: result.entry?.submitted_at || new Date().toISOString(),
        participantName: formData.fullName.trim(),
        email: formData.email.trim(),
        stylePreference: formData.stylePreference,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSuccessData(null);
    setErrorMessage(null);
  };

  if (successData) {
    return (
      <div className="w-full bg-[#FAF8F5] border border-[#D8D1C5] p-6 sm:p-10 shadow-xs text-center transition-all">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-[#A48356]/15 border border-[#A48356]/30 flex items-center justify-center text-[#7E6139] mb-6">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#7E6139]" />
        </div>

        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7E6139] font-bold block mb-2">
          ENTRY CONFIRMED &mdash;
        </span>

        <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F] mb-3">
          You are in the draw to win!
        </h3>

        <p className="text-xs sm:text-sm text-[#524E48] max-w-md mx-auto leading-relaxed mb-6">
          Thank you, <strong className="text-[#25221F]">{successData.participantName}</strong>. Your entry for the{' '}
          <strong className="text-[#25221F]">{competitionTitle}</strong> has been officially logged in our verification draw.
        </p>

        <div className="bg-[#F7F4ED] border border-[#D8D1C5] p-4 sm:p-5 max-w-md mx-auto text-left mb-8 space-y-2.5 text-xs text-[#524E48]">
          <div className="flex justify-between items-center border-b border-[#D8D1C5]/60 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77716A]">Entry Reference:</span>
            <span className="font-mono font-bold text-[#25221F] text-[11px]">{successData.entryId}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#D8D1C5]/60 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77716A]">Registered Email:</span>
            <span className="font-medium text-[#25221F] truncate max-w-[200px]">{successData.email}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[#D8D1C5]/60 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77716A]">Preferred Garment:</span>
            <span className="font-medium text-[#25221F]">{successData.stylePreference}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77716A]">Prize Pool:</span>
            <span className="font-medium text-[#A94F42]">{prizeSummary}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-3 border border-[#D8D1C5] text-[10px] uppercase tracking-[0.2em] font-semibold text-[#25221F] bg-[#FCFAF6] hover:bg-[#EFEAE0] transition-colors"
          >
            Submit Another Receipt Entry
          </button>
          <a
            href="/latest"
            className="w-full sm:w-auto px-6 py-3 bg-[#25221F] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#3D3833] transition-colors"
          >
            Explore Latest Stories &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      id="enter-form"
      onSubmit={handleSubmit}
      className="w-full bg-[#FCFAF6] border border-[#D8D1C5] p-6 sm:p-8 lg:p-10 shadow-xs relative"
    >
      <div className="flex items-center space-x-2 text-[#7E6139] mb-4">
        <Sparkles className="w-4 h-4 text-[#A48356]" />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
          OFFICIAL ENTRY FORM
        </span>
      </div>

      <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F] mb-2 leading-tight">
        Enter the Luxury Draw
      </h3>
      <p className="text-xs text-[#77716A] mb-8 leading-relaxed max-w-xl">
        Complete your details below to enter. Eligible receipts from Fashion Spectrum or participating Australian
        stockists provide bonus weighted entries.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 border border-[#B44238]/40 bg-[#B44238]/10 text-[#8f322a] text-xs flex items-start gap-2.5 rounded-none"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B44238]" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
          >
            Full Name <span className="text-[#A94F42]">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Charlotte Montgomery"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
          />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
          >
            Email Address <span className="text-[#A94F42]">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="charlotte@example.com.au"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
          >
            Mobile Number <span className="text-[#77716A] text-[9px] font-normal">(for winner SMS notification)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0412 345 678"
            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
          />
        </div>

        {/* Retailer / Purchase Channel */}
        <div>
          <label
            htmlFor="retailer"
            className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
          >
            Where Did You Shop or Discover Us?
          </label>
          <select
            id="retailer"
            value={formData.retailer}
            onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] focus:outline-none focus:border-[#25221F] transition-colors"
          >
            <option value="Fashion Spectrum Online">Fashion Spectrum Online (fashionspectrum.com.au)</option>
            <option value="David Jones">David Jones Australia (Store or Online)</option>
            <option value="Myer">Myer Department Stores</option>
            <option value="Independent Boutique">Independent Resort Boutique</option>
            <option value="KAFTAN Magazine Reader Entry">KAFTAN Magazine Reader (No purchase)</option>
          </select>
        </div>
      </div>

      {/* Proof of purchase receipt number */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor="receiptNumber"
            className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold"
          >
            Receipt, Invoice or Order Number <span className="text-[#77716A] text-[9px] font-normal">(Optional for Reader Draw)</span>
          </label>
          <span className="text-[9px] font-mono text-[#A48356] font-semibold tracking-wider uppercase">
            3x Bonus Draw Entries
          </span>
        </div>
        <input
          id="receiptNumber"
          type="text"
          value={formData.receiptNumber}
          onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
          placeholder="e.g. FS-94821 or store register receipt # (leave blank if reader entry)"
          className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
        />
        <p className="text-[10px] text-[#77716A] mt-1">
          Purchased a kaftan in-store or online? Enter the order/receipt reference code printed on your receipt.
        </p>
      </div>

      {/* Style Preference */}
      <div className="mb-5">
        <label
          htmlFor="stylePreference"
          className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
        >
          If You Win, Which Style Would You Prefer?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            'Full-Length Silk Maxi Kaftan',
            'Crystal Embellished Short Tunic',
            'Bohemian Silk Kimono Duster',
          ].map((style) => (
            <label
              key={style}
              className={`flex items-center p-3 border cursor-pointer text-xs transition-colors ${
                formData.stylePreference === style
                  ? 'border-[#25221F] bg-[#F7F4ED] text-[#25221F] font-medium'
                  : 'border-[#D8D1C5] bg-[#FAF8F5] text-[#524E48] hover:border-[#77716A]'
              }`}
            >
              <input
                type="radio"
                name="stylePreference"
                value={style}
                checked={formData.stylePreference === style}
                onChange={(e) => setFormData({ ...formData, stylePreference: e.target.value })}
                className="mr-2.5 text-[#25221F] focus:ring-0"
              />
              <span className="text-[11px]">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dream Destination */}
      <div className="mb-6">
        <label
          htmlFor="destinationNote"
          className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#25221F] font-semibold mb-1.5"
        >
          What is your dream Australian or coastal getaway destination?
        </label>
        <input
          id="destinationNote"
          type="text"
          value={formData.destinationNote}
          onChange={(e) => setFormData({ ...formData, destinationNote: e.target.value })}
          placeholder="e.g. Palm Cove, Whitsundays, or the Amalfi Coast"
          className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D1C5] text-[#25221F] placeholder:text-[#A8A29A] focus:outline-none focus:border-[#25221F] transition-colors"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-8 pt-2 border-t border-[#D8D1C5]/70">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#524E48]">
          <input
            type="checkbox"
            required
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
            className="mt-0.5 rounded-none border-[#D8D1C5] text-[#25221F] focus:ring-0"
          />
          <span className="leading-tight text-[11px]">
            I confirm I am an Australian resident aged 18 years or older and I agree to the competition{' '}
            <a href="#terms" className="underline text-[#25221F] hover:text-[#A94F42]">
              Terms &amp; Conditions
            </a>
            . <span className="text-[#A94F42]">*</span>
          </span>
        </label>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#524E48]">
          <input
            type="checkbox"
            checked={formData.newsletterOptIn}
            onChange={(e) => setFormData({ ...formData, newsletterOptIn: e.target.checked })}
            className="mt-0.5 rounded-none border-[#D8D1C5] text-[#25221F] focus:ring-0"
          />
          <span className="leading-tight text-[11px]">
            Keep me inspired with KAFTAN Australia&apos;s weekly resort editorial newsletter, new designer arrivals, and exclusive invitations.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#25221F] text-[#FAF8F5] text-[10px] uppercase tracking-[0.24em] font-semibold hover:bg-[#3E3833] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-[#FAF8F5]" />
            <span>Submitting Entry...</span>
          </>
        ) : (
          <>
            <Gift className="w-3.5 h-3.5 mr-2 text-[#A48356]" />
            <span>Submit My Entry into the Draw &rarr;</span>
          </>
        )}
      </button>
    </form>
  );
}

