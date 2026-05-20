import os
import glob
import re

files = glob.glob('frontend/src/pages/*.jsx')
targets = [
    'AIServicesAutomation.jsx',
    'AIPoweredManufacturing.jsx',
    'DigitalTransformation.jsx',
    'ITProductDevelopment.jsx',
    'ThreeDPrintingSolutions.jsx'
]

for f in files:
    if any(f.endswith(t) for t in targets):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace Start a Project button
        content = re.sub(
            r'<button\s+className="btn-primary"[^>]*>Start a Project',
            r'<Link to="/consultation" className="btn-primary" style={{ textDecoration: \'none\' }}>Start a Project',
            content
        )
        content = re.sub(
            r'Start a Project\s*<ArrowRight\s*size=\{14\}\s*/>\s*</button>',
            r'Start a Project <ArrowRight size={14} /></Link>',
            content
        )
        
        # Replace Book a call button
        content = re.sub(
            r'<button\s+className="book-btn"[^>]*>\s*<Phone\s*size=\{15\}\s*/>\s*Book a Call\s*</button>',
            r'<Link to="/consultation" className="book-btn" style={{ textDecoration: \'none\' }}><Phone size={15} /> Book a Call</Link>',
            content
        )
        
        # Ensure Link is imported
        if 'import { Link }' not in content and '<Link' in content:
            content = content.replace('import { useState', 'import { Link } from "react-router-dom";\nimport { useState')
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print('Updated ' + f)
