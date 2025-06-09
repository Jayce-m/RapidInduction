import pandas as pd

def find_question_topics(file_path, search_string, sheet_name=0):
    """
    Search for a question in the SAQs column and return all matching topics and sections.
    
    Args:
        file_path: Path to Excel file
        search_string: Question text to search for
        sheet_name: Sheet name or index (default: 0 for first sheet)
    
    Returns:
        List of dictionaries with section, topic, and row number for each match
    """
    # Read the Excel file
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
    except Exception as e:
        print(f"Error reading file: {e}")
        return []
    
    # Debug: print column names
    print(f"Columns found: {list(df.columns)}")
    
    # Ensure columns exist
    if 'SAQs' not in df.columns:
        print("Error: 'SAQs' column not found")
        print(f"Available columns: {list(df.columns)}")
        return []
    
    # Find all rows where the search string appears in the SAQs column
    # Convert to string and handle NaN values
    saqs_column = df['SAQs'].fillna('').astype(str)
    
    # Search for the string (case-insensitive)
    matches = saqs_column.str.contains(search_string, case=False, na=False)
    
    # Get all matching rows
    matching_rows = df[matches]
    
    if matching_rows.empty:
        print(f"No matches found for: '{search_string}'")
        return []
    
    # Extract section and topic for each match
    results = []
    for idx, row in matching_rows.iterrows():
        # Forward fill section and topic if they're empty
        # (assumes section/topic apply to subsequent rows until changed)
        section = row['SECTION'] if pd.notna(row['SECTION']) else None
        topic = row['TOPIC'] if pd.notna(row['TOPIC']) else None
        
        # If section or topic is empty, look backwards to find the last non-empty value
        if not section:
            for i in range(idx, -1, -1):
                if pd.notna(df.loc[i, 'SECTION']):
                    section = df.loc[i, 'SECTION']
                    break
        
        if not topic:
            for i in range(idx, -1, -1):
                if pd.notna(df.loc[i, 'TOPIC']):
                    topic = df.loc[i, 'TOPIC']
                    break
        
        results.append({
            'row': idx + 2,  # Excel row number (1-based + header)
            'section': section,
            'topic': topic,
            'saq_content': row['SAQs'][:200] + '...' if len(str(row['SAQs'])) > 200 else row['SAQs']
        })
    
    return results


if __name__ == "__main__":
    search_text = "List the branches of the coronary arteries and"
    
    results = find_question_topics(
        file_path='data.xlsx',
        search_string=search_text,
        sheet_name=0  # Use first sheet, or specify sheet name like 'Sheet1'
    )
    
    if results:
        print(f"\nFound {len(results)} match(es) for: '{search_text}'\n")
        
        for i, result in enumerate(results, 1):
            print(f"Match {i}:")
            print(f"  Row: {result['row']}")
            print(f"  Section: {result['section']}")
            print(f"  Topic: {result['topic']}")
            print(f"  SAQ excerpt: {result['saq_content'][:100]}...")
            print()
    
    # Another example - search for all instances of a specific question
    search_text2 = "Describe potential sources of bias"
    
    results2 = find_question_topics(
        file_path='data.xlsx',
        search_string=search_text2
    )
    
    # Get unique topics for this question
    if results2:
        unique_topics = set((r['section'], r['topic']) for r in results2)
        print(f"\nThis question appears in {len(unique_topics)} different topic(s):")
        for section, topic in unique_topics:
            print(f"  - {section} / {topic}")