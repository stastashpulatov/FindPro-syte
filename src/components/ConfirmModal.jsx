import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    variant = 'danger' // 'danger' | 'info' | 'success'
}) => {
    const [show, setShow] = useState(false);

    const handleClose = useCallback(() => {
        setShow(false);
        setTimeout(() => {
            onClose();
        }, 200);
    }, [onClose]);

    useEffect(() => {
        if (open) {
            setShow(true);
            const onKey = (e) => {
                if (e.key === 'Escape') handleClose();
            };
            window.addEventListener('keydown', onKey);
            return () => window.removeEventListener('keydown', onKey);
        }
    }, [open, handleClose]);

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };

    if (!open) return null;

    const variantStyles = {
        danger: {
            icon: <AlertTriangle className="text-red-600" size={24} />,
            bg: 'bg-red-50',
            btn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        },
        info: {
            icon: <AlertTriangle className="text-blue-600" size={24} />,
            bg: 'bg-blue-50',
            btn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        },
        success: {
            icon: <AlertTriangle className="text-green-600" size={24} />,
            bg: 'bg-green-50',
            btn: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        }
    };

    const style = variantStyles[variant] || variantStyles.info;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${show ? 'bg-black/50 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'}`}
            onMouseDown={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
            >
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                            {style.icon}
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>

                <div className="bg-gray-50 p-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-2">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg shadow-opacity-20 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.btn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
