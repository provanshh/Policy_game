
// ============================================================
//  ZYND SEARCH SERVICE
//  Queries the n8n AI agent for welfare scheme discovery.
//  Falls back to a curated local dataset if n8n is offline.
// ============================================================

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export interface SchemeResult {
    name: string;
    ministry: string;
    eligibility: string;
    benefits: string;
    applyAt: string;
    approvalTime: string;
    relevanceScore: number;
    approvalProbability: number;
}

export interface ZyndSearchResponse {
    schemes: SchemeResult[];
    topRecommendations: string[];
    playerInsight: string;
    actionPlan: string;
}

// Curated offline dataset — used when n8n is unreachable
const LOCAL_SCHEMES: SchemeResult[] = [
    {
        name: 'PM-KISAN Samman Nidhi',
        ministry: 'Ministry of Agriculture',
        eligibility: 'Small & marginal farmers with landholding up to 2 hectares',
        benefits: '₹6,000/year in 3 equal installments',
        applyAt: 'pmkisan.gov.in or Common Service Centre',
        approvalTime: '30-45 days',
        relevanceScore: 92,
        approvalProbability: 85,
    },
    {
        name: 'PM Awas Yojana (Gramin)',
        ministry: 'Ministry of Rural Development',
        eligibility: 'BPL households, no pucca house',
        benefits: '₹1.20 lakh (plains) / ₹1.30 lakh (hills) for house construction',
        applyAt: 'pmayg.nic.in or Gram Panchayat',
        approvalTime: '60-90 days',
        relevanceScore: 78,
        approvalProbability: 68,
    },
    {
        name: 'Ayushman Bharat - PM-JAY',
        ministry: 'Ministry of Health & Family Welfare',
        eligibility: 'SECC 2011 listed families (bottom 40% by income)',
        benefits: '₹5 lakh/year health insurance cover per family',
        applyAt: 'pmjay.gov.in or enrolled hospital',
        approvalTime: 'Immediate (card-based)',
        relevanceScore: 88,
        approvalProbability: 75,
    },
    {
        name: 'PM Fasal Bima Yojana',
        ministry: 'Ministry of Agriculture',
        eligibility: 'Farmers with crop loans (compulsory) or optional enrollment',
        benefits: 'Full insurance cover for crop loss due to natural calamities',
        applyAt: 'Banks, CSC, or pmfby.gov.in',
        approvalTime: '15-30 days post-claim',
        relevanceScore: 80,
        approvalProbability: 70,
    },
    {
        name: 'PM Jan Dhan Yojana',
        ministry: 'Ministry of Finance',
        eligibility: 'All Indian citizens without a bank account',
        benefits: 'Zero-balance account, ₹2 lakh accident insurance, ₹30,000 life cover',
        applyAt: 'Any nationalized bank branch',
        approvalTime: 'Same day',
        relevanceScore: 95,
        approvalProbability: 98,
    },
    {
        name: 'MGNREGS (100 Days Work)',
        ministry: 'Ministry of Rural Development',
        eligibility: 'Any rural household willing to do unskilled manual work',
        benefits: '100 days guaranteed employment @ ₹220-₹333/day (state wise)',
        applyAt: 'Gram Panchayat or nrega.nic.in',
        approvalTime: '15 days',
        relevanceScore: 72,
        approvalProbability: 90,
    },
];

async function callN8nSearch(
    query: string,
    playerState: string,
    playerRole: string,
    incomeLevel: string
): Promise<ZyndSearchResponse | null> {
    if (!N8N_WEBHOOK_URL) return null;
    try {
        const res = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'search_schemes',
                query,
                playerState,
                playerRole,
                incomeLevel,
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data?.success && data?.searchResults) {
            return data.searchResults as ZyndSearchResponse;
        }
        return null;
    } catch {
        return null;
    }
}

export const ZyndSearchService = {
    /**
     * Search for welfare schemes using the n8n AI agent.
     * Falls back to local curated dataset if n8n is unreachable.
     */
    search: async (
        query: string,
        playerState: string = 'Punjab',
        playerRole: string = 'Farmer',
        incomeLevel: string = 'Low'
    ): Promise<ZyndSearchResponse> => {
        console.log(`[ZyndSearch] Querying: "${query}" — ${playerState} / ${playerRole}`);

        const n8nResult = await callN8nSearch(query, playerState, playerRole, incomeLevel);
        if (n8nResult) {
            console.log(`[ZyndSearch] ✅ AI: Found ${n8nResult.schemes.length} schemes`);
            return n8nResult;
        }

        // Offline fallback — filter by query keywords
        console.log('[ZyndSearch] ⚠️ Using offline scheme database.');
        await new Promise(resolve => setTimeout(resolve, 600));

        const q = query.toLowerCase();
        const filtered = LOCAL_SCHEMES.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.ministry.toLowerCase().includes(q) ||
            s.eligibility.toLowerCase().includes(q) ||
            s.benefits.toLowerCase().includes(q)
        );

        const schemes = (filtered.length > 0 ? filtered : LOCAL_SCHEMES)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5);

        return {
            schemes,
            topRecommendations: schemes.slice(0, 3).map(s => s.name),
            playerInsight: `Based on your profile as a ${playerRole} in ${playerState}, you have strong eligibility for several schemes. Your income level qualifies you for priority targeting.`,
            actionPlan: `1. Apply for PM-KISAN first (fastest approval). 2. Get Ayushman Bharat card at nearest hospital. 3. Open Jan Dhan account if not done. 4. Register for MGNREGS at Gram Panchayat.`,
        };
    },
};
