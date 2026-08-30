import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, Plus, Trash2, GripVertical, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SiteSettings, StatItem, SocialLink } from '../../types/settings';
import { useSettings } from '../../contexts/SettingsContext';
import MediaUploadCard from '../../components/admin/MediaUploadCard';
import { getSocialIcon } from '../../components/SocialIcons';
import { ChevronUp, ChevronDown } from 'lucide-react';


const SOCIAL_PLATFORMS = ['Instagram', 'LinkedIn', 'GitHub', 'Facebook', 'X / Twitter', 'YouTube', 'WhatsApp', 'TikTok', 'Threads', 'Pinterest', 'Telegram', 'Discord', 'Reddit', 'Snapchat', 'Behance', 'Dribbble', 'Medium', 'Website', 'Email', 'Other'];

type SocialModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'delete';
  item: SocialLink | null;
  index: number | null;
};

export default function Settings({ section }: { section: string }) {
  
  const { settings: currentSettings, refreshSettings, markDirty, markClean, hasUnsavedChanges } = useSettings();
  
  
  const activeTab = section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Brand';

  const [formData, setFormData] = useState<SiteSettings>(currentSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [socialModal, setSocialModal] = useState<SocialModalState>({ isOpen: false, mode: 'add', item: null, index: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsDeleteModal, setStatsDeleteModal] = useState<{isOpen: boolean, index: number | null}>({isOpen: false, index: null});

  // Sync formData when currentSettings load initially or when section changes after a clean discard
  useEffect(() => {
    setFormData(currentSettings);
    markClean();
  }, [currentSettings, section, markClean]);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast.error('Your session has expired. Please log in again.');
        return null;
      }

      const session = sessionData.session;
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);

      if (expiresAt && expiresAt < now + 120) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          toast.error('Your session has expired. Please log in again.');
          return null;
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `settings-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('portfolio-assets').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        return null;
      }
      
      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      toast.error(`Upload exception: ${err.message}`);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: keyof SiteSettings, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(prev => ({ ...prev, [field]: true }));
    const url = await uploadFile(file);
    setIsUploading(prev => ({ ...prev, [field]: false }));
    
    if (url) {
      handleChange(section, field, url);
    }
  };

  
  const openAddSocial = () => {
    setSocialModal({
      isOpen: true,
      mode: 'add',
      item: { id: Date.now().toString(), platform: '', url: '', iconName: '', order: formData.social_settings.length + 1, active: true },
      index: null
    });
  };

  const openEditSocial = (item: SocialLink, index: number) => {
    setSocialModal({ isOpen: true, mode: 'edit', item: { ...item }, index });
  };

  const openDeleteSocial = (item: SocialLink, index: number) => {
    setSocialModal({ isOpen: true, mode: 'delete', item, index });
  };

  const saveSocialLink = () => {
    if (!socialModal.item) return;
    if (!socialModal.item.iconName) {
      toast.error('Platform is required');
      return;
    }
    if (!socialModal.item.url) {
      toast.error('URL is required');
      return;
    }
    if (!socialModal.item.url.startsWith('http') && !socialModal.item.url.startsWith('mailto:')) {
      toast.error('Please enter a valid URL');
      return;
    }
    if (socialModal.item.iconName === 'Other' && !socialModal.item.platform) {
      toast.error('Display Name is required for Other');
      return;
    }

    const arr = [...formData.social_settings];
    if (socialModal.mode === 'add') {
      arr.push(socialModal.item);
    } else if (socialModal.mode === 'edit' && socialModal.index !== null) {
      arr[socialModal.index] = socialModal.item;
    }
    
    setFormData(prev => ({ ...prev, social_settings: arr }));
    markDirty();
    setSocialModal({ isOpen: false, mode: 'add', item: null, index: null });
  };

  const confirmDeleteSocial = () => {
    if (socialModal.index === null) return;
    setIsDeleting(true);
    setTimeout(() => {
      const arr = formData.social_settings.filter((_, i) => i !== socialModal.index);
      setFormData(prev => ({ ...prev, social_settings: arr }));
      markDirty();
      setIsDeleting(false);
      setSocialModal({ isOpen: false, mode: 'add', item: null, index: null });
      toast.success('Social link removed');
    }, 400);
  };

  const moveSocial = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const arr = [...prev.social_settings];
      if (direction === 'up' && index > 0) {
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      } else if (direction === 'down' && index < arr.length - 1) {
        [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      }
      arr.forEach((item, i) => { item.order = i + 1; });
      return { ...prev, social_settings: arr };
    });
    markDirty();
  };

  

  const handleChange = (section: keyof SiteSettings, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
    markDirty();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...formData, updated_at: new Date().toISOString() });

      if (error) throw error;
      
      toast.success('Settings saved successfully');
      markClean();
      await refreshSettings();
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (section: keyof SiteSettings, field: string, label: string, type = 'text', placeholder = '', multiline = false) => {
    const val = (formData[section] as any)[field] || '';
    if (multiline) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">{label}</label>
          <textarea
            value={val}
            onChange={(e) => handleChange(section, field, e.target.value)}
            className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none min-h-[100px]"
            placeholder={placeholder}
          />
        </div>
      );
    }
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input
          type={type}
          value={val}
          onChange={(e) => handleChange(section, field, e.target.value)}
          className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    );
  };

  const renderArrayInput = (section: keyof SiteSettings, index: number, fieldKey: string, placeholder = '') => {
    const items = formData[section] as any[];
    return (
      <input
        type="text"
        value={items[index][fieldKey]}
        onChange={(e) => {
            setFormData(prev => {
              const newItems = [...(prev[section] as any)];
              newItems[index] = { ...newItems[index], [fieldKey]: e.target.value };
              return { ...prev, [section]: newItems };
            });
            markDirty();
          }}
        className="w-full bg-[#101010] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#ceab7a] focus:outline-none"
        placeholder={placeholder}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          {activeTab === 'Brand' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Brand Settings</h1>
              <p className="text-gray-400 text-sm">Manage your brand identity.</p>
            </>
          )}
          {activeTab === 'Hero' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Hero Settings</h1>
              <p className="text-gray-400 text-sm">Manage your homepage hero content.</p>
            </>
          )}
          {activeTab === 'About' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">About Settings</h1>
              <p className="text-gray-400 text-sm">Manage your About section content.</p>
            </>
          )}
          {activeTab === 'Stats' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Stats Settings</h1>
              <p className="text-gray-400 text-sm">Manage homepage statistics.</p>
            </>
          )}
          {activeTab === 'Contact' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Contact Settings</h1>
              <p className="text-gray-400 text-sm">Manage your contact information.</p>
            </>
          )}
          {activeTab === 'Social' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Social Settings</h1>
              <p className="text-gray-400 text-sm">Manage social links shown on your website.</p>
            </>
          )}
          {activeTab === 'Footer' && (
            <>
              <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Footer Settings</h1>
              <p className="text-gray-400 text-sm">Manage footer content.</p>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {hasUnsavedChanges && (
            <span className="flex items-center gap-2 text-[#ceab7a] text-sm">
              <AlertTriangle size={16} />
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-6 py-3 bg-[#ceab7a] hover:bg-[#b89565] text-black font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            Save Settings
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'Brand' && (
              <motion.div key="Brand" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">Brand Information</h2>
                  {renderInput('brand_settings', 'brandName', 'Brand Name')}
                  {renderInput('brand_settings', 'tagline', 'Tagline')}
                  
                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-gray-400">Brand Logo</label>
                    <MediaUploadCard
                      label="Logo Image"
                      image={formData.brand_settings.logoUrl}
                      onFileSelect={(e) => handleImageUpload(e, 'brand_settings', 'logoUrl')}
                      onRemove={() => handleChange('brand_settings', 'logoUrl', '')}
                      aspectClass="aspect-square w-32"
                      objectFit="object-contain"
                      isLoading={isUploading['logoUrl']}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Hero' && (
              <motion.div key="Hero" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">Hero Section Content</h2>
                  {renderInput('hero_settings', 'eyebrow', 'Eyebrow Text (e.g. Available for New Projects)')}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('hero_settings', 'headlineStatic', 'Headline Static Part (e.g. We Build)')}
                    {renderInput('hero_settings', 'headlineHighlight', 'Headline Highlight (e.g. AI-Powered Creative Systems.)')}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Typewriter Words (Comma separated)</label>
                    <textarea
                      value={formData.hero_settings.typewriterWords.join(', ')}
                      onChange={(e) => {
                        const words = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleChange('hero_settings', 'typewriterWords', words);
                      }}
                      className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none min-h-[80px]"
                      placeholder="Word 1, Word 2, Word 3..."
                    />
                    <p className="text-[11px] text-gray-500">Use \n for new lines (e.g. Premium\nDigital Experiences.)</p>
                  </div>

                  {renderInput('hero_settings', 'description', 'Main Description', 'text', '', true)}
                  
                  <h3 className="text-sm font-medium text-[#ceab7a] pt-4 border-t border-white/5">Call To Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('hero_settings', 'primaryCtaText', 'Primary CTA Label')}
                    {renderInput('hero_settings', 'primaryCtaUrl', 'Primary CTA Link (e.g. #contact)')}
                    {renderInput('hero_settings', 'secondaryCtaText', 'Secondary CTA Label')}
                    {renderInput('hero_settings', 'secondaryCtaUrl', 'Secondary CTA Link (e.g. #process)')}
                  </div>

                  <h3 className="text-sm font-medium text-[#ceab7a] pt-4 border-t border-white/5">Trust Banner & Microcopy</h3>
                  {renderInput('hero_settings', 'trustMicrocopy', 'Microcopy (e.g. Usually replies within 1 hour)')}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderInput('hero_settings', 'bannerPrefix', 'Banner Prefix')}
                    {renderInput('hero_settings', 'bannerHighlight', 'Banner Highlight')}
                    {renderInput('hero_settings', 'bannerSuffix', 'Banner Suffix')}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'About' && (
              <motion.div key="About" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">About Section Content</h2>
                  {renderInput('about_settings', 'eyebrow', 'Eyebrow Text')}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('about_settings', 'headingStatic', 'Heading Static (e.g. We Don\'t Just\\nBuild Websites.)')}
                    {renderInput('about_settings', 'headingHighlight', 'Heading Highlight (e.g. We Build Digital\\nPresence.)')}
                  </div>
                  {renderInput('about_settings', 'description1', 'Description Paragraph 1', 'text', '', true)}
                  {renderInput('about_settings', 'description2', 'Description Paragraph 2', 'text', '', true)}
                  {renderInput('about_settings', 'quoteText', 'Bottom Quote Text', 'text', '', true)}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('about_settings', 'starTextPrefix', 'Star Text Prefix (e.g. We don\'t follow trends...)')}
                    {renderInput('about_settings', 'starTextHighlight', 'Star Text Highlight')}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Stats' && (
              <motion.div key="Stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <h2 className="text-xl font-serif text-white">Centralized Statistics</h2>
                    <button
                      onClick={() => {
                        setFormData(prev => {
                          const newStat: StatItem = { id: Date.now().toString(), value: '', label: '', iconName: 'Star', order: prev.stats_settings.length + 1, active: true };
                          return { ...prev, stats_settings: [...prev.stats_settings, newStat] };
                        });
                        markDirty();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus size={16} /> Add Stat
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.stats_settings.map((stat, idx) => (
                      <div key={stat.id} className={`p-4 border rounded-xl flex items-start gap-4 transition-colors ${stat.active ? 'border-white/10 bg-[#111]' : 'border-red-500/20 bg-red-500/5 opacity-70'}`}>
                        <div className="pt-2 cursor-grab"><GripVertical size={16} className="text-gray-600" /></div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[11px] text-gray-500 uppercase mb-1 block">Value</label>
                            {renderArrayInput('stats_settings', idx, 'value', 'e.g. 15+')}
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-500 uppercase mb-1 block">Label (Use \n for break)</label>
                            {renderArrayInput('stats_settings', idx, 'label', 'Projects\\nCompleted')}
                          </div>
                          <div>
                            <label className="text-[11px] text-gray-500 uppercase mb-1 block">Icon Name</label>
                            {renderArrayInput('stats_settings', idx, 'iconName', 'BriefcaseBusiness')}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <button
                            onClick={() => {
                              setFormData(prev => {
                                const arr = [...prev.stats_settings];
                                arr[idx].active = !arr[idx].active;
                                return { ...prev, stats_settings: arr };
                              });
                              markDirty();
                            }}
                            className={`p-2 rounded-lg transition-colors ${stat.active ? 'text-green-500 bg-green-500/10' : 'text-gray-500 bg-white/5'}`}
                            title={stat.active ? 'Visible' : 'Hidden'}
                          >
                            {stat.active ? <Check size={16} /> : <X size={16} />}
                          </button>
                          <button
                            onClick={() => {
                              setStatsDeleteModal({ isOpen: true, index: idx });
                            }}
                            className="p-2 rounded-lg text-red-400 bg-red-400/10 hover:bg-red-400/20 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {formData.stats_settings.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">No statistics added yet.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Contact' && (
              <motion.div key="Contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">Centralized Contact Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('contact_settings', 'email', 'Email Address', 'email')}
                    {renderInput('contact_settings', 'phone', 'Phone Number (Display)')}
                    {renderInput('contact_settings', 'whatsapp', 'WhatsApp Number (Numbers only, e.g. 917718938615)')}
                    {renderInput('contact_settings', 'responseTime', 'Response Time (e.g. within 1 hour)')}
                  </div>
                  {renderInput('contact_settings', 'address', 'Address / Location')}
                  {renderInput('contact_settings', 'mapUrl', 'Google Maps URL (Optional)')}
                  {renderInput('contact_settings', 'workingHours', 'Working Hours')}
                </div>
              </motion.div>
            )}

            {activeTab === 'Social' && (
              <motion.div key="Social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-serif text-white">Social Links</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage the links shown on your public website.</p>
                    </div>
                    <button
                      onClick={openAddSocial}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                      <Plus size={16} /> Add Social
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.social_settings.map((link, idx) => {
                      const Icon = getSocialIcon(link.iconName);
                      return (
                        <div key={link.id} className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${link.active ? 'border-white/10 bg-[#151515]' : 'border-red-500/20 bg-red-500/5 opacity-70'}`}>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#ceab7a]">
                              <Icon size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{link.platform || link.iconName}</div>
                              <div className="text-[11px] text-gray-500 font-mono mt-1 max-w-[200px] sm:max-w-[300px] truncate">{link.url}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-1 border-r border-white/10 pr-3 mr-1">
                              <button onClick={() => moveSocial(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"><ChevronUp size={16}/></button>
                              <button onClick={() => moveSocial(idx, 'down')} disabled={idx === formData.social_settings.length - 1} className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"><ChevronDown size={16}/></button>
                            </div>
                            
                            <span className={`hidden sm:block text-[11px] uppercase tracking-widest px-2 py-1 rounded ${link.active ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'}`}>
                              {link.active ? 'Active' : 'Hidden'}
                            </span>
                            
                            <button onClick={() => {
                                setFormData(prev => {
                                  const arr = [...prev.social_settings];
                                  arr[idx].active = !arr[idx].active;
                                  return { ...prev, social_settings: arr };
                                });
                                markDirty();
                              }}
                              className="text-[13px] text-gray-400 hover:text-white px-2 py-1 transition-colors"
                            >
                              {link.active ? 'Hide' : 'Show'}
                            </button>
                            
                            <button onClick={() => openEditSocial(link, idx)} className="text-[13px] text-[#ceab7a] hover:text-white px-2 py-1 transition-colors">
                              Edit
                            </button>
                            
                            <button onClick={() => openDeleteSocial(link, idx)} className="text-[13px] text-red-500 hover:text-red-400 px-2 py-1 transition-colors">
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {formData.social_settings.length === 0 && (
                      <div className="text-center py-10 border border-white/5 rounded-xl border-dashed">
                        <p className="text-gray-500 text-sm">No social links added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Footer' && (
              <motion.div key="Footer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl space-y-6">
                  <h2 className="text-xl font-serif text-white mb-6 border-b border-white/5 pb-4">Footer Settings</h2>
                  
                  {renderInput('footer_settings', 'description', 'Footer Description', 'text', '', true)}

                  <h3 className="text-sm font-medium text-[#ceab7a] pt-4 border-t border-white/5">CTA Box</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('footer_settings', 'ctaHeading', 'CTA Heading')}
                    {renderInput('footer_settings', 'ctaHighlight', 'CTA Highlighted Word')}
                  </div>
                  {renderInput('footer_settings', 'ctaDescription', 'CTA Description', 'text', '', true)}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('footer_settings', 'ctaButtonText', 'CTA Button Text')}
                    {renderInput('footer_settings', 'ctaButtonUrl', 'CTA Button URL')}
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-gray-400">CTA Background Image (Optional)</label>
                    <MediaUploadCard
                      label="CTA Image"
                      image={formData.footer_settings.ctaImageUrl}
                      onFileSelect={(e) => handleImageUpload(e, 'footer_settings', 'ctaImageUrl')}
                      onRemove={() => handleChange('footer_settings', 'ctaImageUrl', '')}
                      aspectClass="aspect-video"
                      objectFit="object-cover"
                      isLoading={isUploading['ctaImageUrl']}
                    />
                  </div>

                  <h3 className="text-sm font-medium text-[#ceab7a] pt-4 border-t border-white/5">Copyright & Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInput('footer_settings', 'copyrightText', 'Copyright Text')}
                    {renderInput('footer_settings', 'agencyRoleText', 'Agency Role (e.g. AI POWERED CREATIVE AGENCY)')}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

      
        {/* STATS DELETE MODAL */}
        <AnimatePresence>
          {statsDeleteModal.isOpen && statsDeleteModal.index !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setStatsDeleteModal({isOpen: false, index: null})} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
                    <AlertTriangle size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif text-white">Delete Statistic?</h3>
                  <p className="text-sm text-gray-400">
                    Are you sure you want to remove this statistic?
                  </p>
                </div>
                
                <div className="p-6 border-t border-white/5 bg-[#050505] flex gap-3">
                  <button onClick={() => setStatsDeleteModal({isOpen: false, index: null})} disabled={isDeleting} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors border border-white/10 disabled:opacity-50">
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setIsDeleting(true);
                      setTimeout(() => {
                        setFormData(prev => {
                          const arr = prev.stats_settings.filter((_, i) => i !== statsDeleteModal.index);
                          return { ...prev, stats_settings: arr };
                        });
                        markDirty();
                        setIsDeleting(false);
                        setStatsDeleteModal({isOpen: false, index: null});
                      }, 400);
                    }} 
                    disabled={isDeleting} 
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex justify-center items-center"
                  >
                    {isDeleting ? <span className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></span> : 'Delete Statistic'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* SOCIAL ADD/EDIT MODAL */}
      <AnimatePresence>
        {socialModal.isOpen && (socialModal.mode === 'add' || socialModal.mode === 'edit') && socialModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSocialModal(prev => ({...prev, isOpen: false}))} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-serif text-white">{socialModal.mode === 'add' ? 'Add Social Link' : 'Edit Social Link'}</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest block">Platform *</label>
                  <select
                    value={socialModal.item.iconName}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSocialModal(prev => {
                        if(!prev.item) return prev;
                        const newName = (!prev.item.platform || prev.item.platform === prev.item.iconName) && selected !== 'Other' ? selected : prev.item.platform;
                        return { ...prev, item: { ...prev.item, iconName: selected, platform: newName } };
                      });
                    }}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none appearance-none">
                    <option value="" disabled>Select platform</option>
                    {SOCIAL_PLATFORMS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest block">Display Name</label>
                  <input
                    type="text"
                    value={socialModal.item.platform}
                    onChange={(e) => setSocialModal(prev => prev.item ? { ...prev, item: { ...prev.item, platform: e.target.value } } : prev)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none"
                    placeholder="e.g. Follow us on X"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] text-gray-500 uppercase tracking-widest block">URL *</label>
                  <input
                    type="text"
                    value={socialModal.item.url}
                    onChange={(e) => setSocialModal(prev => prev.item ? { ...prev, item: { ...prev.item, url: e.target.value } } : prev)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ceab7a] focus:outline-none font-mono text-sm"
                    placeholder="https://"
                  />
                </div>

              </div>
              
              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-3">
                <button onClick={() => setSocialModal(prev => ({...prev, isOpen: false}))} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={saveSocialLink} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#ceab7a] text-black hover:bg-[#b08d5c] transition-colors">
                  {socialModal.mode === 'add' ? 'Add Social' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {socialModal.isOpen && socialModal.mode === 'delete' && socialModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isDeleting && setSocialModal(prev => ({...prev, isOpen: false}))} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#0a0a0a] border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif text-white">Delete Social Link?</h3>
                <p className="text-sm text-gray-400">
                  Are you sure you want to remove <strong className="text-white">"{socialModal.item.platform || socialModal.item.iconName}"</strong> from your website?
                </p>
              </div>
              
              <div className="p-6 border-t border-white/5 bg-[#050505] flex gap-3">
                <button disabled={isDeleting} onClick={() => setSocialModal(prev => ({...prev, isOpen: false}))} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button disabled={isDeleting} onClick={confirmDeleteSocial} className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex justify-center">
                  {isDeleting ? 'Deleting...' : 'Delete Social Link'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
