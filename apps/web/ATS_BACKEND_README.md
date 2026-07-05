# ATS Score Backend Documentation

## Overview

A production-ready backend system for analyzing resumes against target roles using AI (Gemini) with intelligent caching to prevent redundant analysis of the same resume + role combination.

## Features

✅ **Smart Caching** - Same resume + role = same score (no recalculation)
✅ **PDF Support** - Extract text from PDF files
✅ **Image Support** - Extract text from JPG/PNG resume images using Gemini Vision
✅ **AI Analysis** - Gemini Pro for strict ATS scoring
✅ **Fallback** - Basic analysis if AI unavailable
✅ **Detailed Scoring** - Breakdown by formatting, keywords, structure, content
✅ **Actionable Suggestions** - Specific recommendations to improve score

## Architecture

```
/app/api/ats-score/
├── route.ts                    # Main API endpoint handler

/lib/
├── db/
│   └── cache.ts               # File-based caching system
├── services/
│   ├── textExtraction.ts      # PDF/Image text extraction
│   └── atsAnalysis.ts         # AI-powered analysis logic
```

## API Endpoint

### POST `/api/ats-score`

Analyzes a resume against a target role.

**Request:**
```bash
curl -X POST http://localhost:3000/api/ats-score \
  -F "resume=@resume.pdf" \
  -F "targetRole=Software Engineer"
```

**Request Form Data:**
- `resume` (File) - Resume file (PDF, JPG, PNG) - Required
- `targetRole` (String) - Target job position - Required

**Response (Success):**
```json
{
  "success": true,
  "authenticated": true,
  "cached": false,
  "cacheKey": "a1b2c3d4e5f6...",
  "aiPowered": true,
  "analysis": {
    "score": 72,
    "breakdown": {
      "formatting": {
        "score": 22,
        "feedback": ["ATS-friendly structure"]
      },
      "keywords": {
        "score": 28,
        "matchedKeywords": ["React", "JavaScript", "API", "Git"],
        "missingKeywords": ["TypeScript", "Docker"],
        "feedback": ["Missing modern tooling keywords"]
      },
      "structure": {
        "score": 18,
        "feedback": ["Clear section headings"]
      },
      "content": {
        "score": 15,
        "feedback": ["Few quantified achievements"]
      }
    },
    "suggestions": [
      {
        "category": "Keywords",
        "priority": "high",
        "issue": "Missing TypeScript and Docker",
        "suggestion": "Add TypeScript and Docker skills",
        "example": "Skills: React, TypeScript, Docker, Kubernetes",
        "impact": "+8-12 points"
      }
    ],
    "strengths": ["Clean formatting", "Relevant experience"],
    "weaknesses": ["Missing modern tools", "Few metrics"],
    "isCached": false,
    "cacheDate": "2026-01-29T10:30:00Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "File too large. Maximum size: 10MB"
}
```

### GET `/api/ats-score?action=cache-stats`

Get cache statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCached": 42,
    "cacheSizeBytes": 1048576,
    "cacheSizeMB": "1.00",
    "cacheDir": "/.ats-cache"
  }
}
```

### GET `/api/ats-score?action=clear-cache&days=30`

Clear cache entries older than specified days.

**Query Parameters:**
- `action` - "clear-cache"
- `days` - Days threshold (default: 30)

**Response:**
```json
{
  "success": true,
  "message": "Cleared 15 old cache entries (older than 30 days)"
}
```

## File Support

### PDF Files
- **Supported**: Standard, unencrypted PDFs
- **Max Size**: 10MB
- **MIME Type**: `application/pdf`
- **Parser**: pdf-parse-fork (pure JS, Vercel-compatible)

### Image Files (JPG/PNG)
- **Supported**: JPEG and PNG images
- **Max Size**: 5MB
- **MIME Types**: `image/jpeg`, `image/png`
- **Technology**: Gemini Vision API for text extraction

## Caching System

### How It Works

1. **Fingerprinting**: When a resume is uploaded with a target role:
   - Combined resume text + target role → SHA256 hash
   - Same resume + role always produces same hash

2. **Cache Check**: Before analysis:
   - Generate hash from resume text + role
   - Look for cached result with matching hash
   - If found → Return cached result immediately
   - If not found → Perform analysis and cache result

3. **Cache Storage**:
   - Location: `.ats-cache/` directory (auto-created)
   - Format: JSON files named by hash
   - Contains: Analysis result, metadata, timestamps

### Cache Entry Structure

```json
{
  "cacheKey": "a1b2c3d4...",
  "targetRole": "Software Engineer",
  "analysisDate": "2026-01-29T10:30:00Z",
  "resumeTextHash": "b2c3d4e5...",
  "resumeLength": 2500,
  "analysis": {
    "score": 72,
    "breakdown": {...},
    "suggestions": [...],
    "strengths": [...],
    "weaknesses": [...]
  }
}
```

### Benefits

✅ **Instant Results** - Same resume + role = millisecond response
✅ **Cost Savings** - No redundant API calls
✅ **Rate Limiting** - Naturally handles spam/repeated uploads
✅ **Offline Capable** - Works even if AI API temporarily down
✅ **User Experience** - Users see consistent scores

## ATS Scoring Criteria

### Formatting (0-25 points)
- ATS-friendly structure
- Simple fonts (avoid custom fonts)
- No tables, graphics, or special formatting
- Clear hierarchy and spacing

### Keywords (0-35 points)
- Role-specific technical skills present
- Industry-standard tools and frameworks
- Missing keywords heavily penalized
- Match against role requirements

### Structure (0-20 points)
- Clear, standard sections (Experience, Education, Skills)
- Reverse chronological order for work history
- Proper heading hierarchy
- Consistent formatting

### Content (0-20 points)
- Quantified achievements with metrics
- Action verbs and strong language
- Relevant experience to target role
- Specific results, not generic descriptions

### Total Score Interpretation

- **85-100**: Excellent - Highly optimized for ATS
- **70-84**: Good - Solid match for role
- **55-69**: Fair - Some improvements needed
- **40-54**: Poor - Significant optimization required
- **0-39**: Very Poor - Major overhaul needed

## Scoring Strictness

The AI analysis is intentionally strict:
- Most resumes score 45-75
- Scores above 80 are rare (only near-perfect resumes)
- Scores above 88 are exceptional

This ensures meaningful, actionable feedback.

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "File too large" | PDF > 10MB or Image > 5MB | Compress or reduce file size |
| "Unsupported file format" | Not PDF/JPG/PNG | Convert to supported format |
| "Invalid PDF file" | Corrupted or malformed PDF | Try re-saving or regenerating |
| "PDF is password-protected" | Encrypted PDF | Remove encryption and reupload |
| "No extractable text" | Scanned image without OCR | Use image format instead |

## Configuration

### Required Environment Variables

```env
GEMINI_API_KEY=sk_...
```

### Optional

```env
# Cache cleanup (runs on schedule)
CACHE_CLEANUP_DAYS=30
```

## Usage Examples

### JavaScript/TypeScript Client

```typescript
async function analyzeResume(file: File, targetRole: string) {
  const formData = new FormData()
  formData.append("resume", file)
  formData.append("targetRole", targetRole)

  const response = await fetch("/api/ats-score", {
    method: "POST",
    body: formData,
  })

  const result = await response.json()

  if (result.success) {
    console.log(`Score: ${result.analysis.score}`)
    console.log(`Cached: ${result.cached}`)
    
    if (result.cached) {
      console.log("⚡ Instant result from cache!")
    }

    return result.analysis
  } else {
    console.error(result.error)
  }
}
```

### React Hook

```typescript
import { useState } from "react"

function useATSAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = async (file: File, role: string) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("targetRole", role)

      const response = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.analysis)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return { analyze, result, loading, error }
}
```

## Performance

### Response Times

**Cached Results**: ~50-200ms
- Simple cache lookup
- Instant return

**New Analysis**: ~2-10 seconds
- Text extraction: ~500ms-2s (depends on file size)
- AI analysis: ~2-5s (Gemini API latency)
- Cache storage: ~50ms

### Optimization Tips

1. **Reduce File Size** - Smaller PDFs extract faster
2. **Use PDF Format** - Faster than images (skip Vision API)
3. **Batch Uploads** - Cache handles concurrent requests
4. **Clean Cache** - Regularly clear old entries

## Production Deployment

### Vercel Deployment

✅ Works out-of-the-box with Next.js 14+
✅ PDF parsing uses pure JS (no native dependencies)
✅ Cache stored in `.ats-cache/` (ephemeral, will reset on redeploy)

For persistent caching on Vercel:
- Consider using Vercel KV or MongoDB
- Or implement S3-based caching

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Cache directory will be created automatically.

## Troubleshooting

### No results returned
- Check GEMINI_API_KEY is set
- Verify file is valid PDF/image
- Check file isn't corrupted

### Different scores for same resume
- Check cache is working: call `/api/ats-score?action=cache-stats`
- Clear old cache if corrupted: `/api/ats-score?action=clear-cache`
- Ensure resume file wasn't modified

### Out of memory errors
- Reduce MAX_PDF_SIZE or MAX_IMAGE_SIZE constants
- Implement streaming for large files
- Use image files instead of PDFs

### Slow analysis
- Check Gemini API quotas
- Reduce concurrent requests
- Use cached results instead

## Future Enhancements

🚀 **Planned Features**
- [ ] Resume comparison (resume A vs B)
- [ ] Keyword optimization suggestions
- [ ] Cover letter analysis
- [ ] Industry-specific templates
- [ ] Bulk upload analysis
- [ ] Historical tracking dashboard
- [ ] ATS system-specific optimizations (LinkedIn, Indeed, etc.)

## Contributing

Found a bug? Have a feature request? Create an issue or PR!

## License

MIT
