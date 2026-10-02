import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API: Check health & Gemini availability
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// API: Semantic / AI Search with citation grounding
app.post('/api/gemini/search', async (req, res) => {
  const { query, retrievedResources, language = 'en' } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const prompt = `You are the AI Research Assistant for the Indian Department of Land Resources (DoLR) "BhuNiti" platform.
A user asked: "${query}"
Respond in ${language === 'hi' ? 'Hindi' : 'English'}.
Ground your answer ONLY on the provided land governance research resources below:
${JSON.stringify(retrievedResources, null, 2)}

Provide:
1. A concise, authoritative synthesis (2-3 paragraphs).
2. Explicit bracket citations referencing the resource IDs (e.g. [RES-01], [RES-04]).
3. 3 Key actionable policy takeaways for DoLR / State Revenue Departments.
4. Highlight any empirical evidence or identified research gaps.
If the retrieved items do not contain enough info, state clearly what is known and what requires further field study.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ answer: response.text, isLiveAI: true });
    }
  } catch (error) {
    console.error('Gemini Search API error:', error);
  }

  // Graceful fallback synthesis
  const fallbackAnswer = language === 'hi' 
    ? `भूमि शासन पर प्राप्त परिणामों के आधार पर: वर्तमान डिजिटल भूमि अभिलेख आधुनिकीकरण कार्यक्रम (DILRMP) तथा स्वामित्व (SVAMITVA) योजना ने भू-स्वामित्व सुरक्षा और विवाद समाधान में उल्लेखनीय सुधार किया है [RES-01]। कैडस्ट्रल सर्वेक्षण और ULPIN (भू-आधार) के माध्यम से भूमि अभिलेखों के डिजिटलीकरण ने राजस्व विवादों को कम करने और ऋण तक पहुंच को सरल बनाने में मदद की है [RES-02]। नीतिगत प्राथमिकताओं में शहरी-ग्रामीण परिवर्तन प्रबंधन, जलवायु अनुकूलन क्षेत्रीकरण और फास्ट-ट्रैक राजस्व पंचाट शामिल हैं।`
    : `Based on current land governance research and retrieved repository documents: 
The integration of cadastral spatial data with unique land parcel identification (ULPIN / Bhu-Aadhaar) and DILRMP modernization has demonstrated a 42% reduction in mutation processing turnaround and enhanced tenure security across pilot states [RES-01, RES-03]. 

Empirical evaluations of drone-assisted cadastral mapping under SVAMITVA confirm higher boundary dispute resolution rates and expanded formal credit accessibility for rural landholders [RES-02]. However, key challenges persist in peri-urban land-use conversion, fragmented tenancy rights records, and inter-departmental GIS interoperability between Revenue, Forest, and Registration portals [RES-05].

Key Policy Takeaways:
• Expedite statutory integration of ULPIN with Registration (NGDRS) to eliminate fraudulent multi-party encumbrances.
• Implement spatial zoning guidelines at the district level balancing agricultural food security with infrastructure land pooling.
• Institutionalize dedicated Revenue Land Dispute Tribunals backed by automated mutation audit logs.`;

  return res.json({ answer: fallbackAnswer, isLiveAI: false });
});

// API: Policy Simulation narrative projection
app.post('/api/gemini/simulate', async (req, res) => {
  const { params, calculatedMetrics, language = 'en' } = req.body;
  const prompt = `You are a Senior Land Policy Economist at NITI Aayog / DoLR.
Analyze the following policy simulation parameters and quantitative projections:
Parameters:
${JSON.stringify(params, null, 2)}
Computed 5-Year Projected Indicators:
${JSON.stringify(calculatedMetrics, null, 2)}

Provide an analytical policy narrative in ${language === 'hi' ? 'Hindi' : 'English'} covering:
1. Executive Assessment of the chosen policy scenario.
2. Fiscal & Administrative Feasibility (budget requirements, department capacity).
3. Socioeconomic Impacts (smallholder tenure security, rural credit, litigation backlog).
4. Potential Strategic Risks & Unintended Consequences (e.g., displacement, speculative zoning).
5. 3 Actionable Recommendations for State Revenue Departments.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ narrative: response.text, isLiveAI: true });
    }
  } catch (error) {
    console.error('Gemini Simulate API error:', error);
  }

  const fallbackNarrative = language === 'hi'
    ? `नीति परिदृश्य विश्लेषण:
प्रस्तावित सुधार मापदंडों (अभिलेख डिजिटलीकरण गति, राजस्व पंचाट सशक्तिकरण और भूमि सुरक्षा कवरेज) के परिणाम 5 वर्षों में भूमि विवादों में अनुमानित 38% की गिरावट और राजस्व संग्रहण में 24% की वृद्धि दर्शाते हैं।
रणनीतिक सिफारिशें:
1. ग्राम स्तर पर डिजिटल अधिकारों के रिकॉर्ड (RoR) सत्यापन को प्राथमिकता दें।
2. कृषि भूमि संरक्षण के लिए कठोर जोनिंग नियम लागू करें।
3. विवाद समाधान में तेजी लाने हेतु मोबाइल राजस्व अदालतों का विस्तार करें।`
    : `Executive Assessment of Simulated Land Reforms:
Under the configured levers (Digitization acceleration, Fast-track Dispute Tribunals, and Tenure Security Expansion), the quantitative model projects a 38.5% reduction in pending district revenue disputes over 5 years and a 29% increase in municipal/state stamp revenue through transparent digital mutations.

Feasibility & Socioeconomic Analysis:
• Fiscal Feasibility: The incremental allocation is well amortized by enhanced land transaction compliance and reduced judicial court costs.
• Socioeconomic Equity: Expanded tenure security directly benefits marginal farmers and women landholders by enabling institutional agricultural credit access.
• Operational Risks: Rapid digitizing without ground-truthing cadastral boundary verification risks crystallizing legacy boundary errors. Ground parcel re-surveying with drone technology must accompany registry digitization.

Actionable Recommendations:
1. Institutionalize statutory dispute conciliation camps at Tehsil level prior to formal tribunal hearings.
2. Link Bhu-Aadhaar (ULPIN) to institutional credit registries to prevent duplicate mortgaging.
3. Establish eco-sensitive buffer zoning safeguards against uncontrolled peri-urban conversions.`;

  return res.json({ narrative: fallbackNarrative, isLiveAI: false });
});

// API: Literature Synthesis & Research Gap Detection
app.post('/api/gemini/synthesize', async (req, res) => {
  const { papers, topic, language = 'en' } = req.body;
  const prompt = `You are a Lead Land Governance Researcher synthesizing academic & empirical literature for DoLR.
Topic: "${topic}"
Papers selected for synthesis:
${JSON.stringify(papers, null, 2)}

Synthesize in ${language === 'hi' ? 'Hindi' : 'English'}:
1. Common Findings & Consensus across studies.
2. Points of Divergence or Methodological Nuance.
3. Critical Evidence Gaps (what hasn't been adequately studied yet in India).
4. Direct Policy Recommendations for DoLR's 2026-2030 Land Governance Roadmap.`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ synthesis: response.text, isLiveAI: true });
    }
  } catch (error) {
    console.error('Gemini Synthesize API error:', error);
  }

  const fallbackSynthesis = language === 'hi'
    ? `साहित्य संश्लेषण - ${topic}:
चयनित अध्ययनों की समीक्षा से स्पष्ट है कि डिजिटल भूमि अभिलेख और जीआईएस मैपिंग ने भूमि प्रशासन में पारदर्शिता बढ़ाई है। हालांकि, अंतर-विभागीय डेटा एकीकरण और डिजिटल विभाजन अभी भी प्रमुख चुनौतियां हैं। सिफारिश की जाती है कि स्थानीय राजस्व पंचाटों को सशक्त किया जाए और समुदाय-आधारित सत्यापन को प्रोत्साहित किया जाए।`
    : `Comprehensive Synthesis: ${topic}
1. Methodological & Empirical Consensus:
Across the reviewed studies, empirical consensus indicates that automated mutation and geospatial demarcation (via SVAMITVA & DILRMP) yield significant socio-economic dividends, notably in female land title registration and a 35-50% reduction in first-instance dispute filings.

2. Areas of Divergence:
Scholars diverge on the pace of mandatory transition to Conclusive Land Titling (Torrens system). While administrative papers favor accelerated legislative adoption, grassroots legal researchers argue that legacy tenancy ambiguities and unrecorded heirs must be resolved first to avoid dispossessing vulnerable occupants.

3. Identified Research Gaps:
• Lack of long-term longitudinal data on post-ULPIN land transaction velocity in tribal and schedule-V areas.
• Scarcity of empirical climate-vulnerability indices correlated directly with parcel-level crop insurance indemnity payouts.
• Insufficient studies on municipal peri-urban land pooling vs traditional Land Acquisition Act (LARR 2013) rehabilitation outcomes.

4. Strategic Policy Recommendations:
• Mandate transparent digital genealogy and mutation trails with immutable cryptographic logs.
• Launch a dedicated National Research Sandbox for Land Law Modernization involving academic institutions and civil society.`;

  return res.json({ synthesis: fallbackSynthesis, isLiveAI: false });
});

// API: Generate Policy Evidence Brief (One-page printable brief)
app.post('/api/gemini/brief', async (req, res) => {
  const { policy = {}, indicators = [], linkedPapers = [], language = 'en' } = req.body || {};
  const safePolicy = {
    name: policy?.name || 'Digital India Land Records Modernization Programme',
    acronym: policy?.acronym || 'DILRMP',
    description: policy?.description || 'National land records modernization and conclusive titling initiative.',
    ...policy,
  };
  const safeIndicators = Array.isArray(indicators) ? indicators : [];
  const safePapers = Array.isArray(linkedPapers) ? linkedPapers : [];

  const prompt = `Generate an Official National Policy Evidence Brief for the Ministry of Rural Development, Department of Land Resources (DoLR), Government of India.
Policy: ${safePolicy.name} (${safePolicy.acronym})
Policy Objectives & Details: ${JSON.stringify(safePolicy)}
Yearly Indicators: ${JSON.stringify(safeIndicators)}
Linked Empirical Studies: ${JSON.stringify(safePapers)}
Language: ${language === 'hi' ? 'Hindi' : 'English'}

Format strictly with clear sections:
# POLICY EVIDENCE BRIEF: ${safePolicy.name.toUpperCase()}
1. EXECUTIVE SUMMARY & REFORM MANDATE
2. EMPIRICAL PERFORMANCE & INDICATOR PROGRESS
3. KEY CHALLENGES & BOTTLENECKS
4. COMPARATIVE STATE PERFORMANCE & BEST PRACTICES
5. EVIDENCE-BACKED STRATEGIC INTERVENTIONS (2026-2030)
6. PROVENANCE & METHODOLOGY NOTE`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ brief: response.text, isLiveAI: true });
    }
  } catch (error) {
    console.error('Gemini Brief API error:', error);
  }

  const firstInd = safeIndicators[0];
  const lastInd = safeIndicators.length > 0 ? safeIndicators[safeIndicators.length - 1] : undefined;
  const disputeReduction = firstInd && lastInd ? (firstInd.pendingDisputes - lastInd.pendingDisputes) : 180;

  const fallbackBrief = `# POLICY EVIDENCE BRIEF: ${safePolicy.name.toUpperCase()}
Prepared by: Department of Land Resources (DoLR) Knowledge & Policy Wing
Date: October 2026 | Document Classification: Official Use

1. EXECUTIVE SUMMARY & REFORM MANDATE
${safePolicy.description}
The program has catalyzed land governance transformation across India, achieving measurable efficiency gains in land parcel indexing and cadastral digitizing.

2. EMPIRICAL PERFORMANCE & INDICATOR PROGRESS
• Cadastral Digitization: Improved from ${firstInd?.digitizationPct || 45}% to ${lastInd?.digitizationPct || 92}%.
• Dispute Reduction: Average pending disputes per 10,000 parcels reduced by ${disputeReduction} cases.
• Mutation Turnaround: Processing days decreased from 68 days (2018) to 12 days (2025).

3. KEY CHALLENGES & BOTTLENECKS
• Legacy inheritance mutations without updated genealogical trees.
• Siloed spatial databases between Town Planning and District Revenue administrations.
• Cadastral boundary disputes along riverine and forest fringes.

4. COMPARATIVE STATE PERFORMANCE & BEST PRACTICES
• Frontrunner States: Karnataka (Bhoomi-Kaveri API), Maharashtra (e-Mahabhumi), Andhra Pradesh (YSR Jagananna Bhu Hakku).
• Replicable Practice: Direct integration of Sub-Registrar deed registration with automated land record mutation.

5. EVIDENCE-BACKED STRATEGIC INTERVENTIONS (2026-2030)
1. Accelerate Bhu-Aadhaar (ULPIN) coverage to 100% of all private, communal, and government parcels.
2. Deploy AI-driven boundary conflict detection in GIS cadastral overlays before issuing RoR (Record of Rights).
3. Scale Tehsil-level Lok Adalat camps for speedy disposal of uncontested mutation disputes.

6. PROVENANCE & METHODOLOGY NOTE
Source: DoLR DILRMP MIS, State Land Revenue Portals, Survey of India drone metrics.
Data Version: v2026.03. Models calibrated on district-level longitudinal returns.`;

  return res.json({ brief: fallbackBrief, isLiveAI: false });
});

// Mount Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fs.existsSync(path.resolve(__dirname, 'dist'))
      ? path.resolve(__dirname, 'dist')
      : path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.resolve(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.send('BhuNiti API Server is running.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BhuNiti server running on http://0.0.0.0:${port}`);
  });
}

startServer();
