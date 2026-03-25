import { useState } from 'react';
import { useAddStock, useCreateItem } from '../hooks/useInventoryActions';
import { Package, X } from 'lucide-react';

export function AddStockModal({ onClose, items }: { onClose: () => void, items: any[] }) {
    const [tab, setTab] = useState<'EXISTING' | 'NEW'>('EXISTING');

    const [selectedItemId, setSelectedItemId] = useState(items?.[0]?.id || '');
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('MEDICINE');

    const addStockMutation = useAddStock();
    const createItemMutation = useCreateItem();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (tab === 'EXISTING') {
            addStockMutation.mutate({ itemId: selectedItemId || items[0].id, quantity }, {
                onSuccess: () => onClose()
            });
        } else {
            createItemMutation.mutate({ name, category, quantity }, {
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Package size={22} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Add Stock</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setTab('EXISTING')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === 'EXISTING' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Restock
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('NEW')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === 'NEW' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        New Item
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {tab === 'EXISTING' ? (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Item</label>
                            <select
                                value={selectedItemId || items?.[0]?.id}
                                onChange={e => setSelectedItemId(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                required
                            >
                                {items?.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} ({item.category}) - Stock: {item.quantity}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Paracetamol 500mg"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    <option value="MEDICINE">Medicine</option>
                                    <option value="CONSUMABLE">Consumable</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity to Add</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={addStockMutation.isPending || createItemMutation.isPending}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition shadow-md disabled:bg-blue-300"
                    >
                        {addStockMutation.isPending || createItemMutation.isPending ? 'Processing...' : 'Confirm Stock'}
                    </button>
                </form>
            </div>
        </div>
    );
}
