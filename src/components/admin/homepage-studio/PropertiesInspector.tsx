'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  ExternalLink,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  Type,
  Layout,
  Check,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { useHomepageStudioStore } from '@/stores/homepage-studio-store';
import { MediaField } from './MediaField';
import type { PopulatedArticle, PopulatedProduct, PopulatedAdCreative } from '@/types/models';
import type {
  MediaReferenceOverride,
  ItemContentOverrides,
} from '@/types/content-overrides';

const AD_CAMPAIGN_PRESETS = [
  {
    id: 'ad-fs-1',
    name: 'Fashion Spectrum Resort (Default)',
    sponsor: 'FASHION SPECTRUM',
    headline: 'EFFORTLESS KAFTANS FOR EVERY OCCASION',
    copy: 'Discover handcrafted Australian silk kaftans designed for resort elegance and effortless summer living.',
    url: 'https://fashionspectrum.com.au/collection',
    image: 'kaftan/editorial/ad-fashion-spectrum',
  },
  {
    id: 'ad-dj-2',
    name: 'David Jones Luxury Edit',
    sponsor: 'DAVID JONES AUSTRALIA',
    headline: 'SPRING RESORTWEAR AT DAVID JONES',
    copy: 'Explore curated Australian designer resort kaftans across flagship department stores.',
    url: 'https://davidjones.com',
    image: 'kaftan/editorial/hero-mediterranean-resortwear',
  },
  {
    id: 'ad-camilla-3',
    name: 'Camilla Silk Runway Feature',
    sponsor: 'CAMILLA LUXURY',
    headline: 'VIBRANT ARTISANAL SILK KAFTANS',
    copy: 'Artisanal bohemian statement silhouettes inspired by travel and contemporary Australian craft.',
    url: 'https://camilla.com',
    image: 'kaftan/products/gold-coast-silk-kaftan',
  },
  {
    id: 'ad-silk-4',
    name: 'Silk Islands Collection',
    sponsor: 'SILK ISLANDS RESORT',
    headline: 'TIMELESS MEDITERRANEAN KAFTANS',
    copy: 'Lightweight breathable silk pieces tailored for beachside getaways and warm European sunsets.',
    url: 'https://silkislands.com.au',
    image: 'kaftan/products/azure-resort-kaftan',
  },
];

const inputClass =
  'w-full px-3 py-1.5 bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] text-xs focus:outline-none focus:border-[#A94F42] focus:ring-1 focus:ring-[#A94F42]/20 transition-colors';
const textareaClass =
  'w-full px-3 py-2 bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] text-xs focus:outline-none focus:border-[#A94F42] focus:ring-1 focus:ring-[#A94F42]/20 transition-colors';
const monoInputClass =
  'w-full px-3 py-1.5 bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] text-xs font-mono focus:outline-none focus:border-[#A94F42] focus:ring-1 focus:ring-[#A94F42]/20 transition-colors';

interface PropertiesInspectorProps {
  allArticles: PopulatedArticle[];
  allProducts?: PopulatedProduct[];
}

export function PropertiesInspector({
  allArticles,
  allProducts = [],
}: PropertiesInspectorProps) {
  const {
    sections,
    selectedSectionId,
    selectedElementId,
    selectedElementType,
    selectElement,
    updateSection,
    updateSectionSettings,
    setItemOverride,
    resetItemOverride,
    setSectionFieldOverride,
    resetSectionFieldOverride,
    setSlotArticle,
    setSlotProduct,
    setSlotAdCreative,
    deleteSection,
  } = useHomepageStudioStore();

  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'layout'>('content');
  const [articleSearch, setArticleSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [slot2PickerMode, setSlot2PickerMode] = useState<'campaigns' | 'stories'>('campaigns');
  const [selectingSlotIndex, setSelectingSlotIndex] = useState<number | null>(null);
  const [selectingLatestIndex, setSelectingLatestIndex] = useState<number | null>(null);

  // Auto-switch inspector tab and smoothly scroll to the clicked canvas element
  useEffect(() => {
    if (!selectedElementId) return;

    const idLower = selectedElementId.toLowerCase();
    let targetTab: 'content' | 'media' | 'layout' = 'content';

    if (
      selectedElementType === 'image' ||
      idLower.includes('image') ||
      idLower.includes('photo') ||
      idLower.includes('creative')
    ) {
      targetTab = 'media';
    } else if (
      selectedElementType === 'slot' ||
      idLower.startsWith('latest_slot_') ||
      idLower.startsWith('slot_') ||
      idLower.startsWith('product_card_')
    ) {
      targetTab = 'layout';
      if (idLower.startsWith('latest_slot_')) {
        const slotIdx = parseInt(idLower.replace('latest_slot_', ''), 10);
        if (!isNaN(slotIdx)) {
          setSelectingLatestIndex(slotIdx);
        }
      } else if (idLower.startsWith('slot_')) {
        const slotIdx = parseInt(idLower.replace('slot_', ''), 10);
        if (!isNaN(slotIdx)) {
          setSelectingSlotIndex(slotIdx);
        }
      } else if (idLower.startsWith('product_card_')) {
        const slotIdx = parseInt(idLower.replace('product_card_', ''), 10);
        if (!isNaN(slotIdx)) {
          setSelectingSlotIndex(slotIdx);
        }
      }
    } else {
      targetTab = 'content';
    }

    setActiveTab(targetTab);

    // Schedule smooth scroll and focus pulse after tab DOM render
    const timer = setTimeout(() => {
      const targetEl =
        document.getElementById(`inspector-element-${selectedElementId}`) ||
        document.getElementById(`inspector-slot-${selectedElementId}`) ||
        document.querySelector(`[data-inspector-id="${selectedElementId}"]`);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('ring-2', 'ring-[#A94F42]', 'ring-offset-2', 'transition-all');
        const clearTimer = setTimeout(() => {
          targetEl.classList.remove('ring-offset-2');
        }, 1800);
        return () => clearTimeout(clearTimer);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedElementId, selectedElementType]);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSection) {
    return (
      <aside className="w-[380px] xl:w-[420px] shrink-0 bg-[#FFFEFA] text-[#25221F] border-l border-[#D8D1C5] p-6 flex flex-col items-center justify-center text-center text-[#77716A]">
        <Sliders className="w-8 h-8 text-stone-300 mb-3" />
        <p className="font-serif-editorial text-lg text-[#25221F]">No Section Selected</p>
        <p className="text-xs mt-1 max-w-[220px]">
          Click any section or editorial element in the live preview to inspect and edit its content.
        </p>
      </aside>
    );
  }

  const settings =
    typeof selectedSection.settings === 'object' &&
    selectedSection.settings !== null &&
    !Array.isArray(selectedSection.settings)
      ? (selectedSection.settings as Record<string, any>)
      : {};

  const itemOverrides = (settings.item_overrides as Record<string, ItemContentOverrides>) || {};

  // Primary article for hero or primary slot
  const sectionArticles = (selectedSection.items || [])
    .map((it) => it.article)
    .filter(Boolean) as PopulatedArticle[];
  const primaryArticle = sectionArticles[0] || allArticles[0];

  const primaryItem = selectedSection.items?.[0];
  const primaryItemId = primaryItem?.id || 'item-primary';
  const primaryItemOverride = itemOverrides[primaryItemId] || {};

  // Latest articles resolution for hero sidebar
  const defaultLatest = allArticles
    .filter((a) => a.id !== primaryArticle?.id)
    .slice(0, 4);

  const latestIds: (string | undefined)[] = Array.isArray(settings.latest_article_ids)
    ? settings.latest_article_ids
    : [];

  const latestArticles: PopulatedArticle[] = [0, 1, 2, 3].map((idx) => {
    const customId = latestIds[idx];
    if (customId) {
      const found = allArticles.find((a) => a.id === customId);
      if (found) return found;
    }
    return defaultLatest[idx] || allArticles[idx] || primaryArticle;
  });

  return (
    <aside className="w-[380px] xl:w-[420px] shrink-0 bg-[#FFFEFA] text-[#25221F] border-l border-[#D8D1C5] flex flex-col h-full overflow-hidden shadow-xs">
      {/* Header: Section identity + Selected Element Badge */}
      <div className="p-4 border-b border-[#D8D1C5] bg-[#FAF8F5]">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#A94F42] block">
              Editorial Studio Inspector
            </span>
            <h3 className="font-serif-editorial text-base font-semibold text-[#25221F] truncate">
              {selectedSection.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove section "${selectedSection.name}" from homepage?`)) {
                deleteSection(selectedSection.id);
              }
            }}
            title="Delete Section"
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-xs hover:bg-stone-100 transition-colors ml-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Element Pill */}
        {selectedElementId && (
          <div className="mt-2.5 flex items-center justify-between bg-[#EFEAE0] border border-[#D8D1C5] px-2.5 py-1 rounded-xs text-[10px]">
            <div className="flex items-center gap-1.5 text-[#25221F] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A94F42]" />
              <span className="font-semibold uppercase">{selectedElementId.replace(/_/g, ' ')}</span>
            </div>
            <button
              onClick={() => selectElement(null, null)}
              className="text-[#77716A] hover:text-[#25221F] font-mono text-[9px] uppercase tracking-wider"
            >
              Clear Focus &times;
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-[#D8D1C5] bg-[#FAF8F5] flex space-x-6 text-[11px] font-mono uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-3 border-b-2 font-semibold transition-all ${
            activeTab === 'content'
              ? 'border-[#A94F42] text-[#A94F42]'
              : 'border-transparent text-[#77716A] hover:text-[#25221F]'
          }`}
        >
          Content &amp; Text
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`py-3 border-b-2 font-semibold transition-all ${
            activeTab === 'media'
              ? 'border-[#A94F42] text-[#A94F42]'
              : 'border-transparent text-[#77716A] hover:text-[#25221F]'
          }`}
        >
          Media &amp; Images
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`py-3 border-b-2 font-semibold transition-all ${
            activeTab === 'layout'
              ? 'border-[#A94F42] text-[#A94F42]'
              : 'border-transparent text-[#77716A] hover:text-[#25221F]'
          }`}
        >
          Layout &amp; Slots
        </button>
      </div>

      {/* Scrollable Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* ===================================================================
            TAB 1: CONTENT & TEXT
            =================================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            {/* 1. HERO EDITORIAL SECTION */}
            {selectedSection.section_key === 'hero_editorial' && (
              <>
                {/* Eyebrow */}
                <div id="inspector-element-eyebrow" data-inspector-id="eyebrow" className="space-y-1 transition-all rounded-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#25221F] tracking-wider">
                      Eyebrow Kicker
                    </label>
                    {settings.eyebrow && (
                      <button
                        onClick={() => resetSectionFieldOverride(selectedSection.id, 'eyebrow')}
                        className="text-[9px] text-[#A94F42] hover:underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={settings.eyebrow || 'EXCLUSIVE PREVIEW'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'eyebrow', e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                {/* Main Headline (with Inherited vs Override state) */}
                <div id="inspector-element-heading_override" data-inspector-id="heading_override" className="space-y-1.5 p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#25221F] tracking-wider">
                      Hero Headline
                    </label>
                    <div className="flex items-center gap-1.5">
                      {settings.heading_override ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#A94F42]/15 text-[#A94F42] font-semibold rounded-2xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> OVERRIDDEN
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-2xs">
                          INHERITED
                        </span>
                      )}
                      {settings.heading_override && (
                        <button
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'heading_override')}
                          title="Reset to Original Article Title"
                          className="p-1 text-stone-400 hover:text-[#A94F42]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={settings.heading_override !== undefined ? settings.heading_override : primaryArticle?.title || ''}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'heading_override', e.target.value)
                    }
                    placeholder="Enter homepage headline..."
                    className={`${textareaClass} font-serif-editorial text-sm font-medium`}
                  />

                  {primaryArticle && (
                    <div className="flex items-center justify-between text-[10px] text-[#77716A] pt-1 border-t border-[#D8D1C5]/40">
                      <span className="truncate max-w-[200px]">Article: {primaryArticle.title}</span>
                      <Link
                        href={`/stories/${primaryArticle.slug}`}
                        target="_blank"
                        className="text-[#A94F42] hover:underline flex items-center gap-1 shrink-0 font-medium"
                      >
                        Edit Article <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div id="inspector-element-description_override" data-inspector-id="description_override" className="space-y-1.5 p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs transition-all">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold text-[#25221F] tracking-wider">
                      Hero Description
                    </label>
                    <div className="flex items-center gap-1.5">
                      {settings.description_override ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#A94F42]/15 text-[#A94F42] font-semibold rounded-2xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> OVERRIDDEN
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-2xs">
                          INHERITED
                        </span>
                      )}
                      {settings.description_override && (
                        <button
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'description_override')}
                          title="Reset to Original Article Excerpt"
                          className="p-1 text-stone-400 hover:text-[#A94F42]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={settings.description_override !== undefined ? settings.description_override : primaryArticle?.excerpt || ''}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'description_override', e.target.value)
                    }
                    placeholder="Enter homepage description..."
                    className={textareaClass}
                  />
                </div>

                {/* CTA Action */}
                <div id="inspector-element-hero_cta" data-inspector-id="hero_cta" className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-2 transition-all">
                  <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                      CTA Label
                    </label>
                    <input
                      type="text"
                      value={settings.cta_label || 'EXPLORE STORY'}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'cta_label', e.target.value)
                      }
                      className={`${inputClass} font-semibold uppercase`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                      CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={settings.cta_url || (primaryArticle ? `/stories/${primaryArticle.slug}` : '#')}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'cta_url', e.target.value)
                      }
                      className={monoInputClass}
                    />
                  </div>
                </div>
              </div>

                {/* The Latest Sidebar Story Headlines */}
                <div className="space-y-3 pt-3 border-t border-[#D8D1C5]">
                  <div className="bg-[#FAF8F5] p-2.5 border border-[#D8D1C5] rounded-xs">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                      &quot;The Latest&quot; Sidebar Headlines (4 Slots)
                    </span>
                    <p className="text-[10px] text-[#77716A] mt-0.5">
                      Customize headlines for each of the 4 compact sidebar stories next to the hero.
                    </p>
                  </div>

                  {[0, 1, 2, 3].map((slotIdx) => {
                    const art = latestArticles[slotIdx];
                    const currentOverride =
                      settings.latest_title_overrides?.[slotIdx] ||
                      settings.latest_title_overrides?.[String(slotIdx)];
                    const isOver = Boolean(currentOverride);
                    const isFocused = selectedElementId === `latest_slot_${slotIdx}`;

                    return (
                      <div
                        key={slotIdx}
                        className={`p-2.5 bg-[#FAF8F5] border rounded-xs space-y-1.5 transition-all ${
                          isFocused ? 'border-[#A94F42] ring-1 ring-[#A94F42]/30 bg-white' : 'border-[#D8D1C5]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-[#25221F] flex items-center gap-1.5">
                            {isFocused && <span className="w-1.5 h-1.5 rounded-full bg-[#A94F42]" />}
                            LATEST SLOT 0{slotIdx + 1}
                          </span>
                          {isOver && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...(settings.latest_title_overrides || {}) };
                                delete updated[slotIdx];
                                delete updated[String(slotIdx)];
                                setSectionFieldOverride(selectedSection.id, 'latest_title_overrides', updated);
                              }}
                              className="text-[9px] text-[#A94F42] hover:underline flex items-center gap-0.5"
                            >
                              <RotateCcw className="w-2.5 h-2.5" /> Reset
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={currentOverride !== undefined ? currentOverride : art?.title || ''}
                          onChange={(e) => {
                            const updated = { ...(settings.latest_title_overrides || {}) };
                            updated[slotIdx] = e.target.value;
                            setSectionFieldOverride(selectedSection.id, 'latest_title_overrides', updated);
                          }}
                          className={`${inputClass} font-serif-editorial`}
                        />

                        {art && (
                          <div className="flex items-center justify-between text-[9px] text-[#77716A]">
                            <span className="truncate max-w-[210px]">Orig: {art.title}</span>
                            <span className="font-mono uppercase text-[8px] text-[#A94F42]">
                              {art.article_type.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* 2. FEATURED EDITORIAL GRID */}
            {selectedSection.section_key === 'featured_editorial_grid' && (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={settings.heading || 'Featured Stories'}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'heading', e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={settings.subtitle || ''}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'subtitle', e.target.value)
                      }
                      placeholder="Optional editorial context..."
                      className={inputClass}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                        View All Label
                      </label>
                      <input
                        type="text"
                        value={settings.view_all_label || 'View All'}
                        onChange={(e) =>
                          setSectionFieldOverride(selectedSection.id, 'view_all_label', e.target.value)
                        }
                        className={`${inputClass} uppercase`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                        View All URL
                      </label>
                      <input
                        type="text"
                        value={settings.view_all_url || '/latest'}
                        onChange={(e) =>
                          setSectionFieldOverride(selectedSection.id, 'view_all_url', e.target.value)
                        }
                        className={monoInputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Slot Overrides */}
                <div className="space-y-3 pt-3 border-t border-[#D8D1C5]">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#A94F42]">
                    Featured Stories Slots (4)
                  </h4>
                  {(selectedSection.items || []).slice(0, 4).map((item, idx) => {
                    const art = item.article;
                    const overrides = itemOverrides[item.id] || {};
                    const isTitleOver = Boolean(overrides.title?.enabled);

                    return (
                      <div key={item.id} className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-[#25221F]">SLOT 0{idx + 1}</span>
                          {isTitleOver && (
                            <button
                              onClick={() => resetItemOverride(selectedSection.id, item.id, 'title')}
                              className="text-[9px] text-[#A94F42] hover:underline flex items-center gap-0.5"
                            >
                              <RotateCcw className="w-2.5 h-2.5" /> Reset
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-semibold text-[#77716A] mb-0.5">
                            Headline {isTitleOver && '(Overridden)'}
                          </label>
                          <input
                            type="text"
                            value={overrides.title?.value !== undefined ? overrides.title.value : art?.title || ''}
                            onChange={(e) =>
                              setItemOverride(selectedSection.id, item.id, 'title', e.target.value)
                            }
                            className={`${inputClass} font-serif-editorial`}
                          />
                        </div>

                        {art && (
                          <div className="flex items-center justify-between text-[9px] text-[#77716A]">
                            <span className="truncate max-w-[190px]">Orig: {art.title}</span>
                            <Link href={`/stories/${art.slug}`} target="_blank" className="text-[#A94F42] hover:underline flex items-center gap-0.5">
                              Article <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* 3. SPONSORED & ADVERTISING */}
            {selectedSection.section_key === 'sponsored_and_advertising' && (
              <div className="space-y-4">
                <div className="space-y-2 p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#A94F42]">
                    Sponsored Editorial
                  </h4>
                  <div>
                    <label className="block text-[9px] uppercase font-semibold text-[#77716A] mb-0.5">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={settings.sponsored_badge || 'PARTNERSHIP'}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'sponsored_badge', e.target.value)
                      }
                      className={`${monoInputClass} uppercase`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-semibold text-[#77716A] mb-0.5">
                      Sponsored Headline
                    </label>
                    <input
                      type="text"
                      value={settings.sponsored_title || ''}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'sponsored_title', e.target.value)
                      }
                      placeholder="Custom sponsored headline..."
                      className={`${inputClass} font-serif-editorial`}
                    />
                  </div>
                </div>

                <div className="space-y-2 p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#A94F42]">
                      Advertisement Panel
                    </h4>
                    {(settings.ad_headline || settings.ad_copy || settings.ad_sponsor_name || settings.ad_cta_label || settings.ad_destination_url) && (
                      <button
                        type="button"
                        onClick={() => {
                          resetSectionFieldOverride(selectedSection.id, 'ad_headline');
                          resetSectionFieldOverride(selectedSection.id, 'ad_copy');
                          resetSectionFieldOverride(selectedSection.id, 'ad_sponsor_name');
                          resetSectionFieldOverride(selectedSection.id, 'ad_cta_label');
                          resetSectionFieldOverride(selectedSection.id, 'ad_destination_url');
                        }}
                        className="text-[9px] text-[#A94F42] hover:underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" /> Reset All
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[9px] uppercase font-semibold text-[#77716A]">
                        Sponsor Label
                      </label>
                      {settings.ad_sponsor_name && (
                        <button
                          type="button"
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'ad_sponsor_name')}
                          className="text-[8.5px] text-[#A94F42] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.ad_sponsor_name || ''}
                      placeholder="Inherited (e.g. FASHION SPECTRUM)"
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_sponsor_name', e.target.value)
                      }
                      className={`${monoInputClass} uppercase`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[9px] uppercase font-semibold text-[#77716A]">
                        Ad Headline
                      </label>
                      {settings.ad_headline && (
                        <button
                          type="button"
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'ad_headline')}
                          className="text-[8.5px] text-[#A94F42] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.ad_headline || ''}
                      placeholder="Inherited ad headline..."
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_headline', e.target.value)
                      }
                      className={`${inputClass} font-serif-editorial`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[9px] uppercase font-semibold text-[#77716A]">
                        Editorial Copy / Description
                      </label>
                      {settings.ad_copy && (
                        <button
                          type="button"
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'ad_copy')}
                          className="text-[8.5px] text-[#A94F42] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={settings.ad_copy || ''}
                      placeholder="Inherited ad description..."
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_copy', e.target.value)
                      }
                      className={textareaClass}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[9px] uppercase font-semibold text-[#77716A]">
                        CTA Button Label
                      </label>
                      {settings.ad_cta_label && (
                        <button
                          type="button"
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'ad_cta_label')}
                          className="text-[8.5px] text-[#A94F42] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.ad_cta_label || ''}
                      placeholder="Shop The Collection"
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_cta_label', e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[9px] uppercase font-semibold text-[#77716A]">
                        Destination URL
                      </label>
                      {settings.ad_destination_url && (
                        <button
                          type="button"
                          onClick={() => resetSectionFieldOverride(selectedSection.id, 'ad_destination_url')}
                          className="text-[8.5px] text-[#A94F42] hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={settings.ad_destination_url || ''}
                      placeholder="https://fashionspectrum.com.au/collection"
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_destination_url', e.target.value)
                      }
                      className={monoInputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. CLEARANCE SALE */}
            {selectedSection.section_key === 'clearance_sale' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={settings.clearance_title || 'CLEARANCE SALE'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'clearance_title', e.target.value)
                    }
                    className={`${inputClass} uppercase tracking-wider font-semibold`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    View All URL
                  </label>
                  <input
                    type="text"
                    value={settings.clearance_view_all_url || '/sale'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'clearance_view_all_url', e.target.value)
                    }
                    className={monoInputClass}
                  />
                </div>
              </div>
            )}

            {/* 5. COMPETITION BANNER */}
            {selectedSection.section_key === 'competition_banner' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    Circular Badge Text
                  </label>
                  <input
                    type="text"
                    value={settings.badge_text || 'WIN a Kaftan'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'badge_text', e.target.value)
                    }
                    className={`${inputClass} font-serif-editorial`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    value={settings.competition_title || 'Win a Kaftan from Fashion Spectrum'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'competition_title', e.target.value)
                    }
                    className={`${inputClass} font-serif-editorial`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.competition_description || 'Purchase an eligible kaftan, scan the QR code, upload your receipt and go in the draw to win.'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'competition_description', e.target.value)
                    }
                    className={textareaClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                      CTA Text
                    </label>
                    <input
                      type="text"
                      value={settings.cta_label || 'ENTER NOW'}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'cta_label', e.target.value)
                      }
                      className={`${inputClass} uppercase`}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-bold text-[#77716A] tracking-wider mb-1">
                      CTA URL
                    </label>
                    <input
                      type="text"
                      value={settings.cta_url || '#'}
                      onChange={(e) =>
                        setSectionFieldOverride(selectedSection.id, 'cta_url', e.target.value)
                      }
                      className={monoInputClass}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. MORE STORIES */}
            {selectedSection.section_key === 'more_stories' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={settings.more_stories_title || 'MORE STORIES'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'more_stories_title', e.target.value)
                    }
                    className={`${inputClass} uppercase tracking-wider font-semibold`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#25221F] tracking-wider mb-1">
                    View All URL
                  </label>
                  <input
                    type="text"
                    value={settings.more_stories_view_all_url || '/latest'}
                    onChange={(e) =>
                      setSectionFieldOverride(selectedSection.id, 'more_stories_view_all_url', e.target.value)
                    }
                    className={monoInputClass}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: MEDIA & IMAGES (Independent Responsive Hero Images & Media)
            =================================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-5">
            {/* 1. HERO EDITORIAL: TWO SEPARATE HOMEPAGE HERO IMAGES */}
            {selectedSection.section_key === 'hero_editorial' && (
              <>
                <div className="bg-[#FAF8F5] p-2.5 border border-[#D8D1C5] rounded-xs">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    Homepage Hero Responsive Media
                  </span>
                  <p className="text-[10px] text-[#77716A] mt-0.5">
                    Configure independent desktop and mobile hero photographs with separate focal points.
                  </p>
                </div>

                {/* Desktop Hero Image */}
                <div id="inspector-element-desktop_hero_image" data-inspector-id="desktop_hero_image" className="transition-all rounded-xs">
                  <MediaField
                    label="Desktop Homepage Hero Image"
                    value={settings.desktop_hero_image}
                    inheritedValue={{
                      storage_key: primaryArticle?.featured_image?.storage_key || 'kaftan/editorial/hero-mediterranean-resortwear',
                      alt_text: primaryArticle?.title || 'Modern Elegance',
                      focal_point: settings.desktop_focal_point || { x: 0.60, y: 0.35 },
                    }}
                    isOverridden={Boolean(settings.desktop_hero_image)}
                    sourceType={settings.desktop_hero_image ? 'override' : 'inherited'}
                    onChange={(newMedia) =>
                      setSectionFieldOverride(selectedSection.id, 'desktop_hero_image', newMedia)
                    }
                    onReset={() =>
                      resetSectionFieldOverride(selectedSection.id, 'desktop_hero_image')
                    }
                    aspectRatio="landscape"
                    helpText="Primary hero photo displayed on desktop and tablet screens (Aspect ~1.30:1)."
                  />
                </div>

                {/* Mobile Hero Image */}
                <div id="inspector-element-mobile_hero_image" data-inspector-id="mobile_hero_image" className="transition-all rounded-xs">
                  <MediaField
                    label="Mobile Homepage Hero Image"
                    value={settings.mobile_hero_image}
                    inheritedValue={{
                      storage_key:
                        settings.desktop_hero_image?.storage_key ||
                        primaryArticle?.featured_image?.storage_key ||
                        'kaftan/editorial/hero-mediterranean-resortwear',
                      alt_text: primaryArticle?.title || 'Modern Elegance',
                      focal_point: settings.mobile_focal_point || { x: 0.72, y: 0.22 },
                    }}
                    isOverridden={Boolean(settings.mobile_hero_image)}
                    sourceType={settings.mobile_hero_image ? 'override' : 'inherited'}
                    onChange={(newMedia) =>
                      setSectionFieldOverride(selectedSection.id, 'mobile_hero_image', newMedia)
                    }
                    onReset={() =>
                      resetSectionFieldOverride(selectedSection.id, 'mobile_hero_image')
                    }
                    aspectRatio="square"
                    helpText="Independently selected photograph displayed on mobile viewports (1:1 portrait crop)."
                  />
                </div>
              </>
            )}

            {/* 2. FEATURED STORIES MEDIA OVERRIDES (DESKTOP & MOBILE) */}
            {selectedSection.section_key === 'featured_editorial_grid' && (
              <div className="space-y-6">
                <div className="bg-[#FAF8F5] p-2.5 border border-[#D8D1C5] rounded-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    Featured Stories Media (Desktop &amp; Mobile)
                  </span>
                  <p className="text-[10px] text-[#77716A] mt-0.5">
                    Configure desktop and mobile card photographs independently for each story slot.
                  </p>
                </div>

                {(selectedSection.items || []).slice(0, 4).map((item, idx) => {
                  const art = item.article;
                  const overrides = itemOverrides[item.id] || {};
                  return (
                    <div key={item.id} className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#D8D1C5]/60 pb-1.5">
                        <span className="font-mono font-bold text-xs text-[#25221F]">
                          SLOT 0{idx + 1}: {art?.title || 'Story'}
                        </span>
                      </div>

                      {/* Desktop Image */}
                      <div id={`inspector-element-slot_${idx}_image`} data-inspector-id={`slot_${idx}_image`} className="transition-all rounded-xs">
                        <MediaField
                          label="Desktop Card Image"
                          value={overrides.image?.value}
                          inheritedValue={{
                            storage_key: art?.featured_image?.storage_key || '',
                            alt_text: art?.title || '',
                            focal_point: { x: 0.5, y: 0.5 },
                          }}
                          isOverridden={Boolean(overrides.image?.enabled)}
                          sourceType={overrides.image?.enabled ? 'override' : 'inherited'}
                          onChange={(newMedia) =>
                            setItemOverride(selectedSection.id, item.id, 'image', newMedia)
                          }
                          onReset={() =>
                            resetItemOverride(selectedSection.id, item.id, 'image')
                          }
                          aspectRatio="portrait"
                          helpText="Primary card photo displayed on desktop and tablet screens."
                        />
                      </div>

                      {/* Mobile Image */}
                      <div id={`inspector-element-slot_${idx}_mobile_image`} data-inspector-id={`slot_${idx}_mobile_image`} className="transition-all rounded-xs">
                        <MediaField
                          label="Mobile Card Image"
                          value={overrides.mobile_image?.value}
                          inheritedValue={{
                            storage_key: overrides.image?.value?.storage_key || art?.featured_image?.storage_key || '',
                            alt_text: overrides.image?.value?.alt_text || art?.title || '',
                            focal_point: overrides.image?.value?.focal_point || { x: 0.5, y: 0.5 },
                          }}
                          isOverridden={Boolean(overrides.mobile_image?.enabled)}
                          sourceType={overrides.mobile_image?.enabled ? 'override' : 'inherited'}
                          onChange={(newMedia) =>
                            setItemOverride(selectedSection.id, item.id, 'mobile_image', newMedia)
                          }
                          onReset={() =>
                            resetItemOverride(selectedSection.id, item.id, 'mobile_image')
                          }
                          aspectRatio="square"
                          helpText="Mobile-specific crop or alternate photograph. Falls back to desktop image if unset."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. SPONSORED & ADVERTISING MEDIA (DESKTOP & MOBILE) */}
            {selectedSection.section_key === 'sponsored_and_advertising' && (
              <div className="space-y-6">
                <div className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    Sponsored Story Images
                  </span>
                  <div id="inspector-element-sponsored_image" data-inspector-id="sponsored_image" className="transition-all rounded-xs">
                    <MediaField
                      label="Desktop Portrait Image"
                      value={settings.sponsored_image}
                      inheritedValue={{
                        storage_key: 'kaftan/editorial/sponsored-resort-living',
                        alt_text: 'The Art of Resort Living',
                      }}
                      isOverridden={Boolean(settings.sponsored_image)}
                      sourceType={settings.sponsored_image ? 'override' : 'section'}
                      onChange={(newMedia) =>
                        setSectionFieldOverride(selectedSection.id, 'sponsored_image', newMedia)
                      }
                      onReset={() =>
                        resetSectionFieldOverride(selectedSection.id, 'sponsored_image')
                      }
                      aspectRatio="portrait"
                      helpText="Portrait editorial photo on desktop and tablet."
                    />
                  </div>

                  <div id="inspector-element-sponsored_mobile_image" data-inspector-id="sponsored_mobile_image" className="transition-all rounded-xs">
                    <MediaField
                      label="Mobile Image"
                      value={settings.sponsored_mobile_image}
                      inheritedValue={{
                        storage_key: settings.sponsored_image?.storage_key || 'kaftan/editorial/sponsored-resort-living',
                        alt_text: 'The Art of Resort Living',
                      }}
                      isOverridden={Boolean(settings.sponsored_mobile_image)}
                      sourceType={settings.sponsored_mobile_image ? 'override' : 'section'}
                      onChange={(newMedia) =>
                        setSectionFieldOverride(selectedSection.id, 'sponsored_mobile_image', newMedia)
                      }
                      onReset={() =>
                        resetSectionFieldOverride(selectedSection.id, 'sponsored_mobile_image')
                      }
                      aspectRatio="landscape"
                      helpText="Dedicated mobile aspect crop. Falls back to desktop image if unset."
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    Advertisement Creative Images
                  </span>
                  <div id="inspector-element-ad_desktop_image" data-inspector-id="ad_desktop_image" className="transition-all rounded-xs">
                    <MediaField
                      label="Desktop Ad Creative"
                      value={settings.ad_desktop_image}
                      inheritedValue={{
                        storage_key: 'kaftan/editorial/ad-fashion-spectrum',
                        alt_text: 'Fashion Spectrum Ad',
                      }}
                      isOverridden={Boolean(settings.ad_desktop_image)}
                      sourceType={settings.ad_desktop_image ? 'override' : 'section'}
                      onChange={(newMedia) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_desktop_image', newMedia)
                      }
                      onReset={() =>
                        resetSectionFieldOverride(selectedSection.id, 'ad_desktop_image')
                      }
                      aspectRatio="portrait"
                      helpText="Ad product creative on desktop and tablet."
                    />
                  </div>

                  <div id="inspector-element-ad_mobile_image" data-inspector-id="ad_mobile_image" className="transition-all rounded-xs">
                    <MediaField
                      label="Mobile Ad Creative"
                      value={settings.ad_mobile_image}
                      inheritedValue={{
                        storage_key: settings.ad_desktop_image?.storage_key || 'kaftan/editorial/ad-fashion-spectrum',
                        alt_text: 'Fashion Spectrum Ad',
                      }}
                      isOverridden={Boolean(settings.ad_mobile_image)}
                      sourceType={settings.ad_mobile_image ? 'override' : 'section'}
                      onChange={(newMedia) =>
                        setSectionFieldOverride(selectedSection.id, 'ad_mobile_image', newMedia)
                      }
                      onReset={() =>
                        resetSectionFieldOverride(selectedSection.id, 'ad_mobile_image')
                      }
                      aspectRatio="wide"
                      helpText="Horizontal ad banner creative for mobile screens. Falls back to desktop creative if unset."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. COMPETITION BANNER MEDIA (DESKTOP & MOBILE) */}
            {selectedSection.section_key === 'competition_banner' && (
              <div className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                  Competition Banner Media
                </span>
                <div id="inspector-element-banner_image" data-inspector-id="banner_image" className="transition-all rounded-xs">
                  <MediaField
                    label="Desktop Background Beach Image"
                    value={settings.banner_image}
                    inheritedValue={{
                      storage_key: 'kaftan/editorial/competition-strawhat-beach',
                      alt_text: 'Woman with straw sun hat looking at Mediterranean ocean',
                    }}
                    isOverridden={Boolean(settings.banner_image)}
                    sourceType={settings.banner_image ? 'override' : 'section'}
                    onChange={(newMedia) =>
                      setSectionFieldOverride(selectedSection.id, 'banner_image', newMedia)
                    }
                    onReset={() =>
                      resetSectionFieldOverride(selectedSection.id, 'banner_image')
                    }
                    aspectRatio="wide"
                    helpText="Atmospheric right-aligned background photo with editorial gradient blend on desktop."
                  />
                </div>

                <div id="inspector-element-mobile_banner_image" data-inspector-id="mobile_banner_image" className="transition-all rounded-xs">
                  <MediaField
                    label="Mobile Background Image"
                    value={settings.mobile_banner_image}
                    inheritedValue={{
                      storage_key: settings.banner_image?.storage_key || 'kaftan/editorial/competition-strawhat-beach',
                      alt_text: 'Woman with straw sun hat looking at Mediterranean ocean',
                    }}
                    isOverridden={Boolean(settings.mobile_banner_image)}
                    sourceType={settings.mobile_banner_image ? 'override' : 'section'}
                    onChange={(newMedia) =>
                      setSectionFieldOverride(selectedSection.id, 'mobile_banner_image', newMedia)
                    }
                    onReset={() =>
                      resetSectionFieldOverride(selectedSection.id, 'mobile_banner_image')
                    }
                    aspectRatio="landscape"
                    helpText="Mobile-specific crop or alternate photograph for smartphones. Falls back to desktop image if unset."
                  />
                </div>
              </div>
            )}

            {/* 5. MORE STORIES MEDIA (DESKTOP & MOBILE) */}
            {selectedSection.section_key === 'more_stories' && (
              <div className="space-y-6">
                <div className="bg-[#FAF8F5] p-2.5 border border-[#D8D1C5] rounded-xs">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    More Stories Media (Desktop &amp; Mobile)
                  </span>
                  <p className="text-[10px] text-[#77716A] mt-0.5">
                    Configure desktop and mobile card photographs independently for each story slot.
                  </p>
                </div>

                {(selectedSection.items || []).slice(0, 4).map((item, idx) => {
                  const art = item.article;
                  const overrides = itemOverrides[item.id] || {};
                  return (
                    <div key={item.id} className="p-3 bg-[#FAF8F5] border border-[#D8D1C5] rounded-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#D8D1C5]/60 pb-1.5">
                        <span className="font-mono font-bold text-xs text-[#25221F]">
                          STORY 0{idx + 1}: {art?.title || 'Story'}
                        </span>
                      </div>

                      {/* Desktop Image */}
                      <div id={`inspector-element-more_story_image_${idx}`} data-inspector-id={`more_story_image_${idx}`} className="transition-all rounded-xs">
                        <MediaField
                          label="Desktop Card Image"
                          value={overrides.image?.value}
                          inheritedValue={{
                            storage_key: art?.featured_image?.storage_key || '',
                            alt_text: art?.title || '',
                            focal_point: { x: 0.5, y: 0.5 },
                          }}
                          isOverridden={Boolean(overrides.image?.enabled)}
                          sourceType={overrides.image?.enabled ? 'override' : 'inherited'}
                          onChange={(newMedia) =>
                            setItemOverride(selectedSection.id, item.id, 'image', newMedia)
                          }
                          onReset={() =>
                            resetItemOverride(selectedSection.id, item.id, 'image')
                          }
                          aspectRatio="wide"
                          helpText="Primary card photo on desktop and tablet."
                        />
                      </div>

                      {/* Mobile Image */}
                      <div id={`inspector-element-more_story_mobile_image_${idx}`} data-inspector-id={`more_story_mobile_image_${idx}`} className="transition-all rounded-xs">
                        <MediaField
                          label="Mobile Card Image"
                          value={overrides.mobile_image?.value}
                          inheritedValue={{
                            storage_key: overrides.image?.value?.storage_key || art?.featured_image?.storage_key || '',
                            alt_text: overrides.image?.value?.alt_text || art?.title || '',
                            focal_point: overrides.image?.value?.focal_point || { x: 0.5, y: 0.5 },
                          }}
                          isOverridden={Boolean(overrides.mobile_image?.enabled)}
                          sourceType={overrides.mobile_image?.enabled ? 'override' : 'inherited'}
                          onChange={(newMedia) =>
                            setItemOverride(selectedSection.id, item.id, 'mobile_image', newMedia)
                          }
                          onReset={() =>
                            resetItemOverride(selectedSection.id, item.id, 'mobile_image')
                          }
                          aspectRatio="wide"
                          helpText="Mobile card photo. Falls back to desktop image if unset."
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: LAYOUT & SLOTS (Article Selection & Slot Management)
            =================================================================== */}
        {activeTab === 'layout' && (
          <div className="space-y-5">
            {/* Slot Replacer */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                Assign / Replace Slots
              </span>

              {/* Slot picker list */}
              <div className="space-y-2">
                {(selectedSection.items || []).map((item, slotIdx) => {
                  let slotLabel = `SLOT 0${slotIdx + 1}`;
                  let itemTitle = 'Empty Slot';
                  let itemType = 'Story Slot';

                  if (selectedSection.section_key === 'sponsored_and_advertising') {
                    if (slotIdx === 0) {
                      slotLabel = 'SLOT 01 (Sponsored Story)';
                      itemTitle = item.article?.title || 'The Art of Resort Living';
                      itemType = 'Editorial Story';
                    } else {
                      slotLabel = 'SLOT 02 (Ad Panel)';
                      if (item.article) {
                        itemTitle = item.article.title;
                        itemType = 'Custom Story';
                      } else if (item.ad_creative) {
                        itemTitle = settings.ad_headline || item.ad_creative.copy || item.ad_creative.headline;
                        itemType = 'Commercial Ad';
                      } else {
                        itemTitle = settings.ad_headline || 'Fashion Spectrum Advertisement';
                        itemType = 'Commercial Ad';
                      }
                    }
                  } else if (selectedSection.section_key === 'clearance_sale') {
                    slotLabel = `PRODUCT 0${slotIdx + 1}`;
                    itemTitle = item.product?.name || 'Luxury Kaftan';
                    itemType = item.product?.brand_name || 'Catalog';
                  } else {
                    itemTitle = item.article?.title || 'Empty Slot';
                    itemType = item.article?.article_type ? item.article.article_type.replace('_', ' ') : 'Story';
                  }

                  const isFocused =
                    selectedElementId === `slot_${slotIdx}` ||
                    selectedElementId === `product_card_${slotIdx}`;

                  return (
                    <div
                      key={item.id || slotIdx}
                      id={`inspector-slot-slot_${slotIdx}`}
                      data-inspector-id={`slot_${slotIdx}`}
                      className={`p-2.5 bg-[#FAF8F5] border rounded-xs flex items-center justify-between transition-all ${
                        isFocused ? 'border-[#A94F42] ring-1 ring-[#A94F42]/30 bg-white' : 'border-[#D8D1C5]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[8.5px] font-mono font-bold text-[#A94F42] block flex items-center gap-1.5">
                          {isFocused && <span className="w-1.5 h-1.5 rounded-full bg-[#A94F42]" />}
                          {slotLabel}
                        </span>
                        <p className="text-xs font-serif-editorial text-[#25221F] truncate">
                          {itemTitle}
                        </p>
                        <span className="text-[9px] text-[#77716A] uppercase font-mono">
                          {itemType}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectingLatestIndex(null);
                          setSelectingSlotIndex(selectingSlotIndex === slotIdx ? null : slotIdx);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#D8D1C5] hover:border-[#25221F] rounded-xs text-[10px] uppercase font-mono tracking-wider text-[#25221F] shrink-0"
                      >
                        {selectingSlotIndex === slotIdx ? 'Close' : 'Change'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Slot Selector Drawer (When a slot is being changed) */}
              {selectingSlotIndex !== null && (
                <div className="p-3 bg-white border-2 border-[#A94F42] rounded-xs space-y-3 animate-in fade-in duration-150 shadow-md">
                  {/* Clearance Sale Product Selector */}
                  {selectedSection.section_key === 'clearance_sale' ? (
                    <>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#A94F42] font-bold">
                        <span>SELECT PRODUCT FOR SLOT 0{selectingSlotIndex + 1}</span>
                        <button onClick={() => setSelectingSlotIndex(null)} className="text-stone-400 hover:text-black">
                          &times;
                        </button>
                      </div>

                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by name or brand..."
                        className={inputClass}
                        autoFocus
                      />

                      <div className="max-h-56 overflow-y-auto divide-y divide-stone-100 text-xs">
                        {allProducts
                          .filter(
                            (p) =>
                              p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                              p.brand_name.toLowerCase().includes(productSearch.toLowerCase())
                          )
                          .map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                setSlotProduct(selectedSection.id, selectingSlotIndex, prod);
                                setSelectingSlotIndex(null);
                              }}
                              className="py-2 px-1 hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between group"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-serif-editorial text-[12px] text-[#25221F] group-hover:text-[#A94F42] block truncate">
                                  {prod.name}
                                </span>
                                <span className="text-[10px] text-[#77716A]">
                                  {prod.brand_name} • ${prod.sale_price || prod.original_price} {prod.currency}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#FAF8F5] border border-[#D8D1C5] rounded-2xs text-[#25221F]">
                                Select
                              </span>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : selectedSection.section_key === 'sponsored_and_advertising' && selectingSlotIndex === 1 ? (
                    /* Sponsored & Ad Section Slot 2 (Ad Panel) - Brand Presets OR Custom Story */
                    <>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#A94F42] font-bold">
                        <span>SELECT CONTENT FOR SLOT 02 (AD PANEL)</span>
                        <button onClick={() => setSelectingSlotIndex(null)} className="text-stone-400 hover:text-black">
                          &times;
                        </button>
                      </div>

                      {/* Mode switcher tabs */}
                      <div className="flex border-b border-[#D8D1C5] text-[10px] font-mono uppercase tracking-wider">
                        <button
                          type="button"
                          onClick={() => setSlot2PickerMode('campaigns')}
                          className={`flex-1 py-1.5 text-center transition-colors ${
                            slot2PickerMode === 'campaigns'
                              ? 'border-b-2 border-[#A94F42] text-[#A94F42] font-bold bg-[#FAF8F5]'
                              : 'text-[#77716A] hover:text-[#25221F]'
                          }`}
                        >
                          Brand Campaigns
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlot2PickerMode('stories')}
                          className={`flex-1 py-1.5 text-center transition-colors ${
                            slot2PickerMode === 'stories'
                              ? 'border-b-2 border-[#A94F42] text-[#A94F42] font-bold bg-[#FAF8F5]'
                              : 'text-[#77716A] hover:text-[#25221F]'
                          }`}
                        >
                          Editorial Story
                        </button>
                      </div>

                      {slot2PickerMode === 'campaigns' ? (
                        <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                          {AD_CAMPAIGN_PRESETS.map((preset) => (
                            <div
                              key={preset.id}
                              onClick={() => {
                                const adCreativeObj: PopulatedAdCreative = {
                                  id: preset.id,
                                  campaign_id: 'campaign-preset',
                                  ad_placement_id: 'mid_split',
                                  headline: preset.headline,
                                  copy: preset.copy,
                                  destination_url: preset.url,
                                  desktop_image_id: preset.id,
                                  mobile_image_id: null,
                                  start_date: '',
                                  end_date: '',
                                  status: 'active',
                                  created_at: '',
                                  updated_at: '',
                                  desktop_image: {
                                    id: preset.id,
                                    storage_key: preset.image,
                                    original_filename: `${preset.id}.jpg`,
                                    mime_type: 'image/jpeg',
                                    width: 1200,
                                    height: 800,
                                    file_size_bytes: 250000,
                                    alt_text: preset.headline,
                                    caption: null,
                                    credit: preset.sponsor,
                                    license_info: null,
                                    metadata: {},
                                    uploaded_by: null,
                                    created_at: '',
                                  },
                                };

                                setSlotAdCreative(selectedSection.id, 1, adCreativeObj, {
                                  ad_sponsor_name: preset.sponsor,
                                  ad_headline: preset.headline,
                                  ad_copy: preset.copy,
                                  ad_destination_url: preset.url,
                                  ad_desktop_image: {
                                    storage_key: preset.image,
                                    alt_text: preset.headline,
                                  },
                                });
                                setSelectingSlotIndex(null);
                              }}
                              className="p-2 border border-[#D8D1C5] hover:border-[#A94F42] hover:bg-[#FAF8F5] cursor-pointer rounded-xs transition-all group"
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[9px] uppercase font-mono font-bold text-[#A94F42]">
                                  {preset.sponsor}
                                </span>
                                <span className="text-[8.5px] font-mono text-[#77716A]">Select &rarr;</span>
                              </div>
                              <p className="font-serif-editorial text-[12px] font-medium text-[#25221F] group-hover:text-[#A94F42]">
                                {preset.headline}
                              </p>
                              <p className="text-[10px] text-[#55504A] line-clamp-1 mt-0.5">
                                {preset.copy}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={articleSearch}
                            onChange={(e) => setArticleSearch(e.target.value)}
                            placeholder="Search articles by title..."
                            className={inputClass}
                            autoFocus
                          />
                          <div className="max-h-52 overflow-y-auto divide-y divide-stone-100 text-xs">
                            {allArticles
                              .filter((a) => a.title.toLowerCase().includes(articleSearch.toLowerCase()))
                              .map((art) => (
                                <div
                                  key={art.id}
                                  onClick={() => {
                                    setSlotArticle(selectedSection.id, 1, art, false);
                                    setSelectingSlotIndex(null);
                                  }}
                                  className="py-1.5 px-1 hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between group"
                                >
                                  <span className="truncate max-w-[220px] font-serif-editorial text-[11px] group-hover:text-[#A94F42]">
                                    {art.title}
                                  </span>
                                  <span className="text-[9px] font-mono text-stone-400 uppercase">
                                    {art.article_type.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    /* Default Article Selector */
                    <>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#A94F42] font-bold">
                        <span>SELECT ARTICLE FOR SLOT 0{selectingSlotIndex + 1}</span>
                        <button onClick={() => setSelectingSlotIndex(null)} className="text-stone-400 hover:text-black">
                          &times;
                        </button>
                      </div>

                      <input
                        type="text"
                        value={articleSearch}
                        onChange={(e) => setArticleSearch(e.target.value)}
                        placeholder="Search articles..."
                        className={inputClass}
                        autoFocus
                      />

                      <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 text-xs">
                        {allArticles
                          .filter((a) => a.title.toLowerCase().includes(articleSearch.toLowerCase()))
                          .map((art) => (
                            <div
                              key={art.id}
                              onClick={() => {
                                setSlotArticle(selectedSection.id, selectingSlotIndex, art, false);
                                setSelectingSlotIndex(null);
                              }}
                              className="py-1.5 px-1 hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between group"
                            >
                              <span className="truncate max-w-[220px] font-serif-editorial text-[11px] group-hover:text-[#A94F42]">
                                {art.title}
                              </span>
                              <span className="text-[9px] font-mono text-stone-400 uppercase">
                                {art.article_type.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* The Latest Sidebar Story Slots (For Hero Editorial Section) */}
            {selectedSection.section_key === 'hero_editorial' && (
              <div className="space-y-3 pt-3 border-t border-[#D8D1C5]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94F42] block font-bold">
                    &quot;The Latest&quot; Sidebar Slots (4)
                  </span>
                  {latestIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSectionFieldOverride(selectedSection.id, 'latest_article_ids', []);
                      }}
                      className="text-[9px] text-[#A94F42] hover:underline flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset All
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-[#77716A]">
                  Choose which 4 articles appear in &quot;The Latest&quot; editorial sidebar beside the hero.
                </p>

                <div className="space-y-2">
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const art = latestArticles[slotIdx];
                    const isCustom = Boolean(latestIds[slotIdx]);
                    const isFocused = selectedElementId === `latest_slot_${slotIdx}`;

                    return (
                      <div
                        key={slotIdx}
                        className={`p-2.5 bg-[#FAF8F5] border rounded-xs flex items-center justify-between transition-all ${
                          isFocused ? 'border-[#A94F42] ring-1 ring-[#A94F42]/30 bg-white' : 'border-[#D8D1C5]'
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[8.5px] font-mono font-bold text-[#A94F42] block flex items-center gap-1.5">
                            {isFocused && <span className="w-1.5 h-1.5 rounded-full bg-[#A94F42]" />}
                            LATEST SLOT 0{slotIdx + 1} {isCustom ? '(Custom)' : '(Default)'}
                          </span>
                          <p className="text-xs font-serif-editorial text-[#25221F] truncate">
                            {art?.title || 'Empty Slot'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                const newIds = [...latestIds];
                                delete newIds[slotIdx];
                                setSectionFieldOverride(selectedSection.id, 'latest_article_ids', newIds);
                              }}
                              title="Reset to default automatic latest story"
                              className="p-1 text-stone-400 hover:text-[#A94F42] text-[10px]"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectingSlotIndex(null);
                              setSelectingLatestIndex(selectingLatestIndex === slotIdx ? null : slotIdx);
                            }}
                            className="px-2.5 py-1 bg-white border border-[#D8D1C5] hover:border-[#25221F] rounded-xs text-[10px] uppercase font-mono tracking-wider text-[#25221F]"
                          >
                            {selectingLatestIndex === slotIdx ? 'Close' : 'Change'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Article Selector Drawer for Latest Slots */}
                {selectingLatestIndex !== null && (
                  <div className="p-3 bg-white border-2 border-[#A94F42] rounded-xs space-y-2 animate-in fade-in duration-150 shadow-md">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A94F42] font-bold">
                      <span>SELECT ARTICLE FOR LATEST SLOT 0{selectingLatestIndex + 1}</span>
                      <button onClick={() => setSelectingLatestIndex(null)} className="text-stone-400 hover:text-black">
                        &times;
                      </button>
                    </div>

                    <input
                      type="text"
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      placeholder="Search articles by title..."
                      className={inputClass}
                      autoFocus
                    />

                    <div className="max-h-48 overflow-y-auto divide-y divide-stone-100 text-xs">
                      {allArticles
                        .filter((a) => a.title.toLowerCase().includes(articleSearch.toLowerCase()))
                        .map((art) => (
                          <div
                            key={art.id}
                            onClick={() => {
                              const newIds = [...latestIds];
                              while (newIds.length < 4) newIds.push(undefined);
                              newIds[selectingLatestIndex] = art.id;
                              setSectionFieldOverride(selectedSection.id, 'latest_article_ids', newIds);
                              setSelectingLatestIndex(null);
                            }}
                            className="py-1.5 px-1 hover:bg-[#FAF8F5] cursor-pointer flex items-center justify-between group"
                          >
                            <span className="truncate max-w-[220px] font-serif-editorial text-[11px] group-hover:text-[#A94F42]">
                              {art.title}
                            </span>
                            <span className="text-[9px] font-mono text-stone-400 uppercase">
                              {art.article_type.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section Visibility & Display Order */}
            <div className="pt-4 border-t border-[#D8D1C5] space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#77716A] block font-semibold">
                Section Controls
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#25221F]">Visible on Homepage</span>
                <input
                  type="checkbox"
                  checked={selectedSection.is_active}
                  onChange={(e) =>
                    updateSection(selectedSection.id, { is_active: e.target.checked })
                  }
                  className="rounded-2xs text-[#A94F42] focus:ring-[#A94F42]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[#77716A] tracking-wider mb-1">
                  Internal Identifier Key
                </label>
                <input
                  type="text"
                  value={selectedSection.section_key}
                  disabled
                  className="w-full px-3 py-1 bg-stone-100 border border-[#D8D1C5] rounded-xs text-stone-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
