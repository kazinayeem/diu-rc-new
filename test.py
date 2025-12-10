


import os
import re
from pathlib import Path


EXTENSIONS = {
    '.js', '.jsx', '.ts', '.tsx',  
    '.py',                          
    '.css', '.scss',                
    '.html', '.htm'                 
}


SKIP_DIRS = {
    'node_modules', '.git', 'dist', 'build', 
    '.next', '_pycache_', 'venv', 'env'
}

def remove_js_ts_comments(content):
    
    
    content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
    
    content = re.sub(r'/\.?\*/', '', content, flags=re.DOTALL)
    return content

def remove_python_comments(content):
    
    
    content = re.sub(r'
    
    content = re.sub(r'', '', content, flags=re.DOTALL)
    content = re.sub(r"", '', content, flags=re.DOTALL)
    return content

def remove_css_comments(content):
    
    content = re.sub(r'/\.?\*/', '', content, flags=re.DOTALL)
    return content

def remove_html_comments(content):
    
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    return content

def process_file(file_path):
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        ext = file_path.suffix.lower()
        
        
        if ext in {'.js', '.jsx', '.ts', '.tsx'}:
            content = remove_js_ts_comments(content)
        elif ext == '.py':
            content = remove_python_comments(content)
        elif ext in {'.css', '.scss'}:
            content = remove_css_comments(content)
        elif ext in {'.html', '.htm'}:
            content = remove_html_comments(content)
        
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def remove_all_comments(root_dir='.'):
    
    root_path = Path(root_dir)
    processed = 0
    modified = 0
    
    print("🔍 Scanning for code files...")
    print(f"📁 Root directory: {root_path.absolute()}")
    print("-" * 60)
    
    for file_path in root_path.rglob('*'):
        
        if file_path.is_dir():
            continue
        
        
        if any(skip_dir in file_path.parts for skip_dir in SKIP_DIRS):
            continue
        
        
        if file_path.suffix.lower() in EXTENSIONS:
            processed += 1
            print(f"Processing: {file_path.relative_to(root_path)}")
            
            if process_file(file_path):
                modified += 1
                print(f"  ✅ Comments removed")
            else:
                print(f"  ⏭️  No comments found")
    
    print("-" * 60)
    print(f"\n📊 Summary:")
    print(f"   Files processed: {processed}")
    print(f"   Files modified: {modified}")
    print(f"   Files unchanged: {processed - modified}")
    print("\n✨ Done!")

def main():
    
    print("=" * 60)
    print("  REMOVE COMMENTS SCRIPT")
    print("=" * 60)
    print()
    
    
    print("⚠️  WARNING: This will remove ALL comments from code files!")
    print("   Supported: JS, TS, Python, CSS, HTML")
    print()
    
    response = input("Do you want to continue? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print()
        
        if os.path.exists('frontend'):
            print("\n📦 Processing frontend...")
            remove_all_comments('frontend')
        
        if os.path.exists('backend'):
            print("\n📦 Processing backend...")
            remove_all_comments('backend')
        
        if not os.path.exists('frontend') and not os.path.exists('backend'):
            print("\n📦 Processing current directory...")
            remove_all_comments('.')
    else:
        print("\n❌ Operation cancelled.")

if __name__ == '__main__':
    main()