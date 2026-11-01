'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Gift,
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  Award,
  ArrowDown,
} from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { CompetitionEntryForm } from './CompetitionEntryForm';
import type { PopulatedCompetition } from '@/types/models';

interface CompetitionPageClientProps {
  competition: PopulatedCompetition;
}

export function CompetitionPageClient({ competition }: CompetitionPageClientProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('eligibility');

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const heroImage = buildCloudinaryUrl(
    'kaftan/editorial/competition-strawhat-beach',
    { width: 1600 }
  );

  const formattedEndDate = new Date(competition.end_time).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full bg-[#F7F4ED] pb-16">
      {/* =========================================================================
          BREADCRUMB & HEADER MASTHEAD
          ========================================================================= */}
      <div className="w-full border-b border-[#D8D1C5] bg-[#FAF8F5]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-[#77716A]">
            <Link href="/" className="hover:text-[#25221F] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-[#D8D1C5]">/</span>
            <span className="text-[#77716A]">Competitions</span>
            <span className="mx-2 text-[#D8D1C5]">/</span>
            <span className="text-[#25221F] font-semibold truncate max-w-[240px] sm:max-w-none">
              {competition.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-10">
        {/* =========================================================================
            EDITORIAL HERO SECTION
            ========================================================================= */}
        <div className="w-full border border-[#D8D1C5] bg-[#FCFAF6] overflow-hidden relative shadow-xs mb-10 sm:mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center space-x-2 text-[#A94F42] mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
                    KAFTAN LUXURY GIVEAWAY
                  </span>
                </div>

                <h1 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.05] text-[#25221F] font-normal tracking-[-0.01em] mb-4">
                  {competition.title}
                </h1>

                <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed max-w-xl mb-6">
                  {competition.description ||
                    'Purchase an eligible kaftan, scan your receipt and go in the draw to win a stunning silk resort kaftan from Fashion Spectrum.'}
                </p>

                {/* Key specs badge strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#D8D1C5]/70 mb-8">
                  <div className="bg-[#FAF8F5] border border-[#D8D1C5] p-3 text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#77716A] block">
                      Prize Value
                    </span>
                    <span className="font-serif-editorial text-lg text-[#25221F] font-semibold">
                      Up to $350 AUD
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#D8D1C5] p-3 text-left">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#77716A] block">
                      Draw Closes
                    </span>
                    <span className="font-serif-editorial text-lg text-[#25221F] font-semibold">
                      {formattedEndDate}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-[#D8D1C5] p-3 text-left col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#77716A] block">
                      Eligibility
                    </span>
                    <span className="font-serif-editorial text-lg text-[#25221F] font-semibold">
                      AU Residents 18+
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Jump Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href="#enter-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-[#25221F] text-[#FAF8F5] text-[10px] uppercase tracking-[0.22em] font-semibold hover:bg-[#3E3833] transition-colors"
                >
                  <span>Enter the Draw Now</span>
                  <ArrowDown className="w-3.5 h-3.5 ml-2" />
                </a>

                <a
                  href="#prize-details"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-[#D8D1C5] bg-[#FAF8F5] text-[#25221F] text-[10px] uppercase tracking-[0.22em] font-semibold hover:bg-[#EFEAE0] transition-colors"
                >
                  <span>View Prize Garment</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual with Gold Circular Seal */}
            <div className="lg:col-span-5 relative min-h-[320px] sm:min-h-[420px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-[#D8D1C5]">
              <Image
                src={heroImage}
                alt="Fashion Spectrum Silk Kaftan on Mediterranean terrace"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />

              {/* Subtle gradient vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Floating Gold Luxury Seal */}
              <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-center shadow-lg select-none"
                  style={{
                    background: 'linear-gradient(135deg, #A48356 0%, #7E6139 100%)',
                    boxShadow: '0 6px 20px rgba(126, 97, 57, 0.4)',
                  }}
                >
                  <span className="font-serif-editorial text-[13px] sm:text-[15px] font-normal leading-tight text-[#FAF7F2] uppercase tracking-wider">
                    WIN A
                  </span>
                  <span className="font-serif-editorial text-[14px] sm:text-[16px] font-bold leading-tight text-[#FAF7F2] uppercase tracking-wider">
                    KAFTAN
                  </span>
                  <span className="text-[7.5px] sm:text-[8px] font-mono tracking-widest text-[#FAF7F2]/90 uppercase mt-0.5">
                    $350 VALUE
                  </span>
                </div>
              </div>

              {/* Caption Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#FCFAF6]/90 backdrop-blur-xs p-2.5 border border-[#D8D1C5] text-[10px] text-[#25221F] flex items-center justify-between">
                <span className="font-mono uppercase tracking-wider text-[9px] text-[#77716A]">
                  FASHION SPECTRUM RESORT 2026
                </span>
                <span className="text-[10px] text-[#A48356] font-semibold">100% Pure Silk</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HOW IT WORKS — 3 STEP VISUAL GUIDE
            ========================================================================= */}
        <section aria-labelledby="how-it-works-heading" className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#77716A] font-bold block mb-1.5">
              STEP-BY-STEP &mdash;
            </span>
            <h2 id="how-it-works-heading" className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F]">
              How to Enter the Luxury Giveaway
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FCFAF6] border border-[#D8D1C5] p-6 text-left relative flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif-editorial text-[#A48356] font-bold block mb-3">
                  01
                </span>
                <h3 className="font-serif-editorial text-lg text-[#25221F] mb-2 font-medium">
                  Shop or Discover
                </h3>
                <p className="text-xs text-[#524E48] leading-relaxed">
                  Purchase any eligible kaftan online at Fashion Spectrum or at authorized stockists (David Jones, Myer,
                  and resort boutiques). Readers may also enter via our editorial discovery draw.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D8D1C5]/60 text-[10px] font-mono uppercase tracking-wider text-[#77716A]">
                Keep Your Receipt Code
              </div>
            </div>

            <div className="bg-[#FCFAF6] border border-[#D8D1C5] p-6 text-left relative flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif-editorial text-[#A48356] font-bold block mb-3">
                  02
                </span>
                <h3 className="font-serif-editorial text-lg text-[#25221F] mb-2 font-medium">
                  Submit Receipt &amp; Preferences
                </h3>
                <p className="text-xs text-[#524E48] leading-relaxed">
                  Complete the official entry form with your contact details and receipt/invoice number. Verified
                  purchases earn 3x bonus entries into the draw pool.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D8D1C5]/60 text-[10px] font-mono uppercase tracking-wider text-[#A48356] font-semibold">
                3x Bonus Entries for Purchases
              </div>
            </div>

            <div className="bg-[#FCFAF6] border border-[#D8D1C5] p-6 text-left relative flex flex-col justify-between">
              <div>
                <span className="text-2xl font-serif-editorial text-[#A48356] font-bold block mb-3">
                  03
                </span>
                <h3 className="font-serif-editorial text-lg text-[#25221F] mb-2 font-medium">
                  Monthly Winner Draw
                </h3>
                <p className="text-xs text-[#524E48] leading-relaxed">
                  Winners are drawn at the end of each promotional period and contacted directly by the KAFTAN editorial
                  team. Your silk kaftan is delivered anywhere in Australia with insured courier.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#D8D1C5]/60 text-[10px] font-mono uppercase tracking-wider text-[#77716A]">
                Notification via Email &amp; SMS
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            PRIZE SHOWCASE & BRAND SPOTLIGHT
            ========================================================================= */}
        <section
          id="prize-details"
          aria-labelledby="prize-showcase-heading"
          className="w-full bg-[#FCFAF6] border border-[#D8D1C5] p-6 sm:p-10 lg:p-12 mb-14 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#A48356] font-bold block">
                THE PRIZE &mdash; FASHION SPECTRUM
              </span>

              <h2 id="prize-showcase-heading" className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl text-[#25221F] leading-tight">
                Pure Silk Elegance Tailored for the Australian Lifestyle
              </h2>

              <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed">
                Fashion Spectrum has been at the forefront of Australian resort luxury for over two decades. Renowned
                for fluid silhouettes, hand-applied crystals, and exclusive hand-painted motifs, each piece moves
                effortlessly from beachside afternoons to twilight dinner parties.
              </p>

              <div className="space-y-3 pt-2">
                {competition.prizes && competition.prizes.length > 0 ? (
                  competition.prizes.map((prize, idx) => (
                    <div
                      key={prize.id || idx}
                      className="border border-[#D8D1C5] bg-[#FAF8F5] p-4 flex items-start space-x-3.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#A48356]/15 border border-[#A48356]/40 flex items-center justify-center shrink-0 text-[#7E6139]">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-base text-[#25221F] font-semibold">
                          {prize.title}
                        </h4>
                        <p className="text-xs text-[#77716A] leading-relaxed mt-1">
                          {prize.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-[#D8D1C5] bg-[#FAF8F5] p-4 flex items-start space-x-3.5">
                    <div className="w-8 h-8 rounded-full bg-[#A48356]/15 border border-[#A48356]/40 flex items-center justify-center shrink-0 text-[#7E6139]">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif-editorial text-base text-[#25221F] font-semibold">
                        Grand Prize: Luxury Silk Kaftan of Choice
                      </h4>
                      <p className="text-xs text-[#77716A] leading-relaxed mt-1">
                        {competition.prize_summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 text-xs text-[#524E48] flex flex-wrap gap-y-2 gap-x-6">
                <span className="flex items-center text-[11px]">
                  <Check className="w-3.5 h-3.5 text-[#A48356] mr-1.5" />
                  100% Pure Silk Crepe &amp; Georgette
                </span>
                <span className="flex items-center text-[11px]">
                  <Check className="w-3.5 h-3.5 text-[#A48356] mr-1.5" />
                  Sizes XS through 3XL Available
                </span>
                <span className="flex items-center text-[11px]">
                  <Check className="w-3.5 h-3.5 text-[#A48356] mr-1.5" />
                  Express Insured National Delivery
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] border border-[#D8D1C5] overflow-hidden">
                <Image
                  src={buildCloudinaryUrl('kaftan/editorial/art-4-cover', { width: 800 })}
                  alt="Model showcasing luxury silk kaftan"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#FCFAF6]/90 p-2 text-[9px] font-mono uppercase tracking-wider text-[#25221F] text-center border border-[#D8D1C5]">
                  Maxi Silk Kaftan
                </div>
              </div>

              <div className="relative aspect-[3/4] border border-[#D8D1C5] overflow-hidden mt-6 lg:mt-8">
                <Image
                  src={buildCloudinaryUrl('kaftan/editorial/hero-mediterranean-resortwear', { width: 800 })}
                  alt="Model in resortwear overlooking the sea"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-[#FCFAF6]/90 p-2 text-[9px] font-mono uppercase tracking-wider text-[#25221F] text-center border border-[#D8D1C5]">
                  Crystal Short Tunic
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            THE INTERACTIVE ENTRY FORM
            ========================================================================= */}
        <section aria-label="Official Competition Entry" className="mb-14">
          <div className="max-w-3xl mx-auto">
            <CompetitionEntryForm
              competitionId={competition.id}
              competitionTitle={competition.title}
              prizeSummary={competition.prize_summary}
            />
          </div>
        </section>

        {/* =========================================================================
            PAST WINNERS & READER TRUST
            ========================================================================= */}
        <section aria-labelledby="winners-heading" className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#77716A] font-bold block mb-1.5">
              COMMUNITY &mdash;
            </span>
            <h2 id="winners-heading" className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F]">
              Recent Giveaway Recipients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#FCFAF6] border border-[#D8D1C5] p-6 text-left">
              <div className="flex items-center justify-between border-b border-[#D8D1C5]/60 pb-3 mb-3">
                <span className="font-serif-editorial text-base text-[#25221F] font-semibold">
                  Sarah M. &mdash; Noosa, QLD
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#A48356]">
                  October Draw Winner
                </span>
              </div>
              <p className="text-xs text-[#524E48] italic leading-relaxed mb-3">
                &ldquo;Receiving the Fashion Spectrum silk maxi in the mail was such a dream! The pure silk fabric is so
                breathtakingly light and the hand-set crystal detailing on the collar glistens in the sun.&rdquo;
              </p>
              <span className="text-[10px] font-mono text-[#77716A]">Won: Sunset Radiance Silk Maxi ($349 AUD)</span>
            </div>

            <div className="bg-[#FCFAF6] border border-[#D8D1C5] p-6 text-left">
              <div className="flex items-center justify-between border-b border-[#D8D1C5]/60 pb-3 mb-3">
                <span className="font-serif-editorial text-base text-[#25221F] font-semibold">
                  Victoria H. &mdash; Double Bay, NSW
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#A48356]">
                  September Draw Winner
                </span>
              </div>
              <p className="text-xs text-[#524E48] italic leading-relaxed mb-3">
                &ldquo;I purchased my kaftan from David Jones and simply uploaded my receipt number. Two weeks later I
                received the call! Fantastic initiative from KAFTAN Australia.&rdquo;
              </p>
              <span className="text-[10px] font-mono text-[#77716A]">Won: Mediterranean Azure Tunic ($329 AUD)</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TERMS & FAQ ACCORDION
            ========================================================================= */}
        <section id="terms" aria-labelledby="terms-heading" className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[9.5px] font-mono uppercase tracking-[0.25em] text-[#77716A] font-bold block mb-1.5">
              LEGAL &amp; POLICIES &mdash;
            </span>
            <h2 id="terms-heading" className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F]">
              Terms, Conditions &amp; FAQs
            </h2>
          </div>

          <div className="bg-[#FCFAF6] border border-[#D8D1C5] divide-y divide-[#D8D1C5]">
            {/* Eligibility Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('eligibility')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
              >
                <span className="font-serif-editorial text-lg text-[#25221F]">
                  1. Who is eligible to enter?
                </span>
                {activeAccordion === 'eligibility' ? (
                  <ChevronUp className="w-4 h-4 text-[#77716A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#77716A]" />
                )}
              </button>
              {activeAccordion === 'eligibility' && (
                <div className="px-6 pb-5 text-xs text-[#524E48] leading-relaxed bg-[#FAF8F5]/60">
                  <p>
                    Entry is open to all permanent residents of Australia aged 18 years or older at the time of entry.
                    Employees of KAFTAN Publication, Fashion Spectrum Australia, and their immediate families are
                    ineligible to participate.
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Requirement Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('purchase')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
              >
                <span className="font-serif-editorial text-lg text-[#25221F]">
                  2. Do I need to purchase a kaftan to enter?
                </span>
                {activeAccordion === 'purchase' ? (
                  <ChevronUp className="w-4 h-4 text-[#77716A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#77716A]" />
                )}
              </button>
              {activeAccordion === 'purchase' && (
                <div className="px-6 pb-5 text-xs text-[#524E48] leading-relaxed bg-[#FAF8F5]/60">
                  <p>
                    No purchase is necessary for the standard reader draw. However, participants who enter with a verified
                    receipt or tax invoice number from an authorized Fashion Spectrum stockist (including David Jones,
                    Myer, and independent stockists) receive three (3) weighted bonus entries into the draw pool.
                  </p>
                </div>
              )}
            </div>

            {/* Draw Mechanics Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('draw')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
              >
                <span className="font-serif-editorial text-lg text-[#25221F]">
                  3. How is the winner chosen and notified?
                </span>
                {activeAccordion === 'draw' ? (
                  <ChevronUp className="w-4 h-4 text-[#77716A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#77716A]" />
                )}
              </button>
              {activeAccordion === 'draw' && (
                <div className="px-6 pb-5 text-xs text-[#524E48] leading-relaxed bg-[#FAF8F5]/60">
                  <p>
                    The winner is selected at random from all verified eligible entries within five (5) business days
                    following promotional closure on 31 December 2026. The winner will be contacted directly via email and
                    SMS. If the winner cannot be contacted within 14 days, a redraw will take place.
                  </p>
                </div>
              )}
            </div>

            {/* Prize Terms Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('prize_terms')}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition-colors"
              >
                <span className="font-serif-editorial text-lg text-[#25221F]">
                  4. Prize terms, sizing &amp; delivery
                </span>
                {activeAccordion === 'prize_terms' ? (
                  <ChevronUp className="w-4 h-4 text-[#77716A]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#77716A]" />
                )}
              </button>
              {activeAccordion === 'prize_terms' && (
                <div className="px-6 pb-5 text-xs text-[#524E48] leading-relaxed bg-[#FAF8F5]/60">
                  <p className="mb-2">
                    {competition.terms ||
                      'Open to Australian residents aged 18+. Competition closes 31 Dec 2026. Terms and conditions apply.'}
                  </p>
                  <p>
                    The prize cannot be transferred, exchanged, or redeemed for cash. Sizing is subject to availability
                    at the time of winner selection (available sizes XS to 3XL). The prize includes standard express
                    national delivery anywhere in Australia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

