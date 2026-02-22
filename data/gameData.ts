import { Encounter } from '../types';

export const ENCOUNTERS: Record<string, Encounter> = {
  policy_enquiry_node: {
    id: 'policy_enquiry_node',
    title: 'Policy Enquiry Node',
    description: 'A confused citizen is stuck at a digital crossroads with a stack of unindexed forms. They look overwhelmed by the fine print.',
    icon: '👤',
    choices: [
      {
        id: 'help_applicant',
        text: 'Provide Guidance (10 Energy)',
        consequenceText: 'The citizen thanks you. "Finally, someone who speaks human!"',
        foodCost: 10,
        reputationGain: 2,
        flagToSet: 'helped_applicant',
        color: 'bg-emerald-600'
      },
      {
        id: 'verifier_advice',
        text: 'Eligibility Verification',
        consequenceText: 'Your Eligibility Verifier identifies the exact policy mismatch. You gain massive trust by resolving the conflict instantly.',
        requiredPassengerType: 'scholar',
        foodCost: 5,
        reputationGain: 15,
        color: 'bg-indigo-600'
      },
      {
        id: 'ignore_applicant',
        text: 'Proceed with Mission.',
        consequenceText: 'You conserve energy but leave the citizen in bureaucratic limbo.',
        color: 'bg-stone-600'
      }
    ]
  },
  grant_allocation_node: {
    id: 'grant_allocation_node',
    title: 'Grant Allocation Node',
    description: 'A mobile data node pulls alongside. "Your outreach efforts require operational funding," the allocator broadcasts. "Need a credit injection?"',
    icon: '🧺',
    choices: [
      {
        id: 'buy_energy_bulk',
        text: 'Acquire Power Pack (30 Credits for 50 Energy)',
        consequenceText: '"Resource allocation complete. Hub stability is critical for the mission."',
        goldCost: 30,
        foodGain: 50,
        color: 'bg-blue-600'
      },
      {
        id: 'sell_data',
        text: 'Transmit Intelligence (25 Energy for 35 Credits)',
        consequenceText: '"Field metrics received. Credits disbursed to your account."',
        foodCost: 25,
        goldGain: 35,
        color: 'bg-amber-600'
      },
      {
        id: 'hack_funds',
        text: 'Rapid Grant Approval (40% Likelihood)',
        consequenceText: 'Wait, authorization bypassed successfully! You secured a massive funding pool.',
        foodGain: 100,
        goldGain: 150,
        probability: 40,
        color: 'bg-red-900'
      }
    ]
  },
  system_architect: {
    id: 'system_architect',
    title: 'The System Architect',
    description: 'A workspace filled with blueprints for streamlined government APIs. "I can optimize your navigation protocols... for a price."',
    icon: '⚒️',
    choices: [
      {
        id: 'upgrade_speed',
        text: 'Rapid Response API (120 Credits)',
        consequenceText: '"Your agents will process requests at light speed!" Movement speed increases permanently.',
        goldCost: 120,
        flagToSet: 'speed_upgrade',
        color: 'bg-cyan-600'
      },
      {
        id: 'upgrade_capacity',
        text: 'Cloud Agent Clusters (150 Credits)',
        consequenceText: '"More compute for more advocates." You can now carry up to 5 Agents.',
        goldCost: 150,
        flagToSet: 'capacity_upgrade',
        color: 'bg-amber-600'
      },
      {
        id: 'upgrade_efficiency',
        text: 'Logical Semantic Compression (100 Credits)',
        consequenceText: '"Not a bit of data is wasted." Energy consumption rate is significantly reduced.',
        goldCost: 100,
        flagToSet: 'efficiency_upgrade',
        color: 'bg-emerald-700'
      }
    ]
  },
  zynd_search_terminal: {
    id: 'zynd_search_terminal',
    title: 'Zynd Search Terminal',
    description: '"Access the distributed ledger of welfare. What protocol do you seek, Navigator?"',
    icon: '🔍',
    choices: [
      {
        id: 'search_health',
        text: 'Search: Health Protections (15 Energy)',
        consequenceText: 'You found "Ayushman Protocol". Approval likelihood is high with your current documentation.',
        foodCost: 15,
        reputationGain: 10,
        probability: 85,
        color: 'bg-pink-600'
      },
      {
        id: 'search_education',
        text: 'Search: Skill Scholarships (20 Energy)',
        consequenceText: 'Strategic scholarship data indexed. Academic credits identified via optimized search.',
        foodCost: 20,
        goldGain: 40,
        probability: 70,
        color: 'bg-blue-600'
      }
    ]
  },
  encryption_specialist: {
    id: 'encryption_specialist',
    title: 'Encryption Specialist',
    description: 'A logic-gate professional specializing in access keys. "The policy maze is gated by high-level encryption. I can boost your clearance."',
    icon: '⚡',
    choices: [
      {
        id: 'overclock',
        text: 'Clearance Elevation (100 Credits)',
        consequenceText: '"Access granted! Your agents are now bypassing standard protocol latency."',
        goldCost: 100,
        flagToSet: 'speed_upgrade',
        color: 'bg-purple-600'
      },
      {
        id: 'life_support',
        text: 'Local Firewall Patch (80 Credits)',
        consequenceText: 'Subroutines swarm your system, patching policy vulnerabilities. Integrity stabilized.',
        goldCost: 80,
        reputationGain: 5,
        color: 'bg-cyan-500'
      }
    ]
  },
  legitimacy_authenticator: {
    id: 'legitimacy_authenticator',
    title: 'Legitimacy Authenticator',
    description: 'An encrypted module for validating public trust. "System integrity is flagging. Shall I recalibrate your legitimacy parameters?"',
    icon: '🧶',
    choices: [
      {
        id: 'mend_spirit',
        text: 'Recalibrate Integrity (30 Trust)',
        consequenceText: 'Operational trust is traded for system stability. Optimal survival move.',
        reputationCost: 30,
        reputationGain: 0,
        color: 'bg-indigo-700'
      },
      {
        id: 'sacrifice_gold',
        text: 'Commit to Transparency (50 Credits)',
        consequenceText: 'Credits committed to open-source policy reporting. Public Trust increases.',
        goldCost: 50,
        reputationGain: 20,
        color: 'bg-yellow-600'
      }
    ]
  },
  resource_governance_chief: {
    id: 'resource_governance_chief',
    title: 'Resource Governance Chief',
    description: 'Chief administrator of server resources. "High-tier data packets for high-tier navigators. My cluster will keep your Agents optimized."',
    icon: '🍳',
    choices: [
      {
        id: 'royal_feast',
        text: 'Wide-Area Hub Sync (60 Credits)',
        consequenceText: 'Synchronized across all sectors. Your Agents now operate at peak latency metrics!',
        goldCost: 60,
        foodGain: 100,
        reputationGain: 15,
        color: 'bg-pink-600'
      },
      {
        id: 'mercy_rations',
        text: 'Trust Reallocation (15 Trust)',
        consequenceText: 'Your status permits an emergency resource transfer. Mission uptime secured.',
        reputationCost: 15,
        foodGain: 40,
        color: 'bg-amber-700'
      }
    ]
  },
  policy_mirage: {
    id: 'policy_mirage',
    title: 'The Policy Mirage',
    description: 'The data shimmers, revealing a loophole that shouldn\'t exist. Is it a bug or a gift of the system?',
    icon: '✨',
    choices: [
      {
        id: 'investigate_mirage',
        text: 'Audit Loophole (50/50 Chance)',
        consequenceText: 'It was valid! You find a cache of untapped benefits and extra credits.',
        foodGain: 40,
        goldGain: 20,
        color: 'bg-cyan-600'
      },
      {
        id: 'verifier_truth',
        text: 'Verifier\'s Insight',
        consequenceText: 'Your Eligibility Verifier confirms a temporal policy shift. You exploit it, gaining massive Trust and 1 System Heart!',
        requiredPassengerType: 'scholar',
        reputationGain: 25,
        color: 'bg-indigo-700'
      }
    ]
  },
  advocate_mentor: {
    id: 'advocate_mentor',
    title: 'Senior Advocate\'s Post',
    description: 'An experienced policy navigator sits by a terminal. "I guard this data-milestone. My watch is nearly over, but my advocacy is still sharp."',
    icon: '🛡️',
    choices: [
      {
        id: 'advocate_sparring',
        text: 'Advocacy Training',
        consequenceText: 'Your Citizen Advocate and the Mentor exchange strategies. The veteran is impressed and grants you a recommendation.',
        requiredPassengerType: 'guard',
        reputationGain: 15,
        flagToSet: 'mentor_blessing',
        color: 'bg-slate-700'
      },
      {
        id: 'offer_meal',
        text: 'Share Resources (25 Energy)',
        consequenceText: 'The Mentor tells you tales of the Benefit Haven. You gain much Trust and a map of hidden policy paths.',
        foodCost: 25,
        reputationGain: 20,
        goldGain: 50,
        color: 'bg-orange-700'
      }
    ]
  },
  policy_library: {
    id: 'policy_library',
    title: 'Central Policy Library',
    description: 'A massive repository overflowing with scrolls and legal documents. The Archivist looks stressed. "Too many laws, too little logic!"',
    icon: '📚',
    choices: [
      {
        id: 'buy_maps',
        text: 'Buy Policy Maps (40 Credits)',
        consequenceText: 'The maps reveal credit-rich routes. (Gain 50% more Credits from future tokens)',
        goldCost: 40,
        flagToSet: 'secret_maps',
        color: 'bg-blue-600'
      },
      {
        id: 'donate_scrolls',
        text: 'Submit 10 Case Studies',
        consequenceText: 'You share your successful appeals. The Archivist documents your methods!',
        reputationCost: 10,
        reputationGain: 40,
        color: 'bg-indigo-600'
      }
    ]
  },
  regulator_banker: {
    id: 'regulator_banker',
    title: 'The Bureaucratic Banker',
    description: 'A figure in a formal suit sits behind a mobile office. "Efficiency is everything! Need a credit line, or looking to invest your trust?"',
    icon: '💼',
    choices: [
      {
        id: 'reputation_loan',
        text: 'Trade 10 Trust for 100 Credits',
        consequenceText: '"A pleasure. Status is temporary, but funding is operational!"',
        reputationCost: 10,
        goldGain: 100,
        color: 'bg-yellow-700'
      },
      {
        id: 'invest_gold',
        text: 'Invest 50 Credits for Trust',
        consequenceText: 'You sponsor a public webinar. Your reputation for transparency grows.',
        goldCost: 50,
        reputationGain: 25,
        color: 'bg-blue-700'
      }
    ]
  },
  obfuscated_code: {
    id: 'obfuscated_code',
    title: 'The Obfuscated Policy',
    description: 'An ancient, glowing hard drive sits abandoned. You feel a strange pull toward its encrypted contents.',
    icon: '💀',
    choices: [
      {
        id: 'open_relic',
        text: 'Decrypt Drive (Gain 250 Credits)',
        consequenceText: 'The drive is full of funding! But a bureaucratic shadow follows you. (Shadowed: Policy auditors appear more often)',
        goldGain: 250,
        reputationCost: 30,
        flagToSet: 'cursed_navigator',
        color: 'bg-red-950'
      },
      {
        id: 'leave_relic',
        text: 'Ignore it.',
        consequenceText: 'Some files are better left encrypted in the cloud.',
        reputationGain: 5,
        color: 'bg-stone-600'
      }
    ]
  },
  legacy_mainframe: {
    id: 'legacy_mainframe',
    title: 'The Legacy Mainframe',
    description: 'A dust-covered server rack blocks the data-stream. It seems to be missing a logic gate.',
    icon: '🗿',
    choices: [
      {
        id: 'repair_golem',
        text: 'Offer Hardware Bridge (100 Credits)',
        consequenceText: 'The Mainframe awakens! It clears the path and stabilizes your system with its diagnostic tools.',
        goldCost: 100,
        foodGain: 50,
        reputationGain: 20,
        flagToSet: 'mainframe_blessing',
        color: 'bg-cyan-700'
      },
      {
        id: 'verifier_golem',
        text: 'Mainframe Query',
        consequenceText: 'Your Eligibility Verifier fixes the deadlock. The Mainframe grants you 1 System Heart!',
        requiredPassengerType: 'scholar',
        reputationGain: 10,
        color: 'bg-indigo-600'
      }
    ]
  },
  dark_data_broker: {
    id: 'dark_data_broker',
    title: 'Dark Data Broker',
    description: 'A figure whispering from an unindexed server. "I trade in all data... even human logic. Willing to offload an agent for a massive credit transfer?"',
    icon: '🌚',
    choices: [
      {
        id: 'sell_crew',
        text: 'Liquidate Agent Slot (200 Credits)',
        consequenceText: 'You trade one of your advocates for credit liquidity. The network feels darker, and your public trust plummets.',
        goldGain: 200,
        reputationCost: 50,
        action: 'remove_passenger',
        color: 'bg-red-900'
      },
      {
        id: 'refuse_dealer',
        text: 'Maintain Protocol.',
        consequenceText: '"Predictable. The machine hums on without you."',
        reputationGain: 1,
        color: 'bg-stone-600'
      }
    ]
  },
  policy_interpreter_npc: {
    id: 'policy_interpreter_npc',
    title: 'Expert Interpreter',
    description: 'Vibrant data visualizations grow out of this colorful hub. "Need a boost? My logic elixirs can fill your energy and clarify the path."',
    icon: '🌿',
    choices: [
      {
        id: 'buy_elixir',
        text: 'Buy Logic Stream (30 Credits)',
        consequenceText: 'The complex data instantly restores your energy and gives you a new perspective.',
        goldCost: 30,
        foodGain: 100,
        reputationGain: 5,
        color: 'bg-emerald-500'
      },
      {
        id: 'interpreter_collaboration',
        text: 'Interpreter\'s Logic Swap',
        consequenceText: 'Your Policy Interpreter shares a semantic trick. The expert is so impressed she gives you free data packets!',
        requiredPassengerType: 'cook',
        foodGain: 40,
        reputationGain: 10,
        color: 'bg-pink-600'
      }
    ]
  },
  government_liaison: {
    id: 'government_liaison',
    title: 'Government Liaison',
    description: 'A pristine vehicle blocks the path. A liaison leans out. "My journey is difficult and my budget is vast, but my trust in these sectors is... low. Can you assist?"',
    icon: '📜',
    choices: [
      {
        id: 'trade_renown',
        text: 'Trade 20 Trust for 150 Credits',
        consequenceText: 'You spend your social capital to fill your operational budget. A strategic decision.',
        reputationCost: 20,
        goldGain: 150,
        color: 'bg-blue-600'
      },
      {
        id: 'honor_envoy',
        text: 'Provide Advocate Guard',
        consequenceText: 'Your Citizen Advocate ensures safe passage through the next policy fork. The liaison funds you well.',
        requiredPassengerType: 'guard',
        goldGain: 80,
        reputationGain: 10,
        color: 'bg-emerald-700'
      }
    ]
  },
  stranded_beneficiary: {
    id: 'stranded_beneficiary',
    title: 'Stranded Beneficiary',
    description: 'A citizen is lost in a sea of forms. They are desperate for policy assistance.',
    icon: '🛒',
    choices: [
      {
        id: 'matcher_negotiation',
        text: 'Matcher\'s Optimization',
        consequenceText: 'Your Benefit Matcher spots a hidden grant. You secure the funding for everyone!',
        requiredPassengerType: 'merchant',
        goldCost: 20,
        goldGain: 80,
        color: 'bg-yellow-700'
      },
      {
        id: 'trade_supplies',
        text: 'Exchange 15 Energy for 45 Credits',
        consequenceText: 'The citizen is relieved. "You saved my livelihood!" You receive a small grant.',
        foodCost: 15,
        goldGain: 45,
        color: 'bg-amber-600'
      },
      {
        id: 'buy_stock',
        text: 'Secure Energy (30 Credits for 40 Energy)',
        consequenceText: 'They sell you their remaining batteries at a discount to get home faster.',
        goldCost: 30,
        foodGain: 40,
        color: 'bg-blue-600'
      }
    ]
  },
  auditor_toll: {
    id: 'auditor_toll',
    title: 'The Audit Gate',
    description: 'Armed bureaucratic auditors block the path. "Compliance check," their leader sneers.',
    icon: '⚔️',
    choices: [
      {
        id: 'advocate_standoff',
        text: 'Advocate\'s Counter-Argument',
        consequenceText: 'Your Citizen Advocate steps forward with a stack of precedents. The auditors back down.',
        requiredPassengerType: 'guard',
        reputationGain: 5,
        color: 'bg-slate-800'
      },
      {
        id: 'pay_toll',
        text: 'Pay Filing Fee (25 Credits)',
        consequenceText: 'They let you pass with a receipt.',
        goldCost: 25,
        color: 'bg-red-700'
      }
    ]
  },
  cloud_node_resync: {
    id: 'cloud_node_resync',
    title: 'Cloud Node Terminal',
    description: 'The steady hum of data processing. "Synchronize your status, Navigator?"',
    icon: '🍳',
    choices: [
      {
        id: 'snack',
        text: 'Partial Sync (8C -> 15 Energy)',
        consequenceText: 'A minor data refresh to maintain uptime.',
        goldCost: 8,
        foodGain: 15,
        color: 'bg-green-500'
      },
      {
        id: 'platter',
        text: 'Full Sector Sync (30C -> 65 Energy)',
        consequenceText: 'Global metrics updated! Your Agents are re-indexed and ready for complex tasks.',
        goldCost: 30,
        foodGain: 65,
        color: 'bg-green-700'
      }
    ]
  },
  waystation: {
    id: 'waystation',
    title: 'Regional Hub',
    description: 'A major government processing center in the heart of the policy wild.',
    icon: '🚩',
    choices: [
      {
        id: 'resupply',
        text: 'Full System Recharge (40 Credits)',
        consequenceText: 'You top off your energy and run a full diagnostic.',
        goldCost: 40,
        foodGain: 100,
        color: 'bg-cyan-600'
      },
      {
        id: 'help_guards',
        text: 'Donate Energy (25 Energy)',
        consequenceText: 'The local advocates are thankful. Your trust rating increases.',
        foodCost: 25,
        reputationGain: 12,
        color: 'bg-indigo-600'
      }
    ]
  },
  haven_checkpoint: {
    id: 'haven_checkpoint',
    title: 'The Benefit Haven',
    description: 'The golden gates of the Benefit Haven loom ahead. A place of total policy transparency.',
    icon: '🏰',
    choices: [
      {
        id: 'continue_loop',
        text: 'Expand Outreach and Go Further',
        consequenceText: 'You rest for a night and head back into more complex regions.',
        action: 'continue_journey',
        foodGain: 50,
        color: 'bg-emerald-500'
      },
      {
        id: 'retire_journey',
        text: 'Settle in the Haven',
        consequenceText: 'Your mission ends here. You become a permanent advisor at the Haven.',
        action: 'end_journey',
        color: 'bg-amber-400'
      }
    ]
  }
};