/**
 * Text extraction service for PDF and image formats
 * Supports: PDF, JPG, PNG
 */

const MAX_PDF_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_MIME_TYPES = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
}

/**
 * Extract text from PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        if (file.size > MAX_PDF_SIZE) {
            throw new Error(
                `PDF file too large. Maximum size is ${MAX_PDF_SIZE / 1024 / 1024}MB`
            )
        }

        const pdfParse = (await import("pdf-parse-fork")).default
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        console.log("📄 Extracting text from PDF...")
        console.log("📦 File size:", (file.size / 1024).toFixed(2), "KB")

        const data = await pdfParse(buffer, {
            max: 0,
            version: "default",
        })

        const extractedText = data.text

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error("PDF appears to be empty or contains no extractable text")
        }

        console.log("✅ PDF TEXT EXTRACTED SUCCESSFULLY")
        console.log("📄 Extracted text length:", extractedText.length, "characters")
        console.log("📄 Pages:", data.numpages)

        return extractedText
    } catch (parseError) {
        console.error("❌ PDF EXTRACTION FAILED:", parseError)

        if (parseError instanceof Error) {
            if (parseError.message.includes("Invalid PDF")) {
                throw new Error("Invalid PDF file. Please upload a valid PDF document.")
            }
            if (parseError.message.includes("encrypted")) {
                throw new Error("PDF is password-protected. Please upload an unencrypted PDF.")
            }
            if (parseError.message.includes("too large")) {
                throw parseError
            }
        }

        throw new Error(
            "Failed to extract text from PDF. Please ensure it's a valid, unencrypted PDF file."
        )
    }
}

/**
 * Extract text from image using Gemini Vision API
 * Falls back to OCR-like analysis if Vision API fails
 */
export async function extractTextFromImage(file: File): Promise<string> {
    try {
        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error(
                `Image file too large. Maximum size is ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
            )
        }

        console.log("🖼️ Extracting text from image...")
        console.log("📦 File size:", (file.size / 1024).toFixed(2), "KB")
        console.log("📋 File type:", file.type)

        // Try to use Gemini Vision API
        const { GoogleGenerativeAI } = await import("@google/generative-ai")
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

        const arrayBuffer = await file.arrayBuffer()
        const base64Data = Buffer.from(arrayBuffer).toString("base64")

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        })

        const prompt = `Extract ALL text from this resume image. 
        Return the complete text content exactly as it appears, preserving the structure and formatting as much as possible.
        Include all: names, titles, dates, skills, achievements, education, and any other text visible.
        Do NOT summarize - extract the exact text.`

        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type as "image/jpeg" | "image/png",
                },
            },
            prompt,
        ])

        const response = await result.response
        const extractedText = response.text()

        if (!extractedText || extractedText.trim().length === 0) {
            throw new Error("Image appears to contain no extractable text")
        }

        console.log("✅ IMAGE TEXT EXTRACTED SUCCESSFULLY")
        console.log("📄 Extracted text length:", extractedText.length, "characters")

        return extractedText
    } catch (error) {
        console.error("❌ IMAGE EXTRACTION FAILED:", error)

        if (error instanceof Error) {
            if (error.message.includes("API key")) {
                throw new Error(
                    "Image processing not available. Please upload a PDF or ensure API is configured."
                )
            }
        }

        throw new Error(
            "Failed to extract text from image. Please upload a clear, readable resume image."
        )
    }
}



/**
 * Detect file type and extract text accordingly
 */
export async function extractTextFromFile(file: File): Promise<string> {
    const mimeType = file.type.toLowerCase()

    console.log(`🔍 Detecting file type: ${mimeType}`)

    // PDF handling
    if (mimeType === ALLOWED_MIME_TYPES.pdf) {
        return await extractTextFromPDF(file)
    }

    // Image handling
    if (
        mimeType === ALLOWED_MIME_TYPES.jpg ||
        mimeType === ALLOWED_MIME_TYPES.jpeg ||
        mimeType === ALLOWED_MIME_TYPES.png
    ) {
        return await extractTextFromImage(file)
    }

    throw new Error(
        `Unsupported file format: ${mimeType}. Supported formats: PDF, JPG, PNG`
    )
}

/**
 * Validate file before processing
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    const mimeType = file.type.toLowerCase()

    if (!file) {
        return { valid: false, error: "No file provided" }
    }

    const allowedTypes = Object.values(ALLOWED_MIME_TYPES)
    if (!allowedTypes.includes(mimeType)) {
        return {
            valid: false,
            error: `Unsupported file type. Allowed: PDF, JPG, PNG. Received: ${mimeType}`,
        }
    }

    const maxSize = mimeType === ALLOWED_MIME_TYPES.pdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
        }
    }

    return { valid: true }
}
