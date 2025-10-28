import { useCallback } from 'react';
import { useProgressManagement } from './useProgressManagement';

export const useReportActions = (tabsNum: number) => {
    const {
        updateProgress,
        emitSocketEvent
    } = useProgressManagement();

    const handleSubmit = useCallback((reportId: string) => {
        if (!emitSocketEvent('join_ticket', `report_${reportId}`)) return;
        if (!emitSocketEvent('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user',
            actionType: 'submit'
        })) return;

        updateProgress(reportId, {
            status: 'INITIALIZING',
            progress: 0,
            message: 'Starting form submission...',
            paused: false,
            stopped: false,
            actionType: 'submit'
        });
    }, [emitSocketEvent, tabsNum, updateProgress]);

    const handleRetry = useCallback((reportId: string) => {
        if (!emitSocketEvent('join_ticket', `report_${reportId}`)) return;
        if (!emitSocketEvent('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user',
            actionType: 'retry'
        })) return;

        updateProgress(reportId, {
            status: 'INITIALIZING',
            progress: 0,
            message: 'Starting retry for incomplete macros...',
            paused: false,
            stopped: false,
            actionType: 'retry'
        });
    }, [emitSocketEvent, tabsNum, updateProgress]);

    const handleCheck = useCallback((reportId: string) => {
        if (!emitSocketEvent('join_ticket', `report_${reportId}`)) return;
        if (!emitSocketEvent('start_form_fill', {
            reportId,
            tabsNum,
            userId: 'current_user',
            actionType: 'check'
        })) return;

        updateProgress(reportId, {
            status: 'INITIALIZING',
            progress: 0,
            message: 'Checking asset statuses...',
            paused: false,
            stopped: false,
            actionType: 'check'
        });
    }, [emitSocketEvent, tabsNum, updateProgress]);

    const handlePause = useCallback((reportId: string) => {
        emitSocketEvent('pause_form_fill', { reportId });
    }, [emitSocketEvent]);

    const handleResume = useCallback((reportId: string) => {
        emitSocketEvent('resume_form_fill', { reportId });
    }, [emitSocketEvent]);

    const handleStop = useCallback(async (reportId: string) => {
        emitSocketEvent('stop_form_fill', { reportId });
    }, [emitSocketEvent]);

    return {
        handleSubmit,
        handleRetry,
        handleCheck,
        handlePause,
        handleResume,
        handleStop
    };
};