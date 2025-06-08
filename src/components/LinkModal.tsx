import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (url: string) => void;
}

export const LinkModal = ({ isOpen, onClose, onConfirm }: LinkModalProps) => {
    const [url, setUrl] = useState('');

    const handleConfirm = () => {
        if (url) {
            onConfirm(url);
            setUrl('');
            onClose();
        }
    };

    const handleClose = () => {
        setUrl('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4">Insert Link</h2>
                <Input
                    type="url"
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mb-4"
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Insert</Button>
                </div>
            </div>
        </div>
    );
};

export default LinkModal; 