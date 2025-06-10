import pandas as pd
import json

def find_question_topics(file_path, search_string, sheet_name=0):
    """
    Search for a question in the SAQs column and return all matching topics and sections.
    """
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
    except Exception as e:
        print(f"Error reading file: {e}")
        return []
    
    if 'SAQs' not in df.columns:
        print("Error: 'SAQs' column not found")
        return []
    
    # Find all rows where the search string appears in the SAQs column
    saqs_column = df['SAQs'].fillna('').astype(str)
    matches = saqs_column.str.contains(search_string, case=False, na=False)
    matching_rows = df[matches]
    
    if matching_rows.empty:
        return []
    
    # Extract section and topic for each match
    results = []
    for idx, row in matching_rows.iterrows():
        section = row['SECTION'] if pd.notna(row['SECTION']) else None
        topic = row['TOPIC'] if pd.notna(row['TOPIC']) else None
        
        # Look backwards for section/topic if empty
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
            'row': idx + 2,
            'section': section,
            'topic': topic
        })
    
    return results


def update_questions_from_excel(json_file_path, excel_file_path, output_file_path=None, search_length=50):
    """
    Update questions in JSON file with topics from Excel file.
    
    Args:
        json_file_path: Path to input JSON file
        excel_file_path: Path to Excel file with SAQs
        output_file_path: Path to save updated JSON (if None, overwrites input)
        search_length: Number of characters from prompt to use for searching
    """
    # Load JSON data
    with open(json_file_path, 'r') as f:
        questions = json.load(f)
    
    updated_count = 0
    not_found_count = 0
    
    # Process each question
    for question in questions:
        # Get the prompt text
        prompt = question['parts'][0]['prompt']
        
        # Use first X characters for searching
        search_text = prompt[:search_length].strip()
        
        print(f"\nProcessing question ID {question['id']}:")
        print(f"  Searching for: '{search_text}...'")
        
        # Search in Excel
        results = find_question_topics(excel_file_path, search_text)
        
        if results:
            # Use the first match (or you could implement logic to choose best match)
            match = results[0]
            
            # Update the question
            old_topic = question['topic']
            old_subtopic = question['subtopic']
            
            # Replace: section -> topic, topic -> subtopic
            question['topic'] = [match['section']] if match['section'] else old_topic
            question['subtopic'] = [match['topic']] if match['topic'] else old_subtopic
            
            print(f"  ✓ Updated:")
            print(f"    Topic: {old_topic} → {question['topic']}")
            print(f"    Subtopic: {old_subtopic} → {question['subtopic']}")
            
            if len(results) > 1:
                print(f"  Note: Found {len(results)} matches, using first one")
            
            updated_count += 1
        else:
            print(f"  ✗ No match found")
            not_found_count += 1
    
    # Save updated JSON
    output_path = output_file_path or json_file_path
    with open(output_path, 'w') as f:
        json.dump(questions, f, indent=2)
    
    print(f"\n{'='*50}")
    print(f"Summary:")
    print(f"  Total questions: {len(questions)}")
    print(f"  Updated: {updated_count}")
    print(f"  Not found: {not_found_count}")
    print(f"  Output saved to: {output_path}")


# Example usage
if __name__ == "__main__":
    # Update all questions in the JSON file
    update_questions_from_excel(
        json_file_path='data.json',      # Your JSON file
        excel_file_path='data.xlsx',          # Your Excel file
        output_file_path='questions_updated_test.json',  # Save to new file (optional)
        search_length=50                      # Use first 50 characters of prompt
    )
    
    # Or process a single question manually
    # with open('questions.json', 'r') as f:
    #     questions = json.load(f)
    # 
    # question = questions[0]
    # prompt_start = question['parts'][0]['prompt'][:50]
    # results = find_question_topics('data.xlsx', prompt_start)
    # 
    # if results:
    #     print(f"Found {len(results)} matches")
    #     for r in results:
    #         print(f"  Section: {r['section']}, Topic: {r['topic']}")