import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

export interface CategoryCardProps {
  category: Category;
  onRegisterClick: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onRegisterClick }) => {
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);

  // Dynamically resolve custom lucide icons using type assertion
  const getIcon = (name: string) => {
    // Falls back to simple Award icon if not found
    const IconComponent = (Icons as any)[name] || Icons.Award;
    return <IconComponent className="h-6 w-6 text-brand-600" id={`icon-${category.id}`} />;
  };

  const formattedFee = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(category.fee);

  return (
    <div className="h-full">
      <motion.div
        layout
        id={`cat-card-${category.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full bg-white rounded-none border border-navy-900/15 hover:border-brand-500 shadow-none hover:shadow-[4px_4px_0px_0px_#2d5bff] transition-all duration-200 overflow-hidden group"
      >
      {/* Visual top border indicating event type */}
      <div 
        className={`h-1.5 w-full ${
          category.type === 'olahraga' ? 'bg-[#2d5bff]' : 'bg-navy-900'
        }`}
      />

      <div className="p-6 flex-1 flex flex-col justify-between" id={`cat-body-${category.id}`}>
        <div>
          {/* Header Area */}
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-none border border-navy-900/10 ${
              category.type === 'olahraga' ? 'bg-brand-50' : 'bg-navy-50'
            }`}>
              {getIcon(category.iconName)}
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border border-current rounded-none ${
              category.type === 'olahraga' 
                ? 'text-brand-500 bg-brand-50/50' 
                : 'text-navy-900 bg-navy-50'
            }`}>
              {category.type}
            </span>
          </div>

          {/* Title and description */}
          <h3 className="text-xl font-black uppercase tracking-tight text-navy-950 mb-2 group-hover:text-brand-500 transition-colors duration-150">
            {category.name}
          </h3>
          <p className="text-xs text-navy-400 leading-relaxed mb-4 font-normal">
            {category.description}
          </p>

          {/* Logistics specs */}
          <div className="space-y-2 border-t border-dashed border-navy-100 pt-4 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-navy-400 font-medium uppercase tracking-wider text-[10px]">Tipe Peserta:</span>
              <span className="font-bold text-navy-900 text-[11px]">
                {category.isTeam 
                  ? `Beregu (${category.minTeamSize}-${category.maxTeamSize} Orang)` 
                  : 'Individu (Perorangan)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-navy-400 font-medium uppercase tracking-wider text-[10px]">Jadwal Acara:</span>
              <span className="font-bold text-navy-900 text-[11px] flex items-center gap-1">
                <Icons.Calendar className="h-3.5 w-3.5 text-brand-500" />
                {category.schedule}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-navy-100 pt-2 mt-2">
              <span className="text-navy-400 font-semibold uppercase tracking-wider text-[10px]">Biaya Registrasi:</span>
              <span className="font-black text-navy-950 text-base font-mono">{formattedFee}</span>
            </div>
          </div>
        </div>

        {/* Accordion / Rules Section */}
        <div className="mt-2 mb-4">
          <button
            onClick={() => setIsRulesExpanded(!isRulesExpanded)}
            className="w-full flex justify-between items-center py-2 text-[10px] font-bold uppercase tracking-wider text-brand-500 hover:text-brand-600 hover:bg-brand-50/50 rounded-none px-2 transition-all border border-transparent hover:border-brand-100"
            id={`btn-rules-toggle-${category.id}`}
          >
            <span>{isRulesExpanded ? 'Sembunyikan Syarat' : 'Lihat Syarat & Aturan'}</span>
            {isRulesExpanded ? (
              <Icons.ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <Icons.ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {isRulesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2 bg-[#fdfdfd] rounded-none p-3 border border-dashed border-navy-900/10"
              >
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-navy-800 mb-1.5 flex items-center gap-1">
                  <Icons.ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> Regulasi Utama:
                </h4>
                <ul className="list-disc pl-4 text-xs text-navy-400 space-y-1">
                  {category.rules.map((rule, index) => (
                    <li key={index} className="leading-snug">{rule}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => onRegisterClick(category.id)}
          className="w-full inline-flex justify-center items-center py-3.5 px-4 bg-navy-900 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-widest rounded-none transition-all duration-150 gap-2 cursor-pointer shadow-none"
          id={`btn-reg-${category.id}`}
        >
          <span>Daftar Sekarang</span>
          <Icons.ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  </div>
  );
}

export default CategoryCard;
