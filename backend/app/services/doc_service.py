import io
import PyPDF2
import docx

class DocService:
    def read_file(self, filename: str, content_bytes: bytes) -> dict:
        ext = filename.split('.')[-1].lower()
        extracted_text = ""

        try:
            if ext == 'pdf':
                reader = PyPDF2.PdfReader(io.BytesIO(content_bytes))
                pages_text = []
                for page in reader.pages:
                    txt = page.extract_text()
                    if txt:
                        pages_text.append(txt)
                extracted_text = " ".join(pages_text)

            elif ext in ['doc', 'docx']:
                doc = docx.Document(io.BytesIO(content_bytes))
                extracted_text = " ".join([p.text for p in doc.paragraphs if p.text])

            elif ext == 'txt':
                extracted_text = content_bytes.decode('utf-8', errors='ignore')

            else:
                return {"error": f"Unsupported file extension .{ext}", "text": "", "success": False}

            if not extracted_text.strip():
                extracted_text = "No readable text content found in document."

            return {
                "filename": filename,
                "text": extracted_text[:5000],
                "char_length": len(extracted_text),
                "success": True
            }

        except Exception as e:
            return {"error": f"Failed to extract document text: {str(e)}", "text": "", "success": False}

doc_service = DocService()
