import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  School, User, Mail, Phone, MapPin, ShieldCheck, Check, 
  Trash2, Plus, Info, AlertCircle, Copy, CheckCircle2, 
  ArrowLeft, CreditCard, UploadCloud, FileText, Sparkles
} from 'lucide-react';
import { Category, CATEGORIES, Participant, Registration } from '../types';

interface RegistrationFormProps {
  initialCategoryId?: string;
  onCancel: () => void;
  onSubmitSuccess: (newRegistration: Registration) => void;
}

export default function RegistrationForm({ initialCategoryId, onCancel, onSubmitSuccess }: RegistrationFormProps) {
  // Navigation Stepper
  // Step 1: Instansi & Kategori
  // Step 2: Daftar Anggota Tim / Peserta
  // Step 3: Pembayaran & Konfirmasi
  const [step, setStep] = useState(1);
  const [selectedCatId, setSelectedCatId] = useState(initialCategoryId || CATEGORIES[0].id);
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  
  // Participants management
  const [participants, setParticipants] = useState<Participant[]>([]);
  // Input fields for adding participant
  const [newPartName, setNewPartName] = useState('');
  const [newPartId, setNewPartId] = useState('');
  const [newPartClass, setNewPartClass] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('BCA');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofName, setPaymentProofName] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Validation messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successSubmission, setSuccessSubmission] = useState<Registration | null>(null);

  // Dynamic unique transaction fee
  const [uniqueCode] = useState(() => Math.floor(Math.random() * 899) + 100);

  // Resolve category details
  const category = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[0];

  useEffect(() => {
    // Sync initial state if category changes
    if (category.isTeam) {
      // Clear or seed
      if (participants.length === 0) {
        setParticipants([]);
      }
    } else {
      // For individuals, we only need exactly 1 participant
      if (participants.length !== 1) {
        setParticipants([{ name: contactName || '', identityNumber: '', class: '' }]);
      }
    }
  }, [selectedCatId]);

  // Handle contact name syncing with first participant for individual categories
  useEffect(() => {
    if (!category.isTeam && participants.length === 1) {
      const updated = [...participants];
      updated[0].name = contactName;
      setParticipants(updated);
    }
  }, [contactName]);

  const handleAddParticipant = () => {
    if (!newPartName.trim()) {
      setErrorMsg('Nama peserta wajib diisi.');
      return;
    }
    if (!newPartId.trim()) {
      setErrorMsg('NISN / Nomor Induk Siswa wajib diisi.');
      return;
    }
    if (!newPartClass.trim()) {
      setErrorMsg('Kelas wajib diisi.');
      return;
    }

    // Check duplicate identity number
    if (participants.some(p => p.identityNumber === newPartId)) {
      setErrorMsg('NISN peserta sudah terdaftar di daftar anggota ini.');
      return;
    }

    if (participants.length >= category.maxTeamSize) {
      setErrorMsg(`Maksimal anggota untuk kategori ${category.name} adalah ${category.maxTeamSize} orang.`);
      return;
    }

    setParticipants([...participants, {
      name: newPartName.trim(),
      identityNumber: newPartId.trim(),
      class: newPartClass.trim()
    }]);

    // Reset input fields
    setNewPartName('');
    setNewPartId('');
    setNewPartClass('');
    setErrorMsg('');
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!schoolName.trim()) return 'Nama sekolah asal wajib diisi.';
    if (!schoolAddress.trim()) return 'Alamat sekolah asal wajib diisi.';
    if (!contactName.trim()) return 'Nama penghubung (Contact Person) wajib diisi.';
    if (!contactEmail.trim() || !contactEmail.includes('@')) return 'Email tidak valid.';
    if (!contactPhone.trim() || contactPhone.length < 8) return 'Nomor handphone tidak valid.';
    if (category.isTeam && !teamName.trim()) return 'Nama Tim / Club delegasi wajib diisi.';
    return '';
  };

  const validateStep2 = () => {
    if (category.isTeam) {
      if (participants.length < category.minTeamSize) {
        return `Kategori ini membutuhkan minimal ${category.minTeamSize} peserta terdaftar. Baru ada ${participants.length} peserta. Mohon tambahkan lagi.`;
      }
    } else {
      // Individual validation
      const single = participants[0];
      if (!single || !single.name.trim() || !single.identityNumber.trim() || !single.class.trim()) {
        return 'Data lengkap peserta (Nama, NISN, dan Kelas) wajib dilengkapi.';
      }
    }
    return '';
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMsg(err);
        return;
      }
      setStep(3);
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
  };

  // Mock upload interaction
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setPaymentProof(selectedFile);
      setPaymentProofName(selectedFile.name);
      setPaymentProofUrl('bukti_bayar_uploaded.jpg');
    }
  };

  const triggerMockUpload = () => {
    const mockNames = ['bukti_transfer_bca_rise.png', 'resi_gopay_edusport.png', 'transfer_mandiri_recs.jpg', 'bukti_bayar_sukses.png'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    setPaymentProofName(randomName);
    setPaymentProofUrl('bukti_bayar_uploaded.jpg');
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!paymentProofName) {
      setErrorMsg('Mohon unggah bukti transfer/pembayaran Anda terlebih dahulu.');
      return;
    }

    const regAmount = category.fee + uniqueCode;
    const registrationId = `REG-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

    const newRegistration: Registration = {
      id: registrationId,
      schoolName,
      schoolAddress,
      contactName,
      contactEmail,
      contactPhone,
      categoryId: selectedCatId,
      teamName: category.isTeam ? teamName : undefined,
      participants,
      paymentMethod,
      paymentProofName,
      paymentProofUrl,
      registeredAt: new Date().toISOString(),
      status: 'Menunggu Verifikasi', // Starts with pending status
      paymentAmount: regAmount,
      notes: notes.trim() || undefined
    };

    setSuccessSubmission(newRegistration);
    onSubmitSuccess(newRegistration);
  };

  const formattedBaseFee = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(category.fee);

  const totalFee = category.fee + uniqueCode;
  const formattedTotalFee = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(totalFee);

  // Bank Info mapping
  const bankDetails: Record<string, { accountName: string; accountNo: string; bankName: string }> = {
    'BCA': { bankName: 'Bank Central Asia (BCA)', accountNo: '8371 0029 883', accountName: 'YAYASAN HEALTHRISE EDUSPORT' },
    'MANDIRI': { bankName: 'Bank Mandiri', accountNo: '124 000 8921 731', accountName: 'PANITIA RISE EDUSPORT' },
    'GOPAY': { bankName: 'QRIS Gopay / E-Wallet', accountNo: 'NMID.51029318', accountName: 'HEALTHRISE NUSANTARA' }
  };

  const activeBank = bankDetails[paymentMethod] || bankDetails['BCA'];

  return (
    <div className="bg-white rounded-2xl border border-navy-100 shadow-md overflow-hidden max-w-3xl mx-auto" id="registration-wizard-card">
      {/* Colored Top Header */}
      <div className="bg-navy-900 px-6 py-6 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-24 w-24" />
        </div>
        {!successSubmission && (
          <>
            <h2 className="text-xl font-bold tracking-tight">Formulir Pendaftaran Resmi</h2>
            <p className="text-xs text-brand-200 mt-1">Satu Langkah Lagi Menuju Arena Juara! Lengkapi data dengan saksama.</p>
            
            {/* Steps Progress Bar */}
            <div className="flex items-center gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-1">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-all ${
                    step === s 
                      ? 'bg-brand-500 text-white font-extrabold ring-4 ring-brand-100/30' 
                      : step > s 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-navy-800 text-navy-400'
                  }`}>
                    {step > s ? <Check className="h-4 w-4" /> : s}
                  </div>
                  <div className="hidden sm:block text-xs font-medium text-navy-200">
                    {s === 1 ? 'Instansi & Lomba' : s === 2 ? 'Pengisian Tim' : 'Pembayaran'}
                  </div>
                  {s < 3 && <div className="flex-1 h-0.5 bg-navy-800 mx-2" />}
                </div>
              ))}
            </div>
          </>
        )}

        {successSubmission && (
          <div className="text-center py-4">
            <div className="inline-flex p-3 bg-brand-500/20 text-brand-200 rounded-full mb-3">
              <CheckCircle2 className="h-8 w-8 text-brand-500 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-white">Pendaftaran Berhasil Dikirim!</h2>
            <p className="text-xs text-brand-200 mt-1 block">Kode Registrasi Anda: <strong className="font-mono text-sm bg-navy-800 px-2 py-0.5 rounded text-white">{successSubmission.id}</strong></p>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="p-6 md:p-8">
        
        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl text-red-800 text-xs flex items-start gap-2.5" id="form-error-alert">
            <AlertCircle className="h-4 w-4 flex-none mt-0.5" />
            <div>
              <span className="font-semibold">Mohon Maaf, Ada Kesalahan:</span>
              <p className="mt-0.5 leading-snug">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Stepper Forms */}
        <AnimatePresence mode="wait">
          {!successSubmission ? (
            <div id={`registration-step-${step}`}>
              
              {/* STEP 1: Categories & School Identity */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Select Category Dropdown */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Cabang Lomba Alternatif / Pilihan Utama</label>
                      <div className="relative">
                        <select
                          value={selectedCatId}
                          onChange={(e) => setSelectedCatId(e.target.value)}
                          className="w-full bg-navy-50 text-navy-950 text-sm rounded-xl py-3 px-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 focus:ring-3 focus:ring-brand-100 font-medium transition duration-150"
                          id="input-category-select"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.type === 'olahraga' ? 'Olahraga' : 'Kreativitas'}) — Rp {cat.fee.toLocaleString('id-ID')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2.5 p-3.5 bg-brand-50/50 rounded-xl border border-brand-100 flex gap-2">
                        <Info className="h-4 w-4 text-brand-600 flex-none mt-0.5" />
                        <div className="text-xs text-brand-900 leading-relaxed">
                          <span className="font-semibold">{category.name}: </span>
                          {category.description} 
                          <span className="block mt-1 font-bold text-navy-950">Biaya dasar: Rp {category.fee.toLocaleString('id-ID')} ({category.isTeam ? 'Beregu' : 'Individu'})</span>
                        </div>
                      </div>
                    </div>

                    {/* School Identity */}
                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Nama Sekolah Asal</label>
                      <div className="relative">
                        <School className="absolute left-3.5 top-3.5 h-4 w-4 text-navy-400" />
                        <input
                          type="text"
                          required
                          placeholder="Contoh: SMA Negeri 8 Jakarta"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-medium text-navy-900 transition"
                          id="input-school-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2 font-semibold">Alamat Lengkap Sekolah</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-navy-400" />
                        <input
                          type="text"
                          placeholder="Jalan, RT/RW, Kecamatan, Kota, Provinsi"
                          value={schoolAddress}
                          onChange={(e) => setSchoolAddress(e.target.value)}
                          className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-medium text-navy-900 transition"
                          id="input-school-address"
                        />
                      </div>
                    </div>

                    {/* Team Name - Conditional */}
                    {category.isTeam && (
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Nama Tim / Delegasi Unik</label>
                        <div className="relative">
                          <Sparkles className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-500" />
                          <input
                            type="text"
                            placeholder="Contoh: Delapan Warrior, SMAN 8 Team A"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-black text-brand-900 transition"
                            id="input-team-name"
                          />
                        </div>
                        <p className="text-[10px] text-navy-400 mt-1">Nama ini akan dipasang di papan jadwal pertandingan dan sertifikat tim.</p>
                      </div>
                    )}

                    {/* Contact Person */}
                    <div className="col-span-1 md:col-span-2 border-t border-navy-50 pt-5">
                      <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3">Informasi Hubungan Perwakilan (Contact Person)</h4>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Nama Lengkap Siswa Hubungan</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-navy-400" />
                        <input
                          type="text"
                          placeholder="Nama penanggung jawab pendaftaran/ketua"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-medium text-navy-900 transition"
                          id="input-contact-name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Alamat Email Aktif</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-navy-400" />
                        <input
                          type="email"
                          placeholder="nama@emailsekolah.id atau gmail"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-medium text-navy-900 transition"
                          id="input-contact-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">No. HP / WhatsApp (Aktif)</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-navy-400" />
                        <input
                          type="tel"
                          placeholder="Contoh: 08123456789"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-white text-sm rounded-xl py-3 pl-10 pr-4 border border-navy-100 focus:outline-hidden focus:border-brand-500 font-medium text-navy-900 transition"
                          id="input-contact-phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-navy-50">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
                      id="btn-next-step-1"
                    >
                      Lanjut Isi Anggota
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Team Roster Filling */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-navy-50 rounded-xl border border-navy-100">
                    <h4 className="text-xs font-bold text-navy-900 uppercase">Status Kelengkapan Tim / Anggota:</h4>
                    <p className="text-xs text-navy-400 mt-0.5 leading-relaxed">
                      Cabang lomba <strong className="text-navy-950 font-bold">{category.name}</strong> mewajibkan: 
                      <strong className="text-brand-700 font-bold ml-1">{category.isTeam ? `minimal ${category.minTeamSize} anggota dan maksimal ${category.maxTeamSize} anggota.` : '1 orang peserta tunggal.'}</strong>
                    </p>
                    <div className="h-2 bg-navy-200 rounded-full overflow-hidden mt-3 max-w-sm">
                      <div 
                        className="h-full bg-brand-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (participants.length / (category.maxTeamSize || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-navy-500 block mt-1.5 font-semibold">
                      Jumlah Terdaftar saat ini: {participants.length} Orang
                    </span>
                  </div>

                  {/* If it is an Individual Category, let them edit the details of the single participant */}
                  {!category.isTeam ? (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Identitas Kartu Pelajar Peserta Tunggal</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1">Nama Lengkap Siswa</label>
                          <input
                            type="text"
                            value={participants[0]?.name || ''}
                            onChange={(e) => {
                              const updated = [...participants];
                              if (!updated[0]) updated[0] = { name: '', identityNumber: '', class: '' };
                              updated[0].name = e.target.value;
                              setParticipants(updated);
                            }}
                            className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-navy-100 text-navy-900 transition"
                            placeholder="Nama Siswa"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-navy-600 mb-1">NISN / Nomor Induk Siswa Nasional</label>
                          <input
                            type="text"
                            value={participants[0]?.identityNumber || ''}
                            onChange={(e) => {
                              const updated = [...participants];
                              if (!updated[0]) updated[0] = { name: '', identityNumber: '', class: '' };
                              updated[0].identityNumber = e.target.value;
                              setParticipants(updated);
                            }}
                            className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-navy-100 text-navy-900 transition font-mono"
                            placeholder="Contoh: 007293183"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-navy-600 mb-1">Kelas Aktif</label>
                          <input
                            type="text"
                            value={participants[0]?.class || ''}
                            onChange={(e) => {
                              const updated = [...participants];
                              if (!updated[0]) updated[0] = { name: '', identityNumber: '', class: '' };
                              updated[0].class = e.target.value;
                              setParticipants(updated);
                            }}
                            className="w-full bg-white text-sm rounded-xl py-2.5 px-3 border border-navy-100 text-navy-900 transition"
                            placeholder="Contoh: X MIPA 3, XI IPS 1"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* IF IT IS A TEAM CATEGORY, RENDER PARTICIPANT ADD UNIT AND ROSTER CARD LIST */
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-xl border border-dashed border-navy-100 space-y-4">
                        <span className="font-extrabold text-xs text-navy-950 uppercase flex items-center gap-1">
                          <Plus className="h-4 w-4 text-brand-600" /> Tambah Formulir Pemain Baru
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Nama Lengkap Siswa"
                              value={newPartName}
                              onChange={(e) => setNewPartName(e.target.value)}
                              className="w-full bg-navy-50/50 text-xs rounded-lg py-2.5 px-3 border border-navy-100 font-medium text-navy-900"
                              id="add-part-name"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="NISN / Kartu Pelajar"
                              value={newPartId}
                              onChange={(e) => setNewPartId(e.target.value)}
                              className="w-full bg-navy-50/50 text-xs rounded-lg py-2.5 px-3 border border-navy-100 font-mono font-medium text-navy-900"
                              id="add-part-nisn"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Kelas (e.g. XI-MIPA)"
                              value={newPartClass}
                              onChange={(e) => setNewPartClass(e.target.value)}
                              className="w-full bg-navy-50/50 text-xs rounded-lg py-2.5 px-3 border border-navy-100 font-medium text-navy-900"
                              id="add-part-class"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddParticipant();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddParticipant}
                              className="px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg flex items-center justify-center transition cursor-pointer flex-none"
                              title="Tambah Pemain"
                              id="btn-add-member"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Display current roster table */}
                      <div>
                        <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wider mb-2.5">Roster Tim Terdaftar ({participants.length} Orang):</h4>
                        {participants.length === 0 ? (
                          <div className="text-center py-8 bg-navy-50/30 rounded-xl border border-dashed border-navy-100 text-navy-400 text-xs text-center">
                            Belum ada nama pemain yang dimasukkan. Gunakan formulir di atas untuk mengisi anggota satu per satu.
                          </div>
                        ) : (
                          <div className="border border-navy-100 rounded-xl overflow-hidden shadow-xs bg-white">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-navy-50 border-b border-navy-100 text-[10px] font-bold text-navy-500 uppercase tracking-wider">
                                  <th className="p-3">No</th>
                                  <th className="p-3">Nama Lengkap</th>
                                  <th className="p-3">NISN / ID</th>
                                  <th className="p-3">Kelas</th>
                                  <th className="p-3 text-center">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-navy-50 text-xs text-navy-800">
                                {participants.map((player, idx) => (
                                  <tr key={idx} className="hover:bg-navy-50/30">
                                    <td className="p-3 font-mono font-medium text-navy-400">{idx + 1}</td>
                                    <td className="p-3 font-bold text-navy-950">{player.name}</td>
                                    <td className="p-3 font-mono text-navy-400">{player.identityNumber}</td>
                                    <td className="p-3 font-normal">{player.class}</td>
                                    <td className="p-3 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveParticipant(idx)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                                        title="Hapus Pemain"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6 border-t border-navy-50">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="py-3 px-5 border border-navy-100 text-navy-600 hover:bg-navy-50 font-bold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      id="btn-prev-step-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl transition shadow-xs hover:shadow-md cursor-pointer"
                      id="btn-next-step-2"
                    >
                      Lanjut Pembayaran
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment Hub & Final Submit */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Invoice detail card */}
                    <div className="p-5 bg-navy-50/70 border border-navy-100 rounded-2xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-navy-400 uppercase tracking-widest">Detail Rincian Biaya Lomba</h4>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-navy-400">Pilihan Lomba:</span>
                            <span className="font-bold text-navy-800">{category.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-navy-400">Representasi Sekolah:</span>
                            <span className="font-semibold text-navy-800">{schoolName}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-navy-400">Total Anggota:</span>
                            <span className="font-semibold text-navy-800">{participants.length} Orang</span>
                          </div>
                          <div className="border-t border-navy-100 my-3 pt-3 space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-navy-400">Biaya Utama Pendaftaran:</span>
                              <span className="font-mono">{formattedBaseFee}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-brand-700 font-semibold flex items-center gap-1">Kode Unik Transfer:</span>
                              <span className="font-mono text-brand-700 font-semibold">Rp {uniqueCode}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-50 rounded-xl p-3.5 border border-brand-100 text-brand-900 mt-4">
                        <span className="text-[10px] font-bold text-brand-600 block uppercase tracking-wider">TOTAL TRANSFER (WAJIB SESUAI):</span>
                        <span className="text-xl font-extrabold block text-navy-950 font-mono tracking-tight mt-0.5">{formattedTotalFee}</span>
                        <p className="text-[10.5px] mt-1.5 leading-snug">Wajib mentransfer pas sampai 3 digit terakhir (<strong className="font-mono text-brand-700">{uniqueCode}</strong>) untuk mempercepat proses verifikasi data olimpiade olahraga.</p>
                      </div>
                    </div>

                    {/* Choose Bank Details & Copy Button */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider mb-2">Metode Pembayaran Transfer</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['BCA', 'MANDIRI', 'GOPAY'].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-2 text-xs font-bold rounded-lg border transition cursor-pointer flex items-center justify-center gap-1 ${
                                paymentMethod === method 
                                  ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-100' 
                                  : 'border-navy-100 bg-white text-navy-600 hover:bg-navy-50'
                              }`}
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>{method}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-navy-100 rounded-xl p-4 space-y-3 shadow-xs">
                        <span className="text-[10px] font-bold text-navy-500 block uppercase">Rekening Tujuan Transfer</span>
                        <div>
                          <span className="text-xs text-navy-400 block font-semibold">{activeBank.bankName}</span>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-sm font-mono font-bold text-navy-950 tracking-wider bg-navy-50 px-2 py-1 rounded" id="bank-acc-no">
                              {activeBank.accountNo}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyAccount(activeBank.accountNo)}
                              className="text-brand-600 hover:text-brand-800 text-xs font-bold flex items-center gap-1 transition"
                            >
                              {isCopied ? (
                                <span className="text-emerald-600 flex items-center gap-1"><Check className="h-4 w-4" /> Tersalin!</span>
                              ) : (
                                <span className="flex items-center gap-1"><Copy className="h-3.5 w-3.5" /> Salin</span>
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-navy-400 block">Atas Nama Rekening:</span>
                          <span className="text-xs font-semibold text-navy-800 block uppercase tracking-tight">{activeBank.accountName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment upload area */}
                  <div className="border border-navy-100 rounded-2xl p-5 bg-white space-y-4">
                    <label className="block text-xs font-bold text-navy-800 uppercase tracking-wider">Unggah Bukti Transfer / Pembayaran Anda</label>
                    
                    {!paymentProofName ? (
                      <div className="border-2 border-dashed border-navy-100 rounded-xl p-6 hover:border-brand-300 hover:bg-brand-50/10 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative" id="drag-drop-payment">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <UploadCloud className="h-10 w-10 text-navy-400 mb-2" />
                        <span className="text-xs font-bold text-navy-800 block">Klik di sini untuk mengunggah file bukti bayar</span>
                        <span className="text-[10px] text-navy-400 mt-1 block">Mendukung format PNG, JPG, JPEG atau PDF (Maksimal 5MB)</span>
                        
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerMockUpload();
                            }}
                            className="bg-navy-50 text-navy-700 hover:bg-brand-50 hover:text-brand-700 text-[11px] font-bold py-1.5 px-3 rounded-lg border border-navy-100 transition"
                            id="btn-demo-file"
                          >
                            Demo Auto-Upload Bukti
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-100 text-brand-700 rounded-lg">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-brand-900 block truncate max-w-xs">{paymentProofName}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold block">Berkas siap diunggah</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProof(null);
                            setPaymentProofName('');
                            setPaymentProofUrl('');
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                          title="Hapus berkas"
                          id="btn-remove-proof"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-navy-600 mb-1">Catatan Tambahan Kepada Panitia (Opsional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Contoh: Ukuran baju official L & XL, request jadwal tanding hari Sabtu sore."
                        rows={2}
                        className="w-full bg-white text-xs rounded-xl py-2 px-3 border border-navy-100 text-navy-900 focus:outline-hidden focus:border-brand-500 font-normal"
                        id="input-notes"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-amber-900 text-[10.5px] leading-relaxed flex gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-amber-600 flex-none mt-0.5" />
                    <div>
                      <span className="font-bold">Konfirmasi Integritas Data & Pembayaran:</span>
                      <p className="mt-0.5 text-amber-800">Dengan mengirimkan form ini, perwakilan sekolah menyatakan bahwa seluruh data peserta adalah orisinal, aktif di sekolah bersangkutan, dan telah melunasi pembayaran pendaftaran sesuai nominal tertera.</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-navy-50">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="py-3 px-5 border border-navy-100 text-navy-600 hover:bg-navy-50 font-bold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      id="btn-back-step-3"
                    >
                      <ArrowLeft className="h-4 w-4" /> Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="py-3 px-8 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl transition shadow-md cursor-pointer"
                      id="btn-submit-registration"
                    >
                      Kirim Pendaftaran & Selesai
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          ) : (
            /* SUCCESS TICKET RECEIPT DISPLAY WRAPPING */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
              id="registration-receipt-success"
            >
              <div className="bg-slate-50 rounded-2xl border border-navy-100 p-6 md:p-8 shadow-inner relative overflow-hidden" id="ticket-receipt-card">
                
                {/* Decorative side ticket notches */}
                <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-white border border-navy-100 -translate-y-1/2 hidden md:block" />
                <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-white border border-navy-100 -translate-y-1/2 hidden md:block" />

                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  
                  {/* Left Side Details */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-700 rounded-md font-bold text-[10px] tracking-wider uppercase">
                        Menunggu Verifikasi Bank
                      </span>
                      <span className="text-[11px] text-navy-400 font-mono font-bold">
                        {new Date(successSubmission.registeredAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-navy-950 tracking-tight">{schoolName}</h3>
                      <p className="text-xs text-navy-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {schoolAddress}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-t border-b border-dashed border-navy-200 py-4 mt-2">
                      <div>
                        <span className="text-[10px] text-navy-400 block font-bold uppercase">Kategori Kompetisi</span>
                        <span className="text-sm font-extrabold text-slate-800">{category.name}</span>
                      </div>
                      
                      {category.isTeam && (
                        <div>
                          <span className="text-[10px] text-navy-400 block font-bold uppercase">Nama Tim Delegasi</span>
                          <span className="text-sm font-extrabold text-brand-600">{successSubmission.teamName}</span>
                        </div>
                      )}

                      <div>
                        <span className="text-[10px] text-navy-400 block font-bold uppercase">Contact Person</span>
                        <span className="text-xs font-semibold text-slate-800 block">{successSubmission.contactName}</span>
                        <span className="text-[10px] text-navy-400 font-mono italic block">{successSubmission.contactPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-navy-400 block font-bold uppercase">Metode Bayar</span>
                        <span className="text-xs font-semibold text-slate-800 block">{successSubmission.paymentMethod}</span>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] text-navy-400 block font-bold uppercase">Total Pembayaran Terkirim</span>
                        <span className="text-sm font-extrabold text-navy-950 font-mono">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(successSubmission.paymentAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Participants table inside receipt */}
                    <div>
                      <span className="text-[10px] text-navy-400 block font-bold uppercase mb-2">Roster Rincian Anggota ({participants.length} Orang):</span>
                      <div className="max-h-40 overflow-y-auto border border-navy-100 rounded-lg bg-white p-2">
                        <ul className="divide-y divide-navy-50 text-[11px]">
                          {participants.map((p, pIdx) => (
                            <li key={pIdx} className="py-1.5 flex justify-between items-center px-1">
                              <span className="font-bold text-navy-900">{pIdx + 1}. {p.name}</span>
                              <span className="font-mono text-navy-400">NISN: {p.identityNumber} | Kelas: {p.class}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Ticket Pass QR Simulation */}
                  <div className="flex-none w-full md:w-48 flex flex-col items-center justify-center p-4 bg-white border border-navy-100 rounded-xl text-center self-stretch">
                    <span className="text-[9px] font-extrabold text-navy-400 uppercase tracking-widest block mb-2">VALIDASI RESMI</span>
                    
                    {/* SVG Mock QR Code */}
                    <div className="h-28 w-28 bg-navy-50 flex items-center justify-center rounded-lg relative ring-4 ring-navy-50">
                      <svg className="h-24 w-24 text-navy-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="2" y="2" width="6" height="6" rx="1" />
                        <rect x="16" y="2" width="6" height="6" rx="1" />
                        <rect x="2" y="16" width="6" height="6" rx="1" />
                        <path d="M16 16h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm4-4h2v2h-2z" />
                        <path d="M10 10h4v4h-4z" />
                        <path d="M14 6h2v2h-2zM6 14h2v2H6z" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-brand-500 text-white rounded-full p-1.5 shadow-sm">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-navy-800 uppercase block mt-3">TICKET-PASS RISE</span>
                    <span className="text-[11px] font-mono text-brand-600 font-extrabold block">{successSubmission.id}</span>
                    <p className="text-[9.5px] mt-1.5 text-navy-400 leading-snug">Simpan tanda terima ini untuk ditunjukkan saat Technical Meeting atau daftar ulang.</p>
                  </div>

                </div>

                {/* Bottom Barcode styling imitation */}
                <div className="border-t border-dashed border-navy-200 mt-6 pt-5 flex items-center justify-between">
                  <div className="hidden sm:block">
                    <div className="h-6 flex items-center gap-0.5 opacity-50">
                      {[1,3,2,1,4,1,3,1,2,3,4,1,2,1,3,2,4,1,2,3,1,1].map((val, key) => (
                        <div key={key} className="bg-black h-full" style={{ width: `${val}px` }} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-navy-400 font-bold tracking-widest uppercase">E-TICKET HEALTHRISE EDUSPORT 2026</span>
                </div>
              </div>

              {/* Action buttons on completion */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-5 bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-print-receipt"
                >
                  <FileText className="h-4 w-4" /> Cetak Bukti Pendaftaran
                </button>
                <button
                  onClick={onCancel} // Back to home and closes panel
                  className="py-2.5 px-5 border border-navy-100 hover:bg-navy-50 text-navy-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  id="btn-return-landing"
                >
                  Selesai & Kembali ke Landing Page
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
