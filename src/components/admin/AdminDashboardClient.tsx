'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Layers,
  Trophy,
  Megaphone,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Filter,
  Check,
  AlertCircle,
  Database,
  Sliders,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { getAdminSession, clearAdminSession, type AdminUser } from '@/lib/auth/admin-static-auth';
import type {
  PopulatedArticle,
  PopulatedProduct,
  PopulatedHomepageSection,
  CompetitionRow,
  PopulatedAdCreative,
  MediaAssetRow,
  AuthorRow
} from '@/types/models';

type AdminTab = 'overview' | 'articles' | 'products' | 'homepage' | 'competitions' | 'advertising' | 'media' | 'settings';

interface AdminDashboardClientProps {
  initialArticles: PopulatedArticle[];
  initialProducts: PopulatedProduct[];
  initialSections: PopulatedHomepageSection[];
  initialCompetition: CompetitionRow | null;
  initialAdCreative: PopulatedAdCreative;
}

export function AdminDashboardClient({
  initialArticles,
  initialProducts,
  initialSections,
  initialCompetition,
  initialAdCreative,
}: AdminDashboardClientProps) {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    setCurrentUser(getAdminSession());
  }, []);

  const handleSignOut = () => {
    clearAdminSession();
    window.location.href = '/admin/login';
  };

  // Competition Modal State
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
  const [competitionModalMode, setCompetitionModalMode] = useState<'create' | 'edit'>('create');
  const [isSavingCompetition, setIsSavingCompetition] = useState(false);
  const [competitionForm, setCompetitionForm] = useState({
    id: '',
    title: '',
    slug: '',
    prize_summary: '',
    description: '',
    terms: '',
    start_time: '',
    end_time: '',
    status: 'active' as 'active' | 'draft' | 'scheduled' | 'closed',
    prize_title: '',
    prize_description: '',
  });

  const openCreateCompetition = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 2);
    setCompetitionForm({
      id: '',
      title: '',
      slug: '',
      prize_summary: 'One luxury silk embellished kaftan valued at up to $350 AUD.',
      description:
        'Purchase an eligible kaftan, scan your receipt and go in the draw to win an exclusive silk kaftan from Fashion Spectrum.',
      terms:
        'Open to Australian residents aged 18+. Competition closes 31 Dec 2026. Terms and conditions apply.',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: nextMonth.toISOString().slice(0, 16),
      status: 'active',
      prize_title: 'Grand Prize: Luxury Silk Kaftan of Choice',
      prize_description:
        'Winner selects any silk kaftan from the current Fashion Spectrum resort collection.',
    });
    setCompetitionModalMode('create');
    setIsCompetitionModalOpen(true);
  };

  const openEditCompetition = (comp: CompetitionRow) => {
    setCompetitionForm({
      id: comp.id,
      title: comp.title,
      slug: comp.slug,
      prize_summary: comp.prize_summary || '',
      description: comp.description || '',
      terms: comp.terms || '',
      start_time: comp.start_time
        ? new Date(comp.start_time).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      end_time: comp.end_time ? new Date(comp.end_time).toISOString().slice(0, 16) : '',
      status: (comp.status || 'active') as any,
      prize_title: 'Grand Prize: Luxury Silk Kaftan of Choice',
      prize_description: comp.prize_summary || '',
    });
    setCompetitionModalMode('edit');
    setIsCompetitionModalOpen(true);
  };

  const handleSaveCompetition = async () => {
    if (!competitionForm.title.trim()) {
      alert('Please enter a competition title');
      return;
    }
    if (!competitionForm.prize_summary.trim()) {
      alert('Please enter a prize summary');
      return;
    }

    setIsSavingCompetition(true);
    try {
      const res = await fetch('/api/admin/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...competitionForm,
          start_time: competitionForm.start_time
            ? new Date(competitionForm.start_time).toISOString()
            : new Date().toISOString(),
          end_time: competitionForm.end_time
            ? new Date(competitionForm.end_time).toISOString()
            : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save competition');
      }

      setCompetition(json.data);
      setIsCompetitionModalOpen(false);
      showToast(
        competitionModalMode === 'create'
          ? 'New giveaway created and activated!'
          : 'Competition details updated!'
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error saving competition';
      alert(msg);
    } finally {
      setIsSavingCompetition(false);
    }
  };

  // Dynamic Data States
  const [articles, setArticles] = useState<PopulatedArticle[]>(initialArticles);
  const [products, setProducts] = useState<PopulatedProduct[]>(initialProducts);
  const [sections, setSections] = useState<PopulatedHomepageSection[]>(initialSections);
  const [competition, setCompetition] = useState<CompetitionRow | null>(initialCompetition);
  const [adCreative, setAdCreative] = useState<PopulatedAdCreative>(initialAdCreative);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulated Entries for Competitions
  const [entries, setEntries] = useState([
    { id: 'ent-1', name: 'Sophie Campbell', email: 'sophie.c@sydney.com.au', receipt_code: 'FS-98421', store: 'David Jones Sydney', date: '2026-10-24', status: 'verified' },
    { id: 'ent-2', name: 'Isabella Vance', email: 'i.vance@melbourne.vic.gov.au', receipt_code: 'FS-98455', store: 'Fashion Spectrum Online', date: '2026-10-23', status: 'verified' },
    { id: 'ent-3', name: 'Claire Thornton', email: 'claire.t@perth.net.au', receipt_code: 'FS-98502', store: 'Myer Brisbane City', date: '2026-10-22', status: 'pending' },
    { id: 'ent-4', name: 'Eleanor Sterling', email: 'e.sterling@adelaide.com', receipt_code: 'FS-98519', store: 'Fashion Spectrum Online', date: '2026-10-21', status: 'pending' },
  ]);

  // Notifications
  const notifications = [
    { id: 'notif-1', title: 'New Competition Entry', desc: 'Claire Thornton entered with receipt FS-98502', time: '12m ago', unread: true },
    { id: 'notif-2', title: 'Catalog Updated', desc: 'Price modified for Blush Print Kaftan ($149 AUD)', time: '2h ago', unread: true },
    { id: 'notif-3', title: 'Article Published', desc: 'Desert Rose editorial is now live in Style section', time: '5h ago', unread: false },
  ];

  // Load saved state from localStorage if available
  useEffect(() => {
    try {
      const savedArticles = localStorage.getItem('kaftan_admin_articles');
      if (savedArticles) setArticles(JSON.parse(savedArticles));

      const savedProducts = localStorage.getItem('kaftan_admin_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedSections = localStorage.getItem('kaftan_admin_sections');
      if (savedSections) setSections(JSON.parse(savedSections));

      const savedComp = localStorage.getItem('kaftan_admin_competition');
      if (savedComp) setCompetition(JSON.parse(savedComp));

      const savedAd = localStorage.getItem('kaftan_admin_ad');
      if (savedAd) setAdCreative(JSON.parse(savedAd));
    } catch {
      // ignore
    }
  }, []);

  // Save changes helpers
  const persistProducts = (updated: PopulatedProduct[]) => {
    setProducts(updated);
    try {
      localStorage.setItem('kaftan_admin_products', JSON.stringify(updated));
    } catch {}
  };

  const persistArticles = (updated: PopulatedArticle[]) => {
    setArticles(updated);
    try {
      localStorage.setItem('kaftan_admin_articles', JSON.stringify(updated));
    } catch {}
  };

  const persistSections = (updated: PopulatedHomepageSection[]) => {
    setSections(updated);
    try {
      localStorage.setItem('kaftan_admin_sections', JSON.stringify(updated));
    } catch {}
  };

  const persistCompetition = (updated: CompetitionRow) => {
    setCompetition(updated);
    try {
      localStorage.setItem('kaftan_admin_competition', JSON.stringify(updated));
    } catch {}
  };

  const persistAdCreative = (updated: PopulatedAdCreative) => {
    setAdCreative(updated);
    try {
      localStorage.setItem('kaftan_admin_ad', JSON.stringify(updated));
    } catch {}
  };

  // Reset to Defaults
  const resetAllToDefaults = () => {
    if (confirm('Are you sure you want to reset all content to system defaults?')) {
      setArticles(initialArticles);
      setProducts(initialProducts);
      setSections(initialSections);
      setCompetition(initialCompetition);
      setAdCreative(initialAdCreative);
      try {
        localStorage.removeItem('kaftan_admin_articles');
        localStorage.removeItem('kaftan_admin_products');
        localStorage.removeItem('kaftan_admin_sections');
        localStorage.removeItem('kaftan_admin_competition');
        localStorage.removeItem('kaftan_admin_ad');
      } catch {}
      showToast('All data successfully restored to system defaults');
    }
  };

  // Export JSON Snapshot
  const exportSnapshot = () => {
    const data = { articles, products, sections, competition, adCreative, exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaftan-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Catalog & system backup exported successfully');
  };

  // Modals state
  const [editingProduct, setEditingProduct] = useState<PopulatedProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    brand_name: 'Fashion Spectrum',
    original_price: 249,
    sale_price: 149,
    currency: 'AUD',
    product_url: 'https://fashionspectrum.com.au',
    description: '',
    image_url: '/images/products/azure-resort-kaftan.jpg',
  });

  const [editingArticle, setEditingArticle] = useState<PopulatedArticle | null>(null);
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    slug: '',
    excerpt: '',
    article_type: 'fashion_editorial',
    status: 'published',
  });

  // Articles Filtering
  const [articleSearch, setArticleSearch] = useState('');
  const [articleTypeFilter, setArticleTypeFilter] = useState('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const query = (globalSearch || articleSearch).trim().toLowerCase();
      if (query) {
        if (!a.title.toLowerCase().includes(query) && !(a.excerpt && a.excerpt.toLowerCase().includes(query))) {
          return false;
        }
      }
      if (articleTypeFilter !== 'all' && a.article_type !== articleTypeFilter) {
        return false;
      }
      return true;
    });
  }, [articles, articleSearch, globalSearch, articleTypeFilter]);

  // Products Filtering
  const [productSearch, setProductSearch] = useState('');
  const [productBrandFilter, setProductBrandFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = (globalSearch || productSearch).trim().toLowerCase();
      if (query) {
        if (!p.name.toLowerCase().includes(query) && !p.brand_name.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (productBrandFilter !== 'all' && p.brand_name !== productBrandFilter) {
        return false;
      }
      return true;
    });
  }, [products, productSearch, globalSearch, productBrandFilter]);

  // Homepage Reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    const updated = reordered.map((sec, idx) => ({ ...sec, display_order: idx + 1 }));
    persistSections(updated);
    showToast(`Moved "${moved.name || moved.section_key}" ${direction}`);
  };

  const toggleSectionActive = (id: string) => {
    const updated = sections.map((sec) =>
      sec.id === id ? { ...sec, is_active: !sec.is_active } : sec
    );
    persistSections(updated);
    showToast('Updated section visibility status');
  };

  // Nav definition
  const navSections = [
    {
      heading: 'ANALYTICS & CORE',
      items: [
        { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
      ],
    },
    {
      heading: 'EDITORIAL PUBLISHING',
      items: [
        { key: 'articles', label: 'Articles & Stories', icon: FileText, count: articles.length },
        { key: 'homepage', label: 'Homepage Sequencer', icon: Layers, count: sections.filter((s) => s.is_active).length },
      ],
    },
    {
      heading: 'LUXURY CATALOG',
      items: [
        { key: 'products', label: 'Product Catalog', icon: ShoppingBag, count: products.length },
      ],
    },
    {
      heading: 'MARKETING & GROWTH',
      items: [
        { key: 'competitions', label: 'Competitions & Draws', icon: Trophy, count: entries.length },
        { key: 'advertising', label: 'Sponsor Campaigns', icon: Megaphone },
      ],
    },
    {
      heading: 'SYSTEM & ASSETS',
      items: [
        { key: 'media', label: 'Media Library', icon: ImageIcon },
        { key: 'settings', label: 'System Settings', icon: Settings },
      ],
    },
  ];

  const currentTabLabel = useMemo(() => {
    for (const sec of navSections) {
      for (const it of sec.items) {
        if (it.key === activeTab) return it.label;
      }
    }
    return 'Dashboard';
  }, [activeTab]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0C0B0A] text-[#EDE8DF]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1B18] text-[#FAF8F5] text-xs px-5 py-3.5 shadow-2xl border border-[#C5A880]/40 rounded-sm flex items-center space-x-3 animate-fade-in">
          <span className="text-[#C5A880] text-sm">✦</span>
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          MOBILE SIDEBAR BACKDROP & DRAWER
          ========================================================================= */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* =========================================================================
          PERSISTENT SIDEBAR (DESKTOP & MOBILE DRAWER)
          ========================================================================= */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-[#121110] border-r border-[#242220] transition-all duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-68'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#242220] flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-sm bg-[#C5A880] text-[#121110] flex items-center justify-center font-serif-editorial font-bold text-lg shrink-0 shadow-sm">
              K
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif-editorial text-lg tracking-[0.16em] text-[#FAF7F2] font-medium leading-none">
                  KAFTAN
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#9E978C] mt-1 font-semibold">
                  Editorial OS
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile, collapse toggle for desktop */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden text-[#9E978C] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex text-[#9E978C] hover:text-[#C5A880] p-1 transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Status Pill */}
        {!isSidebarCollapsed && (
          <div className="px-5 pt-4 pb-2">
            <div className="bg-[#181715] border border-[#2A2724] px-3 py-2 rounded-sm flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B5AEA3]">
                  Production Sync
                </span>
              </div>
              <span className="text-[9px] text-[#7E776C] font-mono">v2.4</span>
            </div>
          </div>
        )}

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1 text-[9px] uppercase tracking-[0.2em] font-bold text-[#6B655C]">
                  {sec.heading}
                </div>
              )}
              {sec.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key as AdminTab);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2.5 rounded-sm text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#242220] text-[#FAF7F2] shadow-inner border-l-2 border-[#C5A880]'
                        : 'text-[#9E978C] hover:bg-[#181715] hover:text-[#EDE8DF]'
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-[#C5A880]' : 'text-[#7E776C] group-hover:text-[#B5AEA3]'
                        }`}
                      />
                      {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isSidebarCollapsed && item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-xs font-mono font-semibold ${
                          isActive
                            ? 'bg-[#121110] text-[#C5A880] border border-[#3A3530]'
                            : 'bg-[#1A1816] text-[#7E776C]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#242220] space-y-2 bg-[#100F0E]">
          {/* Quick link to live store */}
          <Link
            href="/"
            target="_blank"
            className={`w-full flex items-center ${
              isSidebarCollapsed ? 'justify-center p-2' : 'px-3 py-2 justify-between'
            } text-xs text-[#9E978C] hover:text-[#FAF7F2] bg-[#161514] hover:bg-[#1E1C1A] border border-[#262422] rounded-sm transition-all`}
            title="Open Live Public Site in new tab"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
              {!isSidebarCollapsed && <span>View Public Site</span>}
            </div>
            {!isSidebarCollapsed && <ArrowUpRight className="w-3.5 h-3.5 text-[#7E776C]" />}
          </Link>

          {/* User Profile Card */}
          <div
            className={`flex items-center ${
              isSidebarCollapsed ? 'justify-center p-1' : 'space-x-3 px-3 py-2'
            } rounded-sm bg-[#141312] border border-[#22201E]`}
          >
            <div className="w-8 h-8 rounded-full bg-[#2A2724] border border-[#3D3833] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center shrink-0">
              ED
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-[#FAF7F2] truncate">Editorial Desk</span>
                <span className="text-[10px] text-[#7E776C] truncate">Chief Editor • Admin</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT VIEWPORT
          ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Command & Navigation Bar */}
        <header className="h-16 bg-[#121110] border-b border-[#242220] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile Sidebar Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-[#9E978C] hover:text-white p-1.5 rounded-sm hover:bg-[#1C1A18]"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#6B655C] uppercase tracking-wider hidden sm:inline">CMS</span>
              <ChevronRight className="w-3 h-3 text-[#4D4841] hidden sm:inline" />
              <span className="text-[#FAF7F2] font-medium">{currentTabLabel}</span>
            </div>
          </div>

          {/* Global Quick Search Bar */}
          <div className="flex-1 max-w-md hidden md:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-[#7E776C] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search stories, products, SKU, authors..."
              className="w-full bg-[#181715] border border-[#2A2724] focus:border-[#C5A880] text-[#FAF7F2] text-xs pl-9 pr-14 py-2 rounded-sm focus:outline-hidden transition-colors"
            />
            {globalSearch ? (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 text-[#7E776C] hover:text-white text-xs"
              >
                Clear
              </button>
            ) : (
              <span className="absolute right-3 text-[10px] text-[#6B655C] font-mono border border-[#332F2A] px-1.5 py-0.5 rounded-xs">
                ⌘K
              </span>
            )}
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* New Product Shortcut */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('products');
                setIsAddProductOpen(true);
              }}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-[#C5A880] hover:bg-[#B3956F] text-[#121110] px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>

            {/* New Story Shortcut */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('articles');
                setIsAddArticleOpen(true);
              }}
              className="hidden xl:inline-flex items-center space-x-1.5 bg-[#22201E] hover:bg-[#2C2926] text-[#FAF7F2] border border-[#36322D] px-3 py-1.5 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>New Story</span>
            </button>

            {/* Export Snapshot */}
            <button
              type="button"
              onClick={exportSnapshot}
              className="text-[#9E978C] hover:text-[#FAF7F2] hover:bg-[#1C1A18] p-2 rounded-sm transition-colors border border-[#262422]"
              title="Export Full JSON Database Snapshot"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Notifications Menu Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative text-[#9E978C] hover:text-[#FAF7F2] hover:bg-[#1C1A18] p-2 rounded-sm transition-colors border border-[#262422]"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C86D51] rounded-full ring-2 ring-[#121110]"></span>
              </button>

              {/* Header Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#55504A] hover:text-[#A94F42] hover:bg-[#EFEAE0] px-2.5 py-1.5 rounded-sm transition-colors border border-[#D8D1C5]"
                title="Sign out of Admin Suite"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">Sign Out</span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#161514] border border-[#2E2A26] rounded-sm shadow-2xl z-50 p-3 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#242220]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
                      Activity Alerts
                    </span>
                    <span className="text-[10px] text-[#C5A880] cursor-pointer" onClick={() => setIsNotificationsOpen(false)}>
                      Dismiss All
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-sm text-xs transition-colors ${
                          n.unread ? 'bg-[#1E1C1A] border border-[#332F2A]' : 'bg-[#121110]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#FAF7F2]">{n.title}</span>
                          <span className="text-[10px] text-[#7E776C] font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#A69E92] mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0C0B0A] scrollbar-thin">
          {/* =========================================================================
              TAB 1: DASHBOARD OVERVIEW
              ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Executive Welcome Banner */}
              <div className="bg-[#141312] border border-[#262422] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                      Editorial Management Suite
                    </span>
                    <span className="text-[10px] bg-[#22201D] text-[#A69E92] px-2 py-0.5 rounded-xs border border-[#332F2A]">
                      Sydney Time (AEST)
                    </span>
                  </div>
                  <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#FAF7F2] font-normal mt-2">
                    KAFTAN Executive Dashboard
                  </h1>
                  <p className="text-xs text-[#9E978C] mt-1 max-w-xl">
                    Publish editorial stories, curate luxury kaftan designer catalogs, sequence homepage curation, and manage commercial affiliate partnerships.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('articles');
                      setIsAddArticleOpen(true);
                    }}
                    className="text-xs font-semibold uppercase tracking-[0.18em] bg-[#FAF7F2] text-[#121110] px-4 py-2.5 rounded-sm hover:bg-[#C5A880] transition-colors"
                  >
                    + Publish Story
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('products');
                      setIsAddProductOpen(true);
                    }}
                    className="text-xs font-semibold uppercase tracking-[0.18em] bg-[#1E1C1A] text-[#FAF7F2] border border-[#332F2A] px-4 py-2.5 rounded-sm hover:border-[#C5A880] transition-colors"
                  >
                    + New Product
                  </button>
                </div>
              </div>

              {/* High-Impact KPI Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div
                  onClick={() => setActiveTab('articles')}
                  className="bg-[#141312] border border-[#242220] hover:border-[#C5A880]/60 p-5 rounded-sm cursor-pointer transition-all hover:bg-[#181615] group"
                >
                  <div className="flex items-center justify-between text-[#7E776C]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E978C]">
                      Published Stories
                    </span>
                    <FileText className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="font-serif-editorial text-3xl text-[#FAF7F2] font-normal">
                      {articles.filter((a) => a.status === 'published').length}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" /> 100% Live
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#22201E] flex items-center justify-between text-[11px] text-[#9E978C] group-hover:text-[#C5A880]">
                    <span>Manage Editorial Desk</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-[#141312] border border-[#242220] hover:border-[#C5A880]/60 p-5 rounded-sm cursor-pointer transition-all hover:bg-[#181615] group"
                >
                  <div className="flex items-center justify-between text-[#7E776C]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E978C]">
                      Catalog Products
                    </span>
                    <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="font-serif-editorial text-3xl text-[#FAF7F2] font-normal">
                      {products.length}
                    </p>
                    <span className="text-[10px] text-[#C5A880] font-mono">
                      Fashion Spectrum
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#22201E] flex items-center justify-between text-[11px] text-[#9E978C] group-hover:text-[#C5A880]">
                    <span>View Luxury Inventory</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div
                  onClick={() => setActiveTab('homepage')}
                  className="bg-[#141312] border border-[#242220] hover:border-[#C5A880]/60 p-5 rounded-sm cursor-pointer transition-all hover:bg-[#181615] group"
                >
                  <div className="flex items-center justify-between text-[#7E776C]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E978C]">
                      Homepage Sections
                    </span>
                    <Layers className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="font-serif-editorial text-3xl text-[#FAF7F2] font-normal">
                      {sections.filter((s) => s.is_active).length}
                    </p>
                    <span className="text-[10px] text-[#A69E92] font-mono">
                      of {sections.length} configured
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#22201E] flex items-center justify-between text-[11px] text-[#9E978C] group-hover:text-[#C5A880]">
                    <span>Sequence Layout Order</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div
                  onClick={() => setActiveTab('competitions')}
                  className="bg-[#141312] border border-[#242220] hover:border-[#C5A880]/60 p-5 rounded-sm cursor-pointer transition-all hover:bg-[#181615] group"
                >
                  <div className="flex items-center justify-between text-[#7E776C]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E978C]">
                      Competition Entries
                    </span>
                    <Trophy className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="font-serif-editorial text-3xl text-[#FAF7F2] font-normal">
                      {entries.length}
                    </p>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {entries.filter((e) => e.status === 'pending').length} Pending
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#22201E] flex items-center justify-between text-[11px] text-[#9E978C] group-hover:text-[#C5A880]">
                    <span>Review Receipts</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Two Column Command Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Recent Activity & Quick Catalog */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Stories Snapshot */}
                  <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-[#C5A880]" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FAF7F2]">
                          Recent Editorial Features
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('articles')}
                        className="text-xs text-[#C5A880] hover:underline"
                      >
                        View All Stories &rarr;
                      </button>
                    </div>

                    <div className="divide-y divide-[#22201E]">
                      {articles.slice(0, 4).map((art) => (
                        <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-3 truncate">
                            <div className="relative w-10 h-10 rounded-xs overflow-hidden bg-[#242220] shrink-0 border border-[#332F2A]">
                              <Image
                                src={art.featured_image?.storage_key || '/images/editorial/hero-mediterranean-resortwear.jpg'}
                                alt={art.title}
                                fill
                                sizes="40px"
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div className="truncate">
                              <span className="text-xs font-medium text-[#FAF7F2] truncate block hover:text-[#C5A880] transition-colors">
                                {art.title}
                              </span>
                              <div className="flex items-center space-x-2 text-[10px] text-[#7E776C] mt-0.5">
                                <span className="uppercase tracking-wider">{art.article_type.replace('_', ' ')}</span>
                                <span>•</span>
                                <span>{art.author?.name || 'KAFTAN Editorial'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-xs">
                              {art.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingArticle(art);
                              }}
                              className="text-xs text-[#9E978C] hover:text-[#FAF7F2] p-1"
                              title="Edit Story"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Catalog Kaftans Snapshot */}
                  <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-[#C5A880]" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FAF7F2]">
                          Featured Luxury Kaftans
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="text-xs text-[#C5A880] hover:underline"
                      >
                        Manage Catalog ({products.length}) &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {products.slice(0, 4).map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3 bg-[#181715] border border-[#262422] rounded-sm flex items-center space-x-3 hover:border-[#38342E] transition-colors"
                        >
                          <div className="relative w-12 h-14 bg-[#242220] rounded-xs overflow-hidden shrink-0 border border-[#332F2A]">
                            <Image
                              src={prod.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
                              alt={prod.name}
                              fill
                              sizes="48px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="truncate flex-1">
                            <span className="text-xs font-medium text-[#FAF7F2] truncate block">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-[#9E978C] block mt-0.5">
                              {prod.brand_name}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs font-mono font-semibold text-[#C5A880]">
                                ${prod.sale_price || prod.original_price} {prod.currency}
                              </span>
                              {prod.sale_price && (
                                <span className="text-[10px] line-through text-[#6B655C]">
                                  ${prod.original_price}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Commercial Campaigns, Receipts & Architecture */}
                <div className="space-y-6">
                  {/* Commercial Sponsor Snapshot */}
                  <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#C86D51]">
                        Commercial Campaign
                      </span>
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-xs font-mono">
                        Active Sponsor
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif-editorial text-lg text-[#FAF7F2]">
                        {adCreative?.headline || 'Fashion Spectrum Australia'}
                      </h3>
                      <p className="text-xs text-[#9E978C] mt-1">
                        &quot;{adCreative?.copy || 'Effortless silk kaftans for every luxury resort occasion.'}&quot;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#22201E] text-xs">
                      <div className="bg-[#181715] p-3 rounded-xs border border-[#282522]">
                        <span className="text-[10px] text-[#7E776C] uppercase tracking-wider block">Impressions</span>
                        <span className="text-lg font-mono font-bold text-[#FAF7F2] mt-0.5 block">14,290</span>
                      </div>
                      <div className="bg-[#181715] p-3 rounded-xs border border-[#282522]">
                        <span className="text-[10px] text-[#7E776C] uppercase tracking-wider block">Click Rate</span>
                        <span className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">8.4% CTR</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('advertising')}
                      className="w-full py-2 text-center text-xs text-[#C5A880] border border-[#332F2A] hover:bg-[#1C1A18] rounded-xs transition-colors"
                    >
                      Configure Ad Creatives &rarr;
                    </button>
                  </div>

                  {/* Competition Receipt Review */}
                  <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-[#C5A880]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
                          Latest Entrants
                        </span>
                      </div>
                      <span className="text-xs text-[#7E776C] font-mono">{entries.length} total</span>
                    </div>

                    <div className="space-y-2.5">
                      {entries.slice(0, 3).map((ent) => (
                        <div
                          key={ent.id}
                          className="p-2.5 bg-[#181715] border border-[#262422] rounded-xs flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-medium text-[#FAF7F2] block">{ent.name}</span>
                            <span className="text-[10px] text-[#7E776C] font-mono">
                              {ent.receipt_code} • {ent.store}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-xs ${
                              ent.status === 'verified'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            }`}
                          >
                            {ent.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('competitions')}
                      className="w-full py-2 text-center text-xs text-[#C5A880] border border-[#332F2A] hover:bg-[#1C1A18] rounded-xs transition-colors"
                    >
                      View All Submissions &rarr;
                    </button>
                  </div>

                  {/* Infrastructure Status */}
                  <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-[#C5A880]" />
                      <span className="font-bold uppercase tracking-wider text-[#FAF7F2]">
                        System Architecture
                      </span>
                    </div>

                    <div className="space-y-2 text-[11px] text-[#9E978C] pt-2 border-t border-[#22201E]">
                      <div className="flex justify-between">
                        <span>Framework:</span>
                        <span className="text-[#FAF7F2] font-mono">Next.js 16.4 App Router</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database:</span>
                        <span className="text-emerald-400 font-mono">PostgreSQL Supabase (Online)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assets CDN:</span>
                        <span className="text-[#FAF7F2] font-mono">Cloudinary &amp; High-Res Local</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cache Sync:</span>
                        <span className="text-[#FAF7F2] font-mono">Browser LocalStorage Bridge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: ARTICLES & EDITORIAL STORIES
              ========================================================================= */}
          {activeTab === 'articles' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141312] p-5 border border-[#242220] rounded-sm">
                <div>
                  <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">Editorial Stories</h2>
                  <p className="text-xs text-[#9E978C] mt-0.5">
                    Manage luxury articles, fashion features, resort interviews, and trend reports.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddArticleOpen(true)}
                  className="inline-flex items-center space-x-2 bg-[#C5A880] hover:bg-[#B3956F] text-[#121110] px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Story</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-[#7E776C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Search stories by headline or excerpt..."
                    className="w-full bg-[#141312] border border-[#242220] focus:border-[#C5A880] text-xs text-[#FAF7F2] pl-9 pr-3 py-2 rounded-sm focus:outline-hidden"
                  />
                </div>
                <select
                  value={articleTypeFilter}
                  onChange={(e) => setArticleTypeFilter(e.target.value)}
                  className="bg-[#141312] border border-[#242220] text-xs text-[#FAF7F2] px-3 py-2 rounded-sm uppercase tracking-wider focus:outline-hidden"
                >
                  <option value="all">All Formats</option>
                  <option value="fashion_editorial">Fashion Editorial</option>
                  <option value="interview">Interview</option>
                  <option value="trend_report">Trend Report</option>
                  <option value="style_guide">Style Guide</option>
                  <option value="designer_profile">Designer Profile</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto bg-[#141312] border border-[#242220] rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181715] text-[10px] uppercase font-bold text-[#9E978C] border-b border-[#242220]">
                    <tr>
                      <th className="p-3.5">Cover</th>
                      <th className="p-3.5">Title &amp; Slug</th>
                      <th className="p-3.5">Format</th>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22201E] text-[#A69E92]">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#181715] transition-colors">
                        <td className="p-3.5 w-16">
                          <div className="relative w-12 h-12 bg-[#22201E] rounded-xs overflow-hidden border border-[#332F2A]">
                            <Image
                              src={art.featured_image?.storage_key || '/images/editorial/hero-mediterranean-resortwear.jpg'}
                              alt={art.title}
                              fill
                              sizes="48px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3.5">
                          <Link href={`/stories/${art.slug}`} target="_blank" className="font-semibold text-[#FAF7F2] hover:text-[#C5A880] block">
                            {art.title}
                          </Link>
                          <span className="text-[10px] text-[#6B655C] font-mono mt-0.5 block">
                            /stories/{art.slug}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10px] uppercase tracking-wider bg-[#1E1C1A] text-[#C5A880] px-2 py-0.5 rounded-xs border border-[#332F2A]">
                            {art.article_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-[#FAF7F2]">
                          {art.author?.name || 'KAFTAN Editorial'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-xs ${
                              art.status === 'published'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-[#22201E] text-[#7E776C]'
                            }`}
                          >
                            {art.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingArticle(art)}
                            className="p-1.5 text-[#9E978C] hover:text-[#FAF7F2] hover:bg-[#242220] rounded-xs transition-colors"
                            title="Edit Story"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete story "${art.title}"?`)) {
                                const updated = articles.filter((a) => a.id !== art.id);
                                persistArticles(updated);
                                showToast(`Deleted "${art.title}"`);
                              }
                            }}
                            className="p-1.5 text-[#7E776C] hover:text-rose-400 hover:bg-[#242220] rounded-xs transition-colors"
                            title="Delete Story"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: PRODUCTS & COMMERCE CATALOG
              ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141312] p-5 border border-[#242220] rounded-sm">
                <div>
                  <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">Luxury Product Catalog</h2>
                  <p className="text-xs text-[#9E978C] mt-0.5">
                    Curate luxury resort kaftans, set sale pricing, and configure direct affiliate destination links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(true)}
                  className="inline-flex items-center space-x-2 bg-[#C5A880] hover:bg-[#B3956F] text-[#121110] px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Kaftan</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-[#7E776C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products by title or brand..."
                    className="w-full bg-[#141312] border border-[#242220] focus:border-[#C5A880] text-xs text-[#FAF7F2] pl-9 pr-3 py-2 rounded-sm focus:outline-hidden"
                  />
                </div>
                <select
                  value={productBrandFilter}
                  onChange={(e) => setProductBrandFilter(e.target.value)}
                  className="bg-[#141312] border border-[#242220] text-xs text-[#FAF7F2] px-3 py-2 rounded-sm uppercase tracking-wider focus:outline-hidden"
                >
                  <option value="all">All Brands</option>
                  <option value="Fashion Spectrum">Fashion Spectrum</option>
                  <option value="Camilla">Camilla</option>
                  <option value="Silk Islands">Silk Islands</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto bg-[#141312] border border-[#242220] rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181715] text-[10px] uppercase font-bold text-[#9E978C] border-b border-[#242220]">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5">Brand</th>
                      <th className="p-3.5">Retail Price</th>
                      <th className="p-3.5">Sale Price</th>
                      <th className="p-3.5">Affiliate Link</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22201E] text-[#A69E92]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#181715] transition-colors">
                        <td className="p-3.5 w-16">
                          <div className="relative w-12 h-14 bg-[#22201E] rounded-xs overflow-hidden border border-[#332F2A]">
                            <Image
                              src={prod.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
                              alt={prod.name}
                              fill
                              sizes="48px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-3.5">
                          <Link href={`/products/${prod.slug}`} target="_blank" className="font-semibold text-[#FAF7F2] hover:text-[#C5A880] block">
                            {prod.name}
                          </Link>
                          <span className="text-[10px] text-[#6B655C] font-mono mt-0.5 block">
                            /products/{prod.slug}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-[#FAF7F2]">{prod.brand_name}</td>
                        <td className="p-3.5 font-mono text-[#FAF7F2]">
                          ${prod.original_price} {prod.currency}
                        </td>
                        <td className="p-3.5 font-mono">
                          {prod.sale_price ? (
                            <span className="text-[#C5A880] font-semibold">
                              ${prod.sale_price} {prod.currency}
                            </span>
                          ) : (
                            <span className="text-[#6B655C]">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {prod.product_url ? (
                            <a
                              href={prod.product_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#C5A880] hover:underline flex items-center space-x-1"
                            >
                              <span className="truncate max-w-[140px]">{prod.product_url.replace('https://', '')}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-[#6B655C]">—</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-[#9E978C] hover:text-[#FAF7F2] hover:bg-[#242220] rounded-xs transition-colors"
                            title="Edit Kaftan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove product "${prod.name}"?`)) {
                                const updated = products.filter((p) => p.id !== prod.id);
                                persistProducts(updated);
                                showToast(`Removed "${prod.name}"`);
                              }
                            }}
                            className="p-1.5 text-[#7E776C] hover:text-rose-400 hover:bg-[#242220] rounded-xs transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: HOMEPAGE SEQUENCER
              ========================================================================= */}
          {activeTab === 'homepage' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#141312] p-5 border border-[#242220] rounded-sm">
                <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">Homepage Section Sequencer</h2>
                <p className="text-xs text-[#9E978C] mt-1">
                  Drag or reorder blocks to change the vertical narrative flow of the publication homepage.
                </p>
              </div>

              <div className="space-y-3">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className={`p-4 bg-[#141312] border rounded-sm flex items-center justify-between transition-all ${
                      sec.is_active ? 'border-[#2E2A26]' : 'border-[#22201E] opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-xs bg-[#1C1A18] border border-[#332F2A] flex items-center justify-center font-mono text-xs text-[#C5A880]">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-[#FAF7F2]">
                            {sec.name || sec.section_key}
                          </span>
                          <span className="text-[10px] font-mono text-[#7E776C] bg-[#1E1C1A] px-1.5 py-0.5 rounded-xs">
                            {sec.section_key}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#9E978C] mt-0.5 block">
                          Display Order: {sec.display_order} • Status: {sec.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleSectionActive(sec.id)}
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-xs transition-colors ${
                          sec.is_active
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-[#22201E] text-[#7E776C]'
                        }`}
                      >
                        {sec.is_active ? 'Enabled' : 'Hidden'}
                      </button>

                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, 'up')}
                        className="p-1.5 text-[#9E978C] hover:text-[#FAF7F2] disabled:opacity-30 border border-[#262422] rounded-xs hover:bg-[#1E1C1A]"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(idx, 'down')}
                        className="p-1.5 text-[#9E978C] hover:text-[#FAF7F2] disabled:opacity-30 border border-[#262422] rounded-xs hover:bg-[#1E1C1A]"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: COMPETITIONS & GIVEAWAY DRAWS
              ========================================================================= */}
          {activeTab === 'competitions' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-[#141312] p-5 border border-[#242220] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">
                    Competitions &amp; Store Receipt Verification
                  </h2>
                  <p className="text-xs text-[#9E978C] mt-0.5">
                    Verify in-store proof of purchase receipts (David Jones, Myer, boutiques) and draw lucky winners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,ID,Name,Email,Receipt,Store,Date,Status\n' +
                      entries.map((e) => `${e.id},"${e.name}",${e.email},${e.receipt_code},"${e.store}",${e.date},${e.status}`).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'kaftan-competition-entrants.csv');
                    link.click();
                    showToast('Exported CSV of entrants');
                  }}
                  className="inline-flex items-center space-x-2 bg-[#22201E] hover:bg-[#2C2926] text-[#FAF7F2] border border-[#36322D] px-4 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <Download className="w-4 h-4 text-[#C5A880]" />
                  <span>Download Entrants CSV</span>
                </button>
              </div>

              {/* Active Campaign Card */}
              {competition && (
                <div className="bg-[#141312] border border-[#242220] p-6 rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                      Active Giveaway Promotion
                    </span>
                    <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded-xs font-mono">
                      Running
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#7E776C] text-[10px] uppercase tracking-wider">Promotion Title</span>
                      <p className="text-[#FAF7F2] font-semibold text-sm mt-0.5">{competition.title}</p>
                    </div>
                    <div>
                      <span className="text-[#7E776C] text-[10px] uppercase tracking-wider">Prize Value</span>
                      <p className="text-[#C5A880] font-semibold text-sm mt-0.5">{competition.prize_summary || '$2,500 AUD Luxury Wardrobe'}</p>
                    </div>
                    <div>
                      <span className="text-[#7E776C] text-[10px] uppercase tracking-wider">Submission Window</span>
                      <p className="text-[#FAF7F2] text-xs mt-0.5">Ends Nov 30, 2026</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Entrants Table */}
              <div className="overflow-x-auto bg-[#141312] border border-[#242220] rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181715] text-[10px] uppercase font-bold text-[#9E978C] border-b border-[#242220]">
                    <tr>
                      <th className="p-3.5">Applicant Name</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Receipt #</th>
                      <th className="p-3.5">Retail Partner</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22201E] text-[#A69E92]">
                    {entries.map((ent) => (
                      <tr key={ent.id} className="hover:bg-[#181715] transition-colors">
                        <td className="p-3.5 font-semibold text-[#FAF7F2]">{ent.name}</td>
                        <td className="p-3.5 font-mono text-[#9E978C]">{ent.email}</td>
                        <td className="p-3.5 font-mono text-[#C5A880]">{ent.receipt_code}</td>
                        <td className="p-3.5">{ent.store}</td>
                        <td className="p-3.5 text-[10px] font-mono text-[#7E776C]">{ent.date}</td>
                        <td className="p-3.5">
                          <span
                            className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-xs ${
                              ent.status === 'verified'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            }`}
                          >
                            {ent.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {ent.status === 'pending' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEntries(
                                  entries.map((e) => (e.id === ent.id ? { ...e, status: 'verified' } : e))
                                );
                                showToast(`Verified receipt for ${ent.name}`);
                              }}
                              className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2 py-1 rounded-xs hover:bg-emerald-800 transition-colors"
                            >
                              Verify Receipt
                            </button>
                          ) : (
                            <span className="text-[10px] text-[#6B655C]">Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: ADVERTISING & SPONSOR CAMPAIGNS
              ========================================================================= */}
          {activeTab === 'advertising' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#141312] p-5 border border-[#242220] rounded-sm">
                <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">Sponsor Banner Campaigns</h2>
                <p className="text-xs text-[#9E978C] mt-1">
                  Configure sponsored banner creatives, affiliate destination links, and partner branding displayed on the editorial site.
                </p>
              </div>

              <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-5">
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1.5">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      value={adCreative.headline}
                      onChange={(e) => setAdCreative({ ...adCreative, headline: e.target.value })}
                      className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3.5 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1.5">
                      Editorial Copy / Description
                    </label>
                    <textarea
                      rows={3}
                      value={adCreative.copy || ''}
                      onChange={(e) => setAdCreative({ ...adCreative, copy: e.target.value })}
                      className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3.5 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1.5">
                      Destination URL
                    </label>
                    <input
                      type="text"
                      value={adCreative.destination_url}
                      onChange={(e) => setAdCreative({ ...adCreative, destination_url: e.target.value })}
                      className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3.5 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#22201E] flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      persistAdCreative(adCreative);
                      showToast('Saved commercial ad campaign creative');
                    }}
                    className="bg-[#C5A880] hover:bg-[#B3956F] text-[#121110] px-5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Save Campaign Creative
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: MEDIA ASSETS LIBRARY
              ========================================================================= */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="bg-[#141312] p-5 border border-[#242220] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">Media &amp; Assets Library</h2>
                  <p className="text-xs text-[#9E978C] mt-0.5">
                    High-resolution editorial photography, resort imagery, and product catalog media.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#9E978C]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>CDN Active (Cloudinary &amp; Local)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Azure Resort Kaftan', path: '/images/products/azure-resort-kaftan.jpg', tag: 'Product' },
                  { name: 'Blush Print Kaftan', path: '/images/products/blush-print-kaftan.jpg', tag: 'Product' },
                  { name: 'Emerald Oasis Maxi', path: '/images/products/emerald-oasis-maxi-kaftan.jpg', tag: 'Product' },
                  { name: 'Desert Mirage Kaftan', path: '/images/products/desert-mirage-silk-kaftan.jpg', tag: 'Product' },
                  { name: 'Gold Coast Silk Kaftan', path: '/images/products/gold-coast-silk-kaftan.jpg', tag: 'Product' },
                  { name: 'Coral Reef Kaftan', path: '/images/products/coral-reef-embellished-kaftan.jpg', tag: 'Product' },
                  { name: 'Mediterranean Resortwear', path: '/images/editorial/hero-mediterranean-resortwear.jpg', tag: 'Editorial' },
                  { name: 'Desert Rose Editorial', path: '/images/editorial/desert-rose.jpg', tag: 'Editorial' },
                ].map((asset, i) => (
                  <div key={i} className="bg-[#141312] border border-[#242220] rounded-sm overflow-hidden group">
                    <div className="relative h-44 bg-[#22201E]">
                      <Image
                        src={asset.path}
                        alt={asset.name}
                        fill
                        sizes="250px"
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[9px] uppercase font-mono px-2 py-0.5 bg-black/70 text-[#FAF7F2] rounded-xs backdrop-blur-xs">
                        {asset.tag}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between text-xs">
                      <span className="truncate text-[#FAF7F2] font-medium">{asset.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(asset.path);
                          showToast(`Copied path: ${asset.path}`);
                        }}
                        className="text-[10px] text-[#C5A880] hover:underline shrink-0 ml-2"
                      >
                        Copy Path
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 8: SYSTEM SETTINGS & MAINTENANCE
              ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#141312] p-5 border border-[#242220] rounded-sm">
                <h2 className="font-serif-editorial text-2xl text-[#FAF7F2]">System Settings &amp; Data Tools</h2>
                <p className="text-xs text-[#9E978C] mt-1">
                  Manage persistence layers, export/import backups, and view database synchronization details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Backup Card */}
                <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-[#C5A880]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
                      Backup &amp; Export
                    </h3>
                  </div>
                  <p className="text-xs text-[#9E978C]">
                    Download a full offline JSON snapshot containing all editorial stories, products catalog, homepage section order, and competition records.
                  </p>
                  <button
                    type="button"
                    onClick={exportSnapshot}
                    className="w-full py-2.5 bg-[#C5A880] hover:bg-[#B3956F] text-[#121110] rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Export Full Snapshot (JSON)
                  </button>
                </div>

                {/* Reset Factory Defaults */}
                <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#FAF7F2]">
                      Factory Reset
                    </h3>
                  </div>
                  <p className="text-xs text-[#9E978C]">
                    Revert all local storage custom edits back to initial seed data from Supabase / fallback constants.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllToDefaults}
                    className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-xs text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Reset Content to Defaults
                  </button>
                </div>
              </div>

              {/* Publication Information */}
              <div className="bg-[#141312] border border-[#242220] rounded-sm p-6 space-y-3 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                  Publication Specifications
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#9E978C] pt-2 border-t border-[#22201E]">
                  <div>
                    <span className="font-semibold text-[#FAF7F2] block">Publication Entity</span>
                    <p className="text-[11px] mt-0.5">KAFTAN Australia — The World of Women&apos;s Fashion</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#FAF7F2] block">Editorial Lead Sponsor</span>
                    <p className="text-[11px] mt-0.5">Fashion Spectrum Australia (fashionspectrum.com.au)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#FAF7F2] block">Timezone</span>
                    <p className="text-[11px] mt-0.5">Australia/Sydney (AEST/AEDT)</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#FAF7F2] block">Engine</span>
                    <p className="text-[11px] mt-0.5">Next.js 16.4 • React 19 • Supabase</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL: ADD NEW PRODUCT
          ========================================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#141312] border border-[#2E2A26] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242220]">
              <h3 className="font-serif-editorial text-2xl text-[#FAF7F2]">Add New Kaftan</h3>
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="text-[#9E978C] hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    })
                  }
                  placeholder="e.g. Azure Mediterranean Resort Kaftan"
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand_name}
                    onChange={(e) => setNewProduct({ ...newProduct, brand_name: e.target.value })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Retail Price ($ AUD)
                  </label>
                  <input
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Sale Price ($ AUD)
                  </label>
                  <input
                    type="number"
                    value={newProduct.sale_price}
                    onChange={(e) => setNewProduct({ ...newProduct, sale_price: Number(e.target.value) })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Affiliate / Store URL
                </label>
                <input
                  type="text"
                  value={newProduct.product_url}
                  onChange={(e) => setNewProduct({ ...newProduct, product_url: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#242220] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#9E978C] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newProduct.name.trim()) return alert('Please enter a product name');
                  const productToAdd: PopulatedProduct = {
                    id: `prod-${Date.now()}`,
                    name: newProduct.name,
                    slug: newProduct.slug || 'new-product',
                    brand_name: newProduct.brand_name,
                    description: newProduct.description,
                    original_price: newProduct.original_price,
                    sale_price: newProduct.sale_price || null,
                    currency: newProduct.currency,
                    product_url: newProduct.product_url,
                    link_type: 'external',
                    status: 'active',
                    image_id: `img-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    image: {
                      id: `img-${Date.now()}`,
                      storage_key: newProduct.image_url,
                      original_filename: 'product.jpg',
                      mime_type: 'image/jpeg',
                      width: 800,
                      height: 1000,
                      file_size_bytes: 250000,
                      alt_text: newProduct.name,
                      caption: null,
                      credit: null,
                      license_info: null,
                      metadata: {},
                      uploaded_by: null,
                      created_at: new Date().toISOString(),
                    },
                  };
                  const updated = [productToAdd, ...products];
                  persistProducts(updated);
                  setIsAddProductOpen(false);
                  setNewProduct({
                    name: '',
                    slug: '',
                    brand_name: 'Fashion Spectrum',
                    original_price: 249,
                    sale_price: 149,
                    currency: 'AUD',
                    product_url: 'https://fashionspectrum.com.au',
                    description: '',
                    image_url: '/images/products/azure-resort-kaftan.jpg',
                  });
                  showToast(`Added "${productToAdd.name}" to catalog`);
                }}
                className="px-5 py-2 bg-[#C5A880] text-[#121110] text-xs font-semibold uppercase tracking-wider hover:bg-[#B3956F] rounded-xs transition-colors"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT PRODUCT
          ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#141312] border border-[#2E2A26] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242220]">
              <h3 className="font-serif-editorial text-2xl text-[#FAF7F2]">Edit Kaftan</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-[#9E978C] hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Retail Price ($ AUD)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.original_price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, original_price: Number(e.target.value) })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Sale Price ($ AUD)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.sale_price !== null && editingProduct.sale_price !== undefined ? editingProduct.sale_price : ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Affiliate / Store URL
                </label>
                <input
                  type="text"
                  value={editingProduct.product_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, product_url: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#242220] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#9E978C] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
                  persistProducts(updated);
                  setEditingProduct(null);
                  showToast(`Saved changes to "${editingProduct.name}"`);
                }}
                className="px-5 py-2 bg-[#C5A880] text-[#121110] text-xs font-semibold uppercase tracking-wider hover:bg-[#B3956F] rounded-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW STORY
          ========================================================================= */}
      {isAddArticleOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#141312] border border-[#2E2A26] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242220]">
              <h3 className="font-serif-editorial text-2xl text-[#FAF7F2]">Publish New Story</h3>
              <button
                type="button"
                onClick={() => setIsAddArticleOpen(false)}
                className="text-[#9E978C] hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) =>
                    setNewArticle({
                      ...newArticle,
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    })
                  }
                  placeholder="e.g. The Architecture of Resort Elegance"
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newArticle.slug}
                  onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Excerpt / Editorial Synopsis
                </label>
                <textarea
                  rows={3}
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Editorial Format
                  </label>
                  <select
                    value={newArticle.article_type}
                    onChange={(e) => setNewArticle({ ...newArticle, article_type: e.target.value })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  >
                    <option value="fashion_editorial">Fashion Editorial</option>
                    <option value="interview">Interview</option>
                    <option value="trend_report">Trend Report</option>
                    <option value="style_guide">Style Guide</option>
                    <option value="designer_profile">Designer Profile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                    Status
                  </label>
                  <select
                    value={newArticle.status}
                    onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value })}
                    className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#242220] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddArticleOpen(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#9E978C] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newArticle.title.trim()) return alert('Please enter a headline');
                  const articleToAdd: PopulatedArticle = {
                    id: `art-${Date.now()}`,
                    title: newArticle.title,
                    slug: newArticle.slug || 'new-story',
                    excerpt: newArticle.excerpt,
                    body: [],
                    content_type: 'original',
                    featured_image_id: `img-${Date.now()}`,
                    author_id: 'auth-1',
                    sponsor_id: null,
                    scheduled_at: null,
                    seo_title: null,
                    seo_description: null,
                    canonical_url: null,
                    created_by: null,
                    updated_by: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    article_type: newArticle.article_type as any,
                    status: newArticle.status as any,
                    published_at: new Date().toISOString(),
                    featured_image: {
                      id: `img-${Date.now()}`,
                      storage_key: '/images/editorial/hero-mediterranean-resortwear.jpg',
                      original_filename: 'editorial.jpg',
                      mime_type: 'image/jpeg',
                      width: 1200,
                      height: 800,
                      file_size_bytes: 250000,
                      alt_text: newArticle.title,
                      caption: null,
                      credit: 'KAFTAN Editorial',
                      license_info: null,
                      metadata: {},
                      uploaded_by: null,
                      created_at: new Date().toISOString(),
                    },
                    author: {
                      id: 'auth-1',
                      name: 'Editorial Desk',
                      slug: 'editorial-desk',
                      bio: 'KAFTAN Publishing Team',
                      profile_image_id: null,
                      website_url: null,
                      social_links: {},
                      created_at: '',
                      updated_at: '',
                    },
                  };
                  const updated = [articleToAdd, ...articles];
                  persistArticles(updated);
                  setIsAddArticleOpen(false);
                  setNewArticle({
                    title: '',
                    slug: '',
                    excerpt: '',
                    article_type: 'fashion_editorial',
                    status: 'published',
                  });
                  showToast(`Published "${articleToAdd.title}"`);
                }}
                className="px-5 py-2 bg-[#C5A880] text-[#121110] text-xs font-semibold uppercase tracking-wider hover:bg-[#B3956F] rounded-xs transition-colors"
              >
                Publish Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT STORY
          ========================================================================= */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#141312] border border-[#2E2A26] rounded-sm max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242220]">
              <h3 className="font-serif-editorial text-2xl text-[#FAF7F2]">Edit Story</h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-[#9E978C] hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Excerpt
                </label>
                <textarea
                  rows={3}
                  value={editingArticle.excerpt || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#9E978C] uppercase tracking-wider text-[10px] font-bold mb-1">
                  Status
                </label>
                <select
                  value={editingArticle.status}
                  onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as 'published' | 'draft' })}
                  className="w-full bg-[#181715] border border-[#262422] text-[#FAF7F2] px-3 py-2 rounded-xs focus:border-[#C5A880] focus:outline-hidden"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[#242220] flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#9E978C] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = articles.map((a) => (a.id === editingArticle.id ? editingArticle : a));
                  persistArticles(updated);
                  setEditingArticle(null);
                  showToast(`Saved changes to "${editingArticle.title}"`);
                }}
                className="px-5 py-2 bg-[#C5A880] text-[#121110] text-xs font-semibold uppercase tracking-wider hover:bg-[#B3956F] rounded-xs transition-colors"
              >
                Save Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
