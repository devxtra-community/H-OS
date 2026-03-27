import { useState } from 'react';
import { useConsumeItem } from '../hooks/useInventoryActions';
import { useInventory } from '../hooks/useInventory';
import { PackageMinus, X } from 'lucide-react';

export function UseItemModal({ onClose, patientId, preselectedCategory }: { onClose: () => void, patientId?: string, preselectedCategory?: string }) {
    const { data: items } = useInventory();

    const availableItems = items?.filter((i: any) => i.quantity > 0 && (!preselectedCategory || i.category === preselectedCategory)) || [];

    const [selectedItemId, setSelectedItemId] = useState(availableItems[0]?.id || '');
    const [quantity, setQuantity] = useState(1);
    const consumeMutation = useConsumeItem();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const resolvedId = selectedItemId || availableItems[0]?.id;
        if (!resolvedId) return;

        consumeMutation.mutate({ itemId: resolvedId, quantity, patientId }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><PackageMinus size={22} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Use Inventory</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                        <X size={20} />
                    </button>
                </div>

                {availableItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 font-medium">
                        No matching items available in stock.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Item to Consume</label>
                            <select
                                value={selectedItemId || availableItems[0]?.id}
                                onChange={e => setSelectedItemId(e.target.value)}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                                required
                            >
                                {availableItems.map((item: any) => (
                                    <option key={item.id} value={item.id}>{item.name} (In Stock: {item.quantity})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Units Used</label>
                            <input
                                type="number"
                                min="1"
                                max={availableItems.find((i: any) => i.id === (selectedItemId || availableItems[0]?.id))?.quantity || 1}
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={consumeMutation.isPending}
                            className="w-full mt-4 bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-bold transition shadow-md disabled:bg-rose-300"
                        >
                            {consumeMutation.isPending ? 'Logging Usage...' : 'Log Usage'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
