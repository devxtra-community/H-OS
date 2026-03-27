'use client'

import { useState } from 'react'
import { Package, Plus, Search } from 'lucide-react'
import { useInventory } from '../../../../features/inventory/hooks/useInventory'
import { AddStockModal } from '../../../../features/inventory/components/AddStockModal'
import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider'
import { useRouter } from 'next/navigation'

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
        <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
    );

    const filteredItems = items?.filter((item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* 🔴 Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border gap-4">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                        <Package size={24} />
                    </div>
                    Inventory Management
                </h1>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-blue-700 transition font-medium w-full sm:w-auto justify-center"
                >
                    <Plus size={20} />
                    Add / Restock
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    placeholder="Search by name or category (e.g. Paracetamol, CONSUMABLE)..."
                    className="w-full focus:outline-none bg-transparent font-medium text-slate-700"
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            {filteredItems?.length === 0 ? (
                <div className="bg-white rounded-2xl border shadow-sm p-8 text-center text-slate-500 font-medium">
                    No inventory items found. Add stock to begin.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems?.map((item: any) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col justify-between group">
                            <div>
                                <span className="px-2.5 py-1 text-xs font-bold tracking-wide rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                    {item.category}
                                </span>
                                <h3 className="font-bold text-xl text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                            </div>
                            <div className="mt-8 pt-4 border-t border-slate-100 flex items-end justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                                    <p className={`text-3xl font-bold ${item.quantity === 0 ? 'text-rose-500' : item.quantity < 20 ? 'text-amber-500' : 'text-slate-800'}`}>
                                        {item.quantity}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showAddModal && <AddStockModal onClose={() => setShowAddModal(false)} items={items || []} />}
        </div>
    )
}
