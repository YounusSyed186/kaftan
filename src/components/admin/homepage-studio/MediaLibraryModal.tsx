'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  FolderOpen,
  Sparkles,
} from 'lucide-react';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import type { MediaAssetRow } from '@/types/models';
import type { MediaReferenceOverride } from '@/types/content-overrides';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (media: MediaReferenceOverride) => void;
  title?: string;
  initialSelectedKey?: string;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectMedia,
  title = 'Select or Upload Editorial Image',
  initialSelectedKey,
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'direct'>('library');
  const [assets, setAssets] = useState<MediaAssetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'editorial' | 'products' | 'categories'>('all');
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetRow | null>(null);

  // Upload tab state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct key state
  const [directKey, setDirectKey] = useState('');
  const [directAlt, setDirectAlt] = useState('');

  // Fetch library media
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    fetch(`/api/admin/media?limit=100`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setAssets(json.data);
          if (initialSelectedKey) {
            const matched = json.data.find(
              (a: MediaAssetRow) => a.storage_key === initialSelectedKey
            );
            if (matched) setSelectedAsset(matched);
          }
        }
      })
      .catch((err) => console.error('Failed to load assets', err))
      .finally(() => setLoading(false));
  }, [isOpen, initialSelectedKey]);

  if (!isOpen) return null;

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.original_filename?.toLowerCase().includes(search.toLowerCase()) ||
      asset.alt_text?.toLowerCase().includes(search.toLowerCase()) ||
      asset.storage_key?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'editorial') return asset.storage_key.includes('editorial');
    if (filterType === 'products') return asset.storage_key.includes('products');
    if (filterType === 'categories') return asset.storage_key.includes('categories');
    return true;
  });

  const handleConfirmSelect = () => {
    if (activeTab === 'library' && selectedAsset) {
      onSelectMedia({
        asset_id: selectedAsset.id,
        storage_key: selectedAsset.storage_key,
        alt_text: selectedAsset.alt_text || '',
        original_filename: selectedAsset.original_filename,
      });
      onClose();
    } else if (activeTab === 'direct' && directKey.trim()) {
      onSelectMedia({
        storage_key: directKey.trim(),
        alt_text: directAlt.trim(),
      });
      onClose();
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('alt_text', uploadAlt);
      formData.append('folder', 'kaftan/editorial');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || 'Upload failed');
      }

      const newAsset = json.data as MediaAssetRow;
      setAssets((prev) => [newAsset, ...prev]);
      setSelectedAsset(newAsset);

      onSelectMedia({
        asset_id: newAsset.id,
        storage_key: newAsset.storage_key,
        alt_text: newAsset.alt_text || uploadAlt,
        original_filename: newAsset.original_filename,
      });

      onClose();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-[#25221F] border border-[#D8D1C5] w-full max-w-4xl h-[620px] max-h-[90vh] flex flex-col shadow-2xl rounded-xs overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D8D1C5] bg-[#FFFEFA] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FolderOpen className="w-4 h-4 text-[#A94F42]" />
            <h2 className="font-serif-editorial text-lg text-[#25221F] font-semibold">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-[#25221F] hover:bg-stone-100 rounded-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 border-b border-[#D8D1C5] bg-[#FAF8F5] flex space-x-6 text-xs font-mono uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-3 border-b-2 font-medium transition-all ${
              activeTab === 'library'
                ? 'border-[#A94F42] text-[#A94F42]'
                : 'border-transparent text-[#77716A] hover:text-[#25221F]'
            }`}
          >
            Media Library ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-[#A94F42] text-[#A94F42]'
                : 'border-transparent text-[#77716A] hover:text-[#25221F]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload New
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-3 border-b-2 font-medium transition-all ${
              activeTab === 'direct'
                ? 'border-[#A94F42] text-[#A94F42]'
                : 'border-transparent text-[#77716A] hover:text-[#25221F]'
            }`}
          >
            Cloudinary ID / URL
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {activeTab === 'library' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by filename, tag, or alt text..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] focus:outline-none focus:border-[#A94F42]"
                  />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  {(['all', 'editorial', 'products', 'categories'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilterType(t)}
                      className={`px-2.5 py-1 uppercase rounded-xs transition-colors ${
                        filterType === t
                          ? 'bg-[#25221F] text-white'
                          : 'bg-[#FFFEFA] border border-[#D8D1C5] text-[#77716A] hover:text-[#25221F]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Grid */}
              <div className="flex-1 overflow-y-auto pr-1">
                {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-xs">Loading Cloudinary Assets...</span>
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-[#77716A] text-xs">
                    <ImageIcon className="w-8 h-8 text-stone-300 mb-2" />
                    <p>No matching assets found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {filteredAssets.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id;
                      const thumbUrl = buildCloudinaryUrl(asset.storage_key, {
                        width: 300,
                        height: 250,
                        crop: 'fill',
                      });

                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className={`group relative aspect-[4/3] bg-[#EFEAE0] border rounded-xs overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#A94F42] ring-2 ring-[#A94F42] shadow-md'
                              : 'border-[#D8D1C5] hover:border-[#25221F]'
                          }`}
                        >
                          <Image
                            src={thumbUrl}
                            alt={asset.alt_text || asset.original_filename}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />

                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-[#A94F42] text-white p-0.5 rounded-full shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] text-white truncate font-medium">
                              {asset.original_filename}
                            </p>
                            <p className="text-[9px] text-stone-300 font-mono">
                              {asset.width} &times; {asset.height}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <form onSubmit={handleFileUpload} className="flex-1 flex flex-col max-w-lg mx-auto w-full justify-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D8D1C5] hover:border-[#A94F42] bg-[#FFFEFA] p-8 rounded-xs text-center cursor-pointer transition-colors"
              >
                <Upload className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <p className="text-xs font-semibold text-[#25221F]">
                  {uploadFile ? uploadFile.name : 'Click to select or drag and drop image'}
                </p>
                <p className="text-[10px] text-[#77716A] mt-1 font-mono">
                  JPEG, PNG, WebP up to 10MB (Stored in Cloudinary)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadFile(e.target.files[0]);
                      if (!uploadAlt) {
                        setUploadAlt(
                          e.target.files[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
                        );
                      }
                    }
                  }}
                  className="hidden"
                />
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-[#77716A] tracking-wider mb-1">
                    Accessible Alt Text
                  </label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Describe image for screen readers..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] focus:outline-none focus:border-[#A94F42]"
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-xs border border-rose-200">
                    {uploadError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="w-full py-2 bg-[#25221F] text-white text-xs uppercase tracking-wider font-semibold rounded-xs disabled:opacity-50 hover:bg-[#A94F42] transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      Upload &amp; Use Image
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'direct' && (
            <div className="flex-1 flex flex-col max-w-lg mx-auto w-full justify-center space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-[#77716A] tracking-wider mb-1">
                  Cloudinary Public ID or External URL
                </label>
                <input
                  type="text"
                  value={directKey}
                  onChange={(e) => setDirectKey(e.target.value)}
                  placeholder="e.g. kaftan/editorial/hero-mediterranean-resortwear"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8D1C5] rounded-xs font-mono text-[#25221F] placeholder:text-[#9E978C] focus:outline-none focus:border-[#A94F42]"
                />
                <p className="text-[10px] text-[#77716A] mt-1 font-mono">
                  Input Cloudinary public ID or full HTTPS image URL.
                </p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-semibold text-[#77716A] tracking-wider mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={directAlt}
                  onChange={(e) => setDirectAlt(e.target.value)}
                  placeholder="Accessible image description..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8D1C5] rounded-xs text-[#25221F] placeholder:text-[#9E978C] focus:outline-none focus:border-[#A94F42]"
                />
              </div>

              {directKey && (
                <div className="relative aspect-[16/9] w-full max-w-[280px] bg-[#EFEAE0] border border-[#D8D1C5] rounded-xs overflow-hidden mx-auto">
                  <Image
                    src={buildCloudinaryUrl(directKey, { width: 600 })}
                    alt={directAlt || 'Preview'}
                    fill
                    sizes="280px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#D8D1C5] bg-[#FFFEFA] flex items-center justify-between">
          <div className="text-xs text-[#77716A]">
            {selectedAsset && activeTab === 'library' ? (
              <span className="font-mono text-[11px]">
                Selected: <strong className="text-[#25221F]">{selectedAsset.original_filename}</strong> ({selectedAsset.width} &times; {selectedAsset.height})
              </span>
            ) : (
              <span className="text-[11px]">Select an asset or upload a new image.</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs text-[#77716A] hover:text-[#25221F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={activeTab === 'library' ? !selectedAsset : !directKey.trim()}
              className="px-5 py-1.5 bg-[#A94F42] hover:bg-[#8F3E33] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors disabled:opacity-50 shadow-xs"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

