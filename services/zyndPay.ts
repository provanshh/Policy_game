
import { Transaction, PaymentPack } from '../types';

// ============================================================
//  ZYND PAY SERVICE
//  PRIMARY: Real-time via n8n agent webhook
//  FALLBACK: Local simulation (if n8n is not running)
// ============================================================

// Replace with your actual n8n webhook URL after importing the workflow.
// Example: https://vanshsingla.app.n8n.cloud/webhook/zynd-agent
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export const ADVISORY_PACKS: PaymentPack[] = [
    { id: 'pack_bronze', name: 'Starter Pack', tokens: 5, price: 10, icon: '🪙' },
    { id: 'pack_silver', name: 'Strategy Pack', tokens: 20, price: 30, icon: '💰' },
    { id: 'pack_gold', name: 'Validator Pack', tokens: 50, price: 60, icon: '🏦' },
];

/** Try calling the real n8n agent; returns null on failure */
async function callN8n<T>(payload: object): Promise<T | null> {
    if (!N8N_WEBHOOK_URL) return null;
    try {
        const res = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export const ZyndPayService = {
    /**
     * Step 1: Create a transaction.
     * Tries the n8n agent first; falls back to local simulation.
     */
    createTransaction: async (playerEmail: string, pack: PaymentPack): Promise<Transaction> => {
        console.log(`[ZyndPay] Initiating transaction for ${playerEmail} — ${pack.name}`);

        const n8nResult = await callN8n<{ success: boolean; transaction: Transaction }>({
            action: 'create_transaction',
            playerEmail,
            pack,
        });

        if (n8nResult?.success && n8nResult.transaction) {
            console.log(`[ZyndPay] ✅ n8n: Transaction created — ${n8nResult.transaction.id}`);
            return n8nResult.transaction;
        }

        // Local simulation fallback
        console.log('[ZyndPay] ⚠️ Falling back to local simulation.');
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            id: `ZYND_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            amount: pack.price,
            tokensPaid: pack.tokens,
            status: 'pending',
            timestamp: Date.now(),
            purpose: `Advisory Token Pack: ${pack.name}`,
        };
    },

    /**
     * Step 2: Verify payment by calling n8n webhook (or simulating).
     */
    verifyPayment: async (
        transactionId: string,
        playerEmail: string,
        packTokens: number
    ): Promise<boolean> => {
        console.log(`[ZyndPay] Verifying transaction ${transactionId}...`);

        const n8nResult = await callN8n<{ success: boolean; result: { verified: boolean } }>({
            action: 'verify_payment',
            transactionId,
            playerEmail,
            packTokens,
        });

        if (n8nResult !== null) {
            const verified = n8nResult.success && n8nResult.result?.verified;
            console.log(`[ZyndPay] ${verified ? '✅ Verified' : '❌ Rejected'} via n8n`);
            return verified;
        }

        // Local simulation fallback (95% success)
        await new Promise(resolve => setTimeout(resolve, 1500));
        return Math.random() < 0.95;
    },
};
