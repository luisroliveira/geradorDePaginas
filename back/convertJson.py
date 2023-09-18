import re

def convert_to_json(input_text):
    persuasive_phrases = re.findall(r'Frases Persuasivas:(.*?)Texto Persuasivo:', input_text, re.DOTALL)
    persuasive_phrases = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in persuasive_phrases[0].split('\n') if line.strip()]

    persuasive_text = re.findall(r'Texto Persuasivo:(.*?)Slogans:', input_text, re.DOTALL)
    persuasive_text = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in persuasive_text[0].split('\n') if line.strip()]

    slogans = re.findall(r'Slogans:(.*?)(?:$|\0)', input_text, re.DOTALL)
    slogans = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in slogans[0].split('\n') if line.strip()]

    json_response = {
        "Frases Persuasivas": persuasive_phrases,
        "Textos Persuasivos": persuasive_text,
        "Slogans": slogans,
        "Descricao": ["On the wall of a house by the sea with a window nearby", "A product shot of Prancha+ should be on the beach at sunset with the warm lighting reflecting off the surfboard and the ocean in the background, instilling a sense of adventure and freedom."]
    }
    return json_response
