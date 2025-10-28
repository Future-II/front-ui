import { useEffect } from 'react';
import { useSocket } from '../../../shared/context/SocketContext';
import { useProgressManagement } from './useProgressManagement';

export const useSocketManagement = () => {
    const { socket } = useSocket();
    const {
        updateProgressFromSocket,
        handleCompletion,
        handleError,
        updateProgress,
        clearProgress
    } = useProgressManagement();

    useEffect(() => {
        if (!socket) return;

        const handleFormFillProgress = (data: any) => {
            console.log('[SOCKET] Progress update:', data);
            updateProgressFromSocket(data);
        };

        const handleFormFillComplete = (data: any) => {
            console.log('[SOCKET] Form fill complete:', data);
            handleCompletion(data.reportId);
        };

        const handleFormFillError = (data: any) => {
            console.error('[SOCKET] Form fill error:', data);
            handleError(data.reportId, data.error);
        };

        const handleFormFillPaused = (data: any) => {
            console.log('[SOCKET] Form fill paused:', data);
            updateProgress(data.reportId, { paused: true });
        };

        const handleFormFillResumed = (data: any) => {
            console.log('[SOCKET] Form fill resumed:', data);
            updateProgress(data.reportId, { paused: false });
        };

        const handleFormFillStopped = (data: any) => {
            console.log('[SOCKET] Form fill stopped:', data);
            clearProgress(data.reportId);
        };

        // Register event listeners
        socket.on('form_fill_progress', handleFormFillProgress);
        socket.on('form_fill_complete', handleFormFillComplete);
        socket.on('form_fill_error', handleFormFillError);
        socket.on('form_fill_paused', handleFormFillPaused);
        socket.on('form_fill_resumed', handleFormFillResumed);
        socket.on('form_fill_stopped', handleFormFillStopped);

        // Cleanup: remove listeners when component unmounts
        return () => {
            socket.off('form_fill_progress', handleFormFillProgress);
            socket.off('form_fill_complete', handleFormFillComplete);
            socket.off('form_fill_error', handleFormFillError);
            socket.off('form_fill_paused', handleFormFillPaused);
            socket.off('form_fill_resumed', handleFormFillResumed);
            socket.off('form_fill_stopped', handleFormFillStopped);
        };
    }, [socket, updateProgressFromSocket, handleCompletion, handleError, updateProgress, clearProgress]);
};