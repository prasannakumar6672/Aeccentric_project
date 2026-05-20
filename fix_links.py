import glob

files = glob.glob('frontend/src/pages/*.jsx')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace("textDecoration: \\'none\\'", "textDecoration: 'none'")
    
    if content != new_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print('Fixed ' + f)
