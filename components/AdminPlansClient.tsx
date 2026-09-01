'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, Plus, X, Image as ImageIcon, Trash2, Save, RefreshCw, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

interface PlanImageInput {
  url: string;
  caption: string;
  isFloorPlan: boolean;
}

interface Plan {
  id: string;
  title: string;
  slug: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  style: string;
  foundationType: string;
  price: number;
  pdfFileName: string;
  isPublished: boolean;
}

export default function AdminPlansClient({ plans: initialPlans }: { plans: Plan[] }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('1200');
  const [pdfFileName, setPdfFileName] = useState('');
  const [sqm, setSqm] = useState('200');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2.5');
  const [stories, setStories] = useState('2');
  const [garageSpaces, setGarageSpaces] = useState('2');
  const [widthM, setWidthM] = useState('14');
  const [depthM, setDepthM] = useState('16');
  const [style, setStyle] = useState('Modern');
  const [foundationType, setFoundationType] = useState('Slab');
  const [ceilingHeight, setCeilingHeight] = useState('2.7m First / 2.7m Second');
  const [roofPitch, setRoofPitch] = useState('35° Main');
  const [isPublished, setIsPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Dynamic Images State
  const [images, setImages] = useState<PlanImageInput[]>([
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Front Render',
      isFloorPlan: false,
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Floor Plan Schematic Preview',
      isFloorPlan: true,
    },
  ]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(autoSlug);
    if (!pdfFileName) {
      setPdfFileName(`${autoSlug || 'new-plan'}-construction-set.pdf`);
    }
  };

  const handleAddImageRow = () => {
    setImages([
      ...images,
      {
        url: '',
        caption: '',
        isFloorPlan: false,
      },
    ]);
  };

  const handleRemoveImageRow = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleImageChange = (idx: number, field: keyof PlanImageInput, val: any) => {
    const next = [...images];
    next[idx] = { ...next[idx], [field]: val };
    setImages(next);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slug,
        description,
        sqm: parseInt(sqm, 10),
        bedrooms: parseInt(bedrooms, 10),
        bathrooms: parseFloat(bathrooms),
        stories: parseInt(stories, 10),
        garageSpaces: parseInt(garageSpaces, 10),
        widthM: parseFloat(widthM),
        depthM: parseFloat(depthM),
        style,
        foundationType,
        ceilingHeight,
        roofPitch,
        price: parseFloat(price),
        isPublished,
        featured,
        pdfFileName: pdfFileName || `${slug}-construction-set.pdf`,
        images: images.filter((img) => img.url.trim() !== ''),
      };

      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Failed to create plan');
      }

      // Add to local state & close modal
      setPlans([json.data, ...plans]);
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setPrice('1200');
    setPdfFileName('');
    setSqm('200');
    setBedrooms('3');
    setBathrooms('2.5');
    setStories('2');
    setGarageSpaces('2');
    setWidthM('14');
    setDepthM('16');
    setStyle('Modern');
    setFoundationType('Slab');
    setCeilingHeight('2.7m First / 2.7m Second');
    setRoofPitch('35° Main');
    setIsPublished(true);
    setFeatured(false);
    setImages([
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Front Render',
        isFloorPlan: false,
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Floor Plan Schematic Preview',
        isFloorPlan: true,
      },
    ]);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <Link href="/admin" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono">
            <ArrowLeft className="w-3 h-3" /> {t('admin.backDashboard')}
          </Link>
          <h1 className="text-2xl font-extrabold text-white">{t('admin.catalogMgmtTitle')}</h1>
          <p className="text-slate-400 text-xs">{t('admin.catalogMgmtSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 font-bold whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {t('admin.addPlanBtn')}
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 hover:border-red-500/40 px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {t('admin.logoutBtn')}
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300">{t('admin.totalListings')}: {plans.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="p-4">{t('admin.colTitleSlug')}</th>
                <th className="p-4">{t('admin.colSpecs')}</th>
                <th className="p-4">{t('admin.colStyleFoundation')}</th>
                <th className="p-4">{t('admin.colPrice')}</th>
                <th className="p-4">{t('admin.colPdfFile')}</th>
                <th className="p-4">{t('admin.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-semibold text-white">
                    <div>{plan.title}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{plan.slug}</div>
                  </td>
                  <td className="p-4 font-mono">
                    {plan.sqm} m² | {plan.bedrooms}b/{plan.bathrooms}ba
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[11px] font-mono text-slate-200">
                      {plan.style} • {plan.foundationType}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-amber-400 font-mono">
                    ${plan.price.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {plan.pdfFileName}
                  </td>
                  <td className="p-4">
                    {plan.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> {t('admin.statusPublished')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> {t('admin.statusDraft')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PLAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-3xl w-full my-8 p-6 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto border-amber-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{t('admin.modalTitle')}</h3>
                <p className="text-slate-400 text-xs mt-0.5">{t('admin.modalSubtitle')}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg border border-slate-800 bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t('admin.fieldTitle')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Riviera Luxury Villa"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t('admin.fieldSlug')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. riviera-luxury-villa"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t('admin.fieldPrice')} *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">{t('admin.fieldPdf')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="riviera-construction-set.pdf"
                    value={pdfFileName}
                    onChange={(e) => setPdfFileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1 text-xs">{t('admin.fieldDesc')} *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Comprehensive description of the architectural plan layout, amenities, and structural features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Characteristics & Specs Grid */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Project Characteristics & Dimensions</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldSqm')}</label>
                    <input
                      type="number"
                      required
                      value={sqm}
                      onChange={(e) => setSqm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldBeds')}</label>
                    <input
                      type="number"
                      required
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldBaths')}</label>
                    <input
                      type="number"
                      required
                      step="0.5"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldStories')}</label>
                    <input
                      type="number"
                      required
                      value={stories}
                      onChange={(e) => setStories(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldGarages')}</label>
                    <input
                      type="number"
                      required
                      value={garageSpaces}
                      onChange={(e) => setGarageSpaces(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldWidth')}</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      value={widthM}
                      onChange={(e) => setWidthM(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldDepth')}</label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      value={depthM}
                      onChange={(e) => setDepthM(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldStyle')}</label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="Farmhouse">Farmhouse</option>
                      <option value="Craftsman">Craftsman</option>
                      <option value="Modern">Modern</option>
                      <option value="Contemporary">Contemporary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldFoundation')}</label>
                    <select
                      value={foundationType}
                      onChange={(e) => setFoundationType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      <option value="Slab">Monolithic Slab</option>
                      <option value="Crawlspace">Vented Crawlspace</option>
                      <option value="Basement">Full Daylight Basement</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldCeiling')}</label>
                    <input
                      type="text"
                      required
                      value={ceilingHeight}
                      onChange={(e) => setCeilingHeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{t('admin.fieldRoof')}</label>
                    <input
                      type="text"
                      required
                      value={roofPitch}
                      onChange={(e) => setRoofPitch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Pictures & Floor Plans Manager */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" /> {t('admin.picturesSection')}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddImageRow}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {t('admin.addImageBtn')}
                  </button>
                </div>

                <div className="space-y-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                      <div className="flex-1 w-full">
                        <label className="text-[10px] text-slate-400 block">{t('admin.fieldImgUrl')}</label>
                        <input
                          type="url"
                          required
                          placeholder="https://images.unsplash.com/..."
                          value={img.url}
                          onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                        />
                      </div>

                      <div className="w-full md:w-48">
                        <label className="text-[10px] text-slate-400 block">{t('admin.fieldImgCaption')}</label>
                        <input
                          type="text"
                          placeholder="Exterior Front / Floor Plan"
                          value={img.caption}
                          onChange={(e) => handleImageChange(idx, 'caption', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-3 md:pt-4">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-[11px] whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={img.isFloorPlan}
                            onChange={(e) => handleImageChange(idx, 'isFloorPlan', e.target.checked)}
                            className="rounded border-slate-700 bg-slate-950 text-amber-500"
                          />
                          {t('admin.fieldIsFloorPlan')}
                        </label>

                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageRow(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                  />
                  <span>{t('admin.fieldPublished')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500"
                  />
                  <span>{t('admin.fieldFeatured')}</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-5 py-2.5"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      {t('admin.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-slate-950" />
                      {t('admin.savePlan')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
