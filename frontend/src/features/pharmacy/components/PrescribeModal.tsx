import { useState, useEffect } from 'react';
import { useCreatePrescription } from '../hooks/usePharmacyActions';
import { useInventory } from '../../inventory/hooks/useInventory';
import { Pill, X, Plus, Trash2 } from 'lucide-react';

export function PrescribeModal({ onClose, patientId, patientName }: { onClose: () => void, patientId: string, patientName: string }) {
    const { data: inventory } = useInventory();
    const medicines = inventory?.filter((i: any) => i.category === 'MEDICINE') || [];

    const [items, setItems] = useState<{ itemId: string; quantity: number | string; instructions: string }[]>([]);
    const prescribeMutation = useCreatePrescription();

    // Auto-populate first row if medicines exist
    useEffect(() => {
        if (medicines.length > 0 && items.length === 0) {
            setItems([{ itemId: medicines[0].id, quantity: 1, instructions: '' }]);
        }
    }, [medicines, items.length]);

    const handleAddItem = () => {
        if (medicines.length === 0) return;
        setItems([...items, { itemId: medicines[0].id, quantity: 1, instructions: '' }]);
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        const payloadItems = items.map(item => ({
            itemId: item.itemId,
            quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) || 1 : item.quantity,
            instructions: item.instructions
        }));

        prescribeMutation.mutate({ patientId, patientName, items: payloadItems }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl"><Pill size={22} /></div>
                        <h2 className="text-xl font-bold text-slate-800">Write Prescription</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Patient Name</p>
                        <p className="text-lg font-bold text-slate-800">{patientName}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <select
                                        value={item.itemId}
                                        onChange={e => handleUpdateItem(index, 'itemId', e.target.value)}
                                        className="w-full bg-transparent font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 py-2 rounded-lg"
                                        required
                                    >
                                        {medicines.map((med: any) => (
                                            <option key={med.id} value={med.id}>{med.name} (Stock: {med.quantity})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleUpdateItem(index, 'quantity', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        placeholder="Qty"
                                    />
                                </div>
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-rose-500 hover:bg-rose-50 p-2.5 rounded-lg transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={item.instructions}
                                    onChange={e => handleUpdateItem(index, 'instructions', e.target.value)}
                                    placeholder="Doctor instructions (e.g. 1-0-1 for 5 days after food)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>
                    ))}

                    {medicines.length > 0 ? (
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition"
                        >
                            <Plus size={20} /> Add Medicine To List
                        </button>
                    ) : (
                        <div className="text-center p-4 text-slate-400 font-medium bg-slate-50 rounded-xl">No unassigned medicines available in the hospital inventory.</div>
                    )}

                    <button
                        type="submit"
                        disabled={prescribeMutation.isPending || items.length === 0}
                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        {prescribeMutation.isPending ? 'Sending to Pharmacy...' : 'Send Prescription to Pharmacy'}
                    </button>
                </form>
            </div>
        </div>
    );
}
