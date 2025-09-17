import os
import json
import google.generativeai as genai

def handler(event, context):
    # This is the main function Netlify will run
    try:
        # Get the API key from environment variables
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("API Key not found")
        genai.configure(api_key=api_key)

        # Parse the data sent from the frontend
        body = json.loads(event.get('body', '{}'))
        stage = body.get('stage')
        vritti = body.get('vritti')

        # --- Your Gemini AI Logic Goes Here ---
        data_to_return = []
        if stage == 'get_lineages':
            model = genai.GenerativeModel('gemini-1.5-pro-latest')
            prompt = f"Give me a numbered list of 5-7 spiritual lineages that talk about {vritti}. Respond with ONLY the numbered list."
            response = model.generate_content(prompt)
            
            # Simple parsing of a numbered list
            lines = response.text.strip().split('\n')
            data_to_return = [line.split('. ')[1] for line in lines if '. ' in line]
            # Always ensure Advaita Vedanta is an option
            if "Advaita Vedanta" not in data_to_return:
                data_to_return.insert(0, "Advaita Vedanta")

        # --- Return a successful response ---
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'data': data_to_return})
        }

    except Exception as e:
        print(f"Error: {e}")
        # Return an error response
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }