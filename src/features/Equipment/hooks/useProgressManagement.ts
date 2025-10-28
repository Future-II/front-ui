import { useCallback } from 'react';
import { useSocket } from '../../../shared/context/SocketContext';
import { useProgress } from '../../../shared/context/ProgressContext';
import { ProgressState } from '../types';

// Add the missing delay function
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useProgressManagement = () => {
    const { socket, isConnected } = useSocket();
    const { progressStates, dispatch } = useProgress();

    const updateProgress = useCallback((reportId: string, updates: Partial<ProgressState>) => {
        dispatch({
            type: 'UPDATE_PROGRESS',
            payload: { reportId, updates }
        });
    }, [dispatch]);

    const clearProgress = useCallback((reportId: string) => {
        dispatch({
            type: 'CLEAR_PROGRESS',
            payload: { reportId }
        });
    }, [dispatch]);

    const calculateProgress = useCallback((data: any): number => {
        if (data?.percentage !== undefined) {
            return data.percentage;
        } else if (data?.current && data?.total) {
            return Math.round((data.current / data.total) * 100);
        } else {
            // Estimate progress based on status
            switch (data.status) {
                case 'INITIALIZING':
                case 'FETCHING_RECORD':
                    return 5;
                case 'NAVIGATING':
                    return 10;
                case 'STEP_STARTED':
                    if (data?.step && data?.total_steps) {
                        return Math.round((data.step / data.total_steps) * 60);
                    }
                    return 20;
                case 'STEP_COMPLETE':
                    if (data?.step && data?.total_steps) {
                        return Math.round(((data.step + 1) / data.total_steps) * 60);
                    }
                    return 40;
                case 'MACRO_PROCESSING':
                case 'MACRO_EDIT':
                case 'RETRY_PROGRESS':
                    return data?.percentage || 70;
                case 'MACRO_COMPLETE':
                case 'MACRO_EDIT_COMPLETE':
                    return 85;
                case 'CHECKING':
                case 'CHECK_STARTED':
                    return 90;
                case 'RETRYING':
                case 'RETRY_STARTED':
                    return 50;
                case 'RETRY_COMPLETE':
                case 'CHECK_COMPLETE':
                    return 95;
                case 'COMPLETE':
                    return 100;
                case 'REPORT_SAVED':
                    return 80;
                default:
                    return 0;
            }
        }
    }, []);

    const updateProgressFromSocket = useCallback((data: any) => {
        const { reportId, status, message, data: progressData } = data;
        const progress = calculateProgress({ ...progressData, status });

        updateProgress(reportId, {
            status,
            message,
            progress,
            data: progressData
        });
    }, [calculateProgress, updateProgress]);

    const handleCompletion = useCallback(async (reportId: string) => {
        updateProgress(reportId, {
            progress: 100,
            message: 'Complete!',
            status: 'COMPLETE'
        });
        await delay(2000);
        clearProgress(reportId);
    }, [updateProgress, clearProgress]);

    const handleError = useCallback(async (reportId: string, error: string) => {
        updateProgress(reportId, {
            message: `Error: ${error}`,
            progress: 0,
            status: 'FAILED'
        });
        await delay(3000);
        clearProgress(reportId);
    }, [updateProgress, clearProgress]);

    const emitSocketEvent = useCallback((event: string, data: any) => {
        if (!socket || !isConnected) {
            console.error('[SOCKET] Socket not connected');
            alert('Connection lost. Please refresh the page.');
            return false;
        }
        socket.emit(event, data);
        return true;
    }, [socket, isConnected]);

    return {
        progressStates,
        updateProgress,
        clearProgress,
        updateProgressFromSocket,
        handleCompletion,
        handleError,
        emitSocketEvent
    };
};