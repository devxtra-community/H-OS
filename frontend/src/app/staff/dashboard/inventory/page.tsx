'use client';

import { useState } from 'react';
import { Package, Plus, Search, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useInventory } from '../../../../features/inventory/hooks/useInventory';
import { AddStockModal } from '../../../../features/inventory/components/AddStockModal';
import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const { auth } = useStaffAuth();
  const router = useRouter();

  if (auth.staff?.role === 'DOCTOR') {
    router.replace('/staff/dashboard');
    return null;
  }

  const { data: items, isLoading } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600" />
    </div>
  );

  const filteredItems = items?.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-sm shadow-indigo-500/25">
            <Package size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Inventory & Medical Consumables
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Stock Monitor
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track pharmacy stock levels, medical consumables, restock batches, and unit availability
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-indigo-500/25 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Add / Restock Items</span>
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-3">
        <Search className="text-slate-400 shrink-0 ml-1.5" size={18} />
        <input
          placeholder="Filter consumables by item name or category (e.g. Paracetamol, CONSUMABLE)..."
          className="w-full focus:outline-none bg-transparent font-medium text-slate-800 text-xs sm:text-sm placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filteredItems?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">No Matching Inventory Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No items match your search filter "{search}". Try searching another name or add a new stock item.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems?.map((item: any) => {
            const isOutOfStock = item.quantity === 0;
            const isLowStock = item.quantity > 0 && item.quantity < 20;

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                      {item.category}
                    </span>

                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Low Stock
                      </span>
                    ) : null}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mt-3 group-hover:text-indigo-600 transition truncate">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Stock</p>
                    <p
                      className={`text-2xl font-extrabold mt-0.5 ${
                        isOutOfStock
                          ? 'text-rose-600'
                          : isLowStock
                            ? 'text-amber-600'
                            : 'text-slate-900'
                      }`}
                    >
                      {item.quantity} <span className="text-xs font-medium text-slate-400">units</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showAddModal && <AddStockModal onClose={() => setShowAddModal(false)} items={items || []} />}
    </div>
  );
}
