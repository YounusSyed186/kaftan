'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  RotateCcw,
  Sparkles,
  Focus,
  Eye,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { MediaLibraryModal } from './MediaLibraryModal';
import type { MediaReferenceOverride } from '@/types/content-overrides';

interface MediaFieldProps {
  label: string;
  value?: MediaReferenceOverride | null;
  inheritedValue?: {
    storage_key: string;
    alt_text?: string;
    focal_point?: { x: number; y: number };
  } | null;
  isOverridden?: boolean;
  sourceType?: 'inherited' | 'override' | 'section';
  onChange: (newMedia: MediaReferenceOverride) => void;
  onReset?: () => void;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  showFocalPoint?: boolean;
  helpText?: string;
}

export function MediaField({
  label,
  value,
  inheritedValue,
  isOverridden = false,
  sourceType = 'section',
  onChange,
  onReset,
  aspectRatio = 'landscape',
  showFocalPoint = true,
  helpText,
}: MediaFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingFocalPoint, setIsSettingFocalPoint] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const effectiveStorageKey =
    value?.storage_key || inheritedValue?.storage_key || '';
  const effectiveAlt = value?.alt_text ?? inheritedValue?.alt_text ?? '';
  const effectiveFocalPoint =
    value?.focal_point || inheritedValue?.focal_point || { x: 0.5, y: 0.5 };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSettingFocalPoint || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    onChange({
      ...value,
      storage_key: effectiveStorageKey,
      alt_text: effectiveAlt,
      focal_point: {
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
      },
    });
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'aspect-[4/3]';

  return (
    <div className="space-y-2.5 bg-[#FAF8F5] p-3 border border-[#D8D1C5] rounded-xs text-[#25221F]">
      {/* Header Row: Label + Source Badge + Reset */}
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase font-bold tracking-wider text-[#25221F]">
          {label}
        </label>

        <div className="flex items-center gap-1.5">
          {sourceType === 'inherited' && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded-2xs">
              INHERITED
            </span>
          )}
          {sourceType === 'override' && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#A94F42]/15 text-[#A94F42] font-semibold rounded-2xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              OVERRIDDEN
            </span>
          )}
          {sourceType === 'section' && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-2xs">
              SECTION
            </span>
          )}

          {isOverridden && onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Reset to Original Image"
              className="p-1 text-stone-400 hover:text-[#A94F42] hover:bg-stone-200/60 rounded-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {helpText && (
        <p className="text-[10px] text-[#77716A] leading-tight font-serif-editorial italic">
          {helpText}
        </p>
      )}

      {/* Image Preview & Interactive Focal Point Canvas */}
      <div
        ref={previewRef}
        onClick={handlePreviewClick}
        className={`relative w-full ${aspectClass} bg-[#EFEAE0] border border-[#D8D1C5] rounded-xs overflow-hidden ${
          isSettingFocalPoint ? 'cursor-crosshair ring-2 ring-[#A94F42]' : ''
        }`}
      >
        {effectiveStorageKey ? (
          <>
            <Image
              src={buildCloudinaryUrl(effectiveStorageKey, { width: 600 })}
              alt={effectiveAlt || 'Media preview'}
              fill
              sizes="300px"
              className="object-cover"
              style={{
                objectPosition: `${effectiveFocalPoint.x * 100}% ${effectiveFocalPoint.y * 100}%`,
              }}
            />

            {/* Focal Point Indicator Crosshair */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 z-10"
              style={{
                left: `${effectiveFocalPoint.x * 100}%`,
                top: `${effectiveFocalPoint.y * 100}%`,
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-white shadow-md bg-[#A94F42]/80 flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
            <span>No Image Configured</span>
          </div>
        )}

        {isSettingFocalPoint && (
          <div className="absolute inset-x-0 bottom-0 bg-black/75 text-white text-[9px] font-mono text-center py-1">
            Click image to set subject focus point ({Math.round(effectiveFocalPoint.x * 100)}%, {Math.round(effectiveFocalPoint.y * 100)}%)
          </div>
        )}
      </div>

      {/* Button Affordances */}
      <div className="flex items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex-1 py-1.5 px-2.5 bg-[#FFFEFA] border border-[#D8D1C5] hover:border-[#25221F] text-[#25221F] text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#A94F42]" />
          Replace Image
        </button>

        {showFocalPoint && effectiveStorageKey && (
          <button
            type="button"
            onClick={() => setIsSettingFocalPoint(!isSettingFocalPoint)}
            title="Adjust Focal Point"
            className={`py-1.5 px-2 text-[11px] font-mono border rounded-xs transition-colors flex items-center gap-1 ${
              isSettingFocalPoint
                ? 'bg-[#A94F42] text-white border-[#A94F42]'
                : 'bg-[#FFFEFA] border-[#D8D1C5] text-[#77716A] hover:text-[#25221F]'
            }`}
          >
            <Focus className="w-3.5 h-3.5" />
            <span>Focal</span>
          </button>
        )}
      </div>

      {/* Alt Text Input */}
      <div>
        <label className="block text-[9px] uppercase font-semibold text-[#77716A] tracking-wider mb-0.5">
          Alt Description
        </label>
        <input
          type="text"
          value={effectiveAlt}
          onChange={(e) =>
            onChange({
              ...value,
              storage_key: effectiveStorageKey,
              alt_text: e.target.value,
              focal_point: effectiveFocalPoint,
            })
          }
          placeholder="Accessible description..."
          className="w-full px-2.5 py-1 text-xs bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] focus:outline-none focus:border-[#A94F42] focus:ring-1 focus:ring-[#A94F42]/20"
        />
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMedia={(selected) => {
          onChange({
            ...selected,
            focal_point: effectiveFocalPoint,
          });
        }}
        title={`Select Image for ${label}`}
        initialSelectedKey={effectiveStorageKey}
      />
    </div>
  );
}

