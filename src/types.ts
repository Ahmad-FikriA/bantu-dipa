export type CategoryType = 'olahraga' | 'kreativitas';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  fee: number;
  isTeam: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  description: string;
  rules: string[];
  schedule: string;
  iconName: string;
}

export interface Participant {
  name: string;
  identityNumber: string; // NISN or student ID
  class: string; // e.g., "11 IPA 2"
}

export interface Registration {
  id: string;
  schoolName: string;
  schoolAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  categoryId: string;
  teamName?: string;
  participants: Participant[];
  paymentMethod: string;
  paymentProofName?: string;
  paymentProofUrl?: string; // local simulation standard url or just state
  registeredAt: string;
  status: 'Menunggu Pembayaran' | 'Menunggu Verifikasi' | 'Terverifikasi' | 'Dibatalkan';
  paymentAmount: number;
  notes?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'futsal',
    name: 'Futsal (Putra)',
    type: 'olahraga',
    fee: 350000,
    isTeam: true,
    minTeamSize: 10,
    maxTeamSize: 12,
    description: 'Turnamen futsal antar siswa SMA/SMK sederajat untuk unjuk ketangkasan, kerja sama tim, dan sportivitas tinggi.',
    rules: [
      'Setiap sekolah maksimal mengirimkan 2 tim perwakilan.',
      'Siswa aktif dibuktikan dengan kartu pelajar atau surat keterangan sekolah.',
      'Satu tim terdiri dari maksimal 12 pemain (5 utama, 7 cadangan) dan 2 official.',
      'Durasi pertandingan adalah 2 x 15 menit bersih (knockout stage).',
      'Pemain wajib menggunakan pelindung tulang kering (shinguard) dan kaos kaki panjang.'
    ],
    schedule: '12 - 14 Juni 2026',
    iconName: 'Dribbble' // represented as Ball or custom Lucide icon
  },
  {
    id: 'badminton-single',
    name: 'Badminton Tunggal Putra/Putri',
    type: 'olahraga',
    fee: 100000,
    isTeam: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    description: 'Kategori tunggal bulu tangkis yang kompetitif, melatih kelincahan dan ketahanan fisik perorangan.',
    rules: [
      'Kategori dipisah antara Tunggal Putra dan Tunggal Putri.',
      'Format permainan menggunakan sistem gugur dengan skor 21 x 3 (Rally Point).',
      'Pemain memboyong raket sendiri; panitia hanya menyediakan shuttlecock resmi.',
      'Wajib mengenakan kaos olahraga sekolah atau pakaian olahraga sopan.',
      'Keterlambatan lebih dari 10 menit setelah panggilan ketiga dianggap walk out (WO).'
    ],
    schedule: '13 - 14 Juni 2026',
    iconName: 'Award'
  },
  {
    id: 'badminton-double',
    name: 'Badminton Ganda Campuran',
    type: 'olahraga',
    fee: 175000,
    isTeam: true,
    minTeamSize: 2,
    maxTeamSize: 2,
    description: 'Kategori ganda campuran menguji kekompakan, chemistry, dan taktik bertahan-menyerang berpasangan.',
    rules: [
      'Satu pasangan terdiri dari 1 putra dan 1 putri dari sekolah yang sama.',
      'Kedua pemain harus terdaftar sebagai siswa aktif.',
      'Menggunakan sistem gugur (rally point 21).',
      'Pemain wajib hadir 30 menit sebelum jadwal tanding untuk registrasi ulang.'
    ],
    schedule: '14 Juni 2026',
    iconName: 'Users'
  },
  {
    id: 'esport-mlbb',
    name: 'Mobile Legends: Bang Bang',
    type: 'olahraga',
    fee: 120000,
    isTeam: true,
    minTeamSize: 5,
    maxTeamSize: 6,
    description: 'Ajang adu taktik, mikro-makro gameplay, dan kerja sama tim dalam arena Land of Dawn.',
    rules: [
      'Satu tim berisikan 5 pemain inti dan maksimal 1 cadangan.',
      'Semua anggota tim harus berasal dari satu instansi sekolah yang sama.',
      'Kompetisi dimainkan secara offline di venue utama (Aula EduSport).',
      'Dilarang keras melakukan cheat, eksploitasi bug, chat toxic, atau taunting berlebih.',
      'Sistem pertandingan BO3 untuk semifinal & final, BO1 untuk babak penyisihan.'
    ],
    schedule: '15 Juni 2026',
    iconName: 'Gamepad2'
  },
  {
    id: 'esport-valorant',
    name: 'Valorant Tactical Shooter',
    type: 'olahraga',
    fee: 120000,
    isTeam: true,
    minTeamSize: 5,
    maxTeamSize: 6,
    description: 'Uji ketajaman aim, koordinasi utility, dan strategi taktis tim kamu di turnamen taktis Valorant.',
    rules: [
      'Satu tim berisikan 5 pemain utama dan 1 cadangan.',
      'Akun Valorant pemain harus sesuai dengan yang didaftarkan (tidak boleh ganti Nickname/Riot ID).',
      'Wajib membawa gear gaming pribadi (mouse, keyboard, headset) jika ingin kenyamanan ekstra.',
      'Map pool ditentukan oleh panitia sebelum pertandingan mulai.'
    ],
    schedule: '16 Juni 2026',
    iconName: 'Target'
  },
  {
    id: 'poster-design',
    name: 'Desain Poster Digital (Tema: Edu Sport & Healthy Life)',
    type: 'kreativitas',
    fee: 50000,
    isTeam: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    description: 'Salurkan bakat seni digital kamu untuk merancang poster edukasi yang persuasif dan memukau bertema gaya hidup sehat.',
    rules: [
      'Karya harus orisinal, tidak mengandung unsur SARA/pornografi, dan belum pernah didelegasikan di lomba lain.',
      'Ukuran poster adalah A3, resolusi minimal 300 DPI dalam format PDF/JPEG.',
      'Peserta diberikan waktu pengerjaan mandiri dan wajib melakukan presentasi konsep singkat selama 5 menit di hari penilaian.',
      'Elemen poster dilarang menggunakan AI Generator secara penuh; elemen orisinal/ilustrasi orisinal dinilai tinggi.'
    ],
    schedule: 'Pengumpulan batas akhir: 10 Juni 2026 | Presentasi: 13 Juni 2026',
    iconName: 'Palette'
  },
  {
    id: 'video-edukasi',
    name: 'Sinematik Video Edukasi Kreatif',
    type: 'kreativitas',
    fee: 75000,
    isTeam: true,
    minTeamSize: 1,
    maxTeamSize: 3,
    description: 'Buat video pendek edukatif/sinematik berdurasi 1-3 menit yang menginspirasi generasi muda untuk aktif bergerak dan menjaga nutrisi tubuh.',
    rules: [
      'Anggota tim maksimal 3 siswa (boleh lintas kelas).',
      'Durasi video minimal 60 detik, maksimal 180 detik (termasuk credit title).',
      'Video diunggah ke Reels Instagram atau TikTok dengan menandai akun resmi HealthRise.',
      'Format video vertikal (9:16) dengan resolusi minimal 1080p.'
    ],
    schedule: 'Batas Upload: 11 Juni 2026 | Penjurian & Awarding: 17 Juni 2026',
    iconName: 'Video'
  },
  {
    id: 'photography',
    name: 'Fotografi Jurnalistik EduSport',
    type: 'kreativitas',
    fee: 45000,
    isTeam: false,
    minTeamSize: 1,
    maxTeamSize: 1,
    description: 'Abadikan momen-momen emas penuh emosi perjuangan atletik dan ekspresi kreativitas selama ajang HealthRise berlangsung.',
    rules: [
      'Pengambilan foto dilakukan langsung di area lomba HealthRise EduSport (on-the-spot).',
      'Menggunakan kamera profesional (DSLR/Mirrorless) atau smartphone berspesifikasi tinggi.',
      'Editing diperbolehkan sebatas cropping, saturation, contrast, tanpa mengubah keaslian objek (no manipulasi foto).',
      'Peserta wajib menyerahkan 2 karya terbaik.'
    ],
    schedule: 'On-The-Spot: 12 - 14 Juni 2026 | Upload: 15 Juni 2026',
    iconName: 'Camera'
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-2026-001',
    schoolName: 'SMA Negeri 8 Jakarta',
    schoolAddress: 'Jl. Taman Bukit Duri, Tebet, Jakarta Selatan',
    contactName: 'Andi Wijaya',
    contactEmail: 'andi.wijaya@sma8jkt.sch.id',
    contactPhone: '081234567890',
    categoryId: 'futsal',
    teamName: 'Delapan FC',
    participants: [
      { name: 'Andi Wijaya', identityNumber: '0061234501', class: '12 IPA 1' },
      { name: 'Budi Santoso', identityNumber: '0061234502', class: '12 IPA 1' },
      { name: 'Chandra Putra', identityNumber: '0061234503', class: '11 IPS 2' },
      { name: 'Dedi Kurniawan', identityNumber: '0061234504', class: '12 IPA 2' },
      { name: 'Eko Raharjo', identityNumber: '0061234505', class: '11 IPA 3' },
      { name: 'Farez Hakim', identityNumber: '0061234506', class: '12 IPS 1' },
      { name: 'Gilang Ramadhan', identityNumber: '0061234507', class: '10-3' },
      { name: 'Hendra Setiawan', identityNumber: '0061234508', class: '12 IPA 3' },
      { name: 'Indra Lesmana', identityNumber: '0061234509', class: '11 IPA 1' },
      { name: 'Joni Iskandar', identityNumber: '0061234510', class: '11 IPS 1' }
    ],
    paymentMethod: 'Bank Transfer (BCA)',
    paymentProofName: 'bukti_bayar_sma8.jpg',
    registeredAt: '2026-05-24T14:32:00Z',
    status: 'Terverifikasi',
    paymentAmount: 350000,
    notes: 'Kaus tim utama berwarna Biru-Putih.'
  },
  {
    id: 'REG-2026-002',
    schoolName: 'SMAS Kanisius Jakarta',
    schoolAddress: 'Jl. Menteng Raya No.64, Jakarta Pusat',
    contactName: 'Rian Hartono',
    contactEmail: 'rian.h@kanisius.sch.id',
    contactPhone: '081398765432',
    categoryId: 'esport-mlbb',
    teamName: 'CC Esport Gold',
    participants: [
      { name: 'Rian Hartono', identityNumber: '0078129301', class: '11 IPA 4' },
      { name: 'Kevin Christian', identityNumber: '0078129302', class: '11 IPA 4' },
      { name: 'Adrian Susanto', identityNumber: '0078129303', class: '11 IPS 1' },
      { name: 'Michael Wijaya', identityNumber: '0078129304', class: '12 IPA 2' },
      { name: 'Samuel Wilson', identityNumber: '0078129315', class: '12 IPA 3' }
    ],
    paymentMethod: 'GoPay / E-Wallet',
    paymentProofName: 'gopay_kanisius.png',
    registeredAt: '2026-05-25T09:12:00Z',
    status: 'Terverifikasi',
    paymentAmount: 120000,
    notes: 'Mohon info detail lokasi tanding.'
  },
  {
    id: 'REG-2026-003',
    schoolName: 'SMK Negeri 26 Jakarta',
    schoolAddress: 'Jl. Balai Pustaka Baru No.1, Rawamangun, Jakarta Timur',
    contactName: 'Siti Rahmawati',
    contactEmail: 'siti.rahma@smkn26jkt.sch.id',
    contactPhone: '081822334455',
    categoryId: 'poster-design',
    participants: [
      { name: 'Siti Rahmawati', identityNumber: '0054321098', class: '12 Grafika 1' }
    ],
    paymentMethod: 'Bank Transfer (Mandiri)',
    paymentProofName: 'trf_smk26.jpg',
    registeredAt: '2026-05-25T16:45:00Z',
    status: 'Menunggu Verifikasi',
    paymentAmount: 50000,
    notes: 'Desain bertema Kesehatan di Era Digital.'
  },
  {
    id: 'REG-2026-004',
    schoolName: 'SMA Negeri 70 Jakarta',
    schoolAddress: 'Jl. Bulungan Blok C No.1, Kebayoran Baru, Jakarta Selatan',
    contactName: 'Dimas Aditya',
    contactEmail: 'dimas.adit@sman70.sch.id',
    contactPhone: '085712123434',
    categoryId: 'badminton-single',
    participants: [
      { name: 'Dimas Aditya', identityNumber: '0069812450', class: '11 IPS 3' }
    ],
    paymentMethod: 'Bank Transfer (BCA)',
    paymentProofName: 'bca_dimas_70.png',
    registeredAt: '2026-05-26T02:15:00Z',
    status: 'Menunggu Verifikasi',
    paymentAmount: 100000,
    notes: 'Kategori Tunggal Putra.'
  }
];

export const TIMELINE_EVENTS = [
  {
    date: '15 Mei - 10 Juni 2026',
    title: 'Gelombang Pendaftaran',
    desc: 'Pengisian formulir registrasi dan unggah kelengkapan administrasi secara online.',
    status: 'Berlangsung'
  },
  {
    date: '11 Juni 2026',
    title: 'Technical Meeting (TM)',
    desc: 'Penjelasan detail regulasi, pembagian jadwal tanding, dan pengundian bagan/grouping.',
    status: 'Akan Datang'
  },
  {
    date: '12 - 16 Juni 2026',
    title: 'Match-Days & Penjurian',
    desc: 'Pelaksanaan kompetisi cabang olahraga (futsal, badminton, esport) dan rangkaian live presentasi desain & video.',
    status: 'Akan Datang'
  },
  {
    date: '17 Juni 2026',
    title: 'Grand Finale & Awarding',
    desc: 'Penyerahan medali, piala bergilir piala gubernur, sertifikat juara, dan uang tunai jutaan rupiah.',
    status: 'Akan Datang'
  }
];

export const FAQ_LIST = [
  {
    q: 'Siapa saja yang diperbolehkan mendaftar?',
    a: 'Seluruh siswa dan siswi aktif SMA, SMK, MA, atau sederajat di seluruh Indonesia yang dibuktikan dengan Kartu Pelajar aktif, Surat Keterangan Kepala Sekolah, atau NISN.'
  },
  {
    q: 'Apakah satu sekolah boleh mengirimkan lebih dari 1 perwakilan?',
    a: 'Ya, diperbolehkan. Untuk kategori beregu seperti Futsal, maksimal 2 tim per sekolah. Sementara kategori individu tidak memiliki batasan ketat asal slot peserta masih tersedia.'
  },
  {
    q: 'Bagaimana sistem pembayaran pendaftaran?',
    a: 'Pembayaran dapat ditransfer ke rekening resmi panitia (BCA / Mandiri) atau melalui e-wallet (GoPay/OVO/Dana). Kode pembayaran unik akan dihitung secara otomatis saat mengisi formulir pendaftaran.'
  },
  {
    q: 'Apakah pendaftaran bisa dibatalkan atau direfund?',
    a: 'Uang pendaftaran yang telah diverifikasi tidak dapat dikembalikan, namun Anda dapat melakukan pergantian nama anggota tim maksimal sebelum sesi Technical Meeting berlangsung.'
  },
  {
    q: 'Di mana lokasi piala dan tanding fisik dilaksanakan?',
    a: 'Pertandingan olahraga utama (Futsal, Badminton, Esport) diselenggarakan di GOR EduSport Jakarta Selatan. Fasilitas didukung ruang medis lengkap, tribun penonton, serta refreshment area.'
  }
];
