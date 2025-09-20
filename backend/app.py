from flask import Flask, request, jsonify
import pdfplumber
import re
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure Gemini API - set your API key here or via environment variable
genai.configure(api_key='AIzaSyCuE7menKYdTKo-bJOwA4np_48g-WpdHq4')

def extract_data(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'

        if not text.strip():
            return {
                'name': 'Could not extract text from PDF',
                'email': 'Not found',
                'phone': 'Not found',
                'work_history': ['PDF text extraction failed'],
                'skills': []
            }

        lines = text.split('\n')
        name = lines[0].strip() if lines else 'Unknown'

        # Email extraction
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        email = email_match.group(0) if email_match else 'Not found'

        # Phone extraction (basic US format)
        phone_match = re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)
        phone = phone_match.group(0) if phone_match else 'Not found'

        # Work history - simplistic extraction (look for lines containing years or job titles)
        work_history = []
        for line in lines:
            if re.search(r'\b(19|20)\d{2}\b', line) or any(word in line.lower() for word in ['manager', 'developer', 'engineer', 'analyst']):
                work_history.append(line.strip())

        # Skills - look for common skill keywords
        skills = []
        skill_keywords = ['python', 'javascript', 'react', 'flask', 'ai', 'machine learning', 'data analysis', 'sql', 'html', 'css']
        for keyword in skill_keywords:
            if keyword.lower() in text.lower():
                skills.append(keyword.title())

        return {
            'name': name,
            'email': email,
            'phone': phone,
            'work_history': work_history,
            'skills': skills
        }
    except Exception as e:
        return {
            'name': f'PDF processing error: {str(e)}',
            'email': 'Not found',
            'phone': 'Not found',
            'work_history': ['Error processing PDF'],
            'skills': []
        }

def analyze_with_ai(data):
    try:
        prompt = f"""
        Analyze this CV data comprehensively: {data}

        Provide a detailed analysis with the following structure:

        1. OVERALL_SCORE: Give a score out of 100 based on overall CV quality
        2. SCORE_BREAKDOWN: Break down the score into categories (Experience: X/25, Skills: X/25, Education: X/20, Format: X/15, Keywords: X/15)
        3. STRENGTHS: List 3-5 key strengths of this CV
        4. WEAKNESSES: List 2-3 areas for improvement
        5. KEYWORD_SUGGESTIONS: Suggest 5-7 relevant keywords this CV should include for better ATS compatibility
        6. CONSISTENCY_CHECK: Check for inconsistencies in work history and experience. If found, generate a specific follow-up question for the recruiter. If everything is consistent, respond with 'No issues found'.

        Format your response as a structured analysis with clear sections.
        """

        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"AI analysis unavailable: {str(e)}. Please check your API key configuration."

@app.route('/api/profile', methods=['POST'])
def profile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Save file temporarily
    file_path = 'temp.pdf'
    file.save(file_path)

    try:
        extracted = extract_data(file_path)
        ai_result = analyze_with_ai(extracted)
        return jsonify({
            'extracted_data': extracted,
            'ai_analysis': ai_result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up temp file
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    app.run(debug=True)